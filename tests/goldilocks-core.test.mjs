import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const text = await readFile(new URL('../src/lib/goldilocksDiscovery.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
const core = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    assert.ok(ts.isPropertyAssignment(property))
    return [property.name.text, literal(property.initializer)]
  }))
  throw new Error(`Nonliteral source inventory: ${node.getText()}`)
}
async function sourceValue(path, name) {
  const source = ts.createSourceFile(path, await readFile(new URL(path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
  const declaration = source.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(item => item.name.text === name)
  assert.ok(declaration?.initializer)
  return literal(declaration.initializer)
}
const inventory = await sourceValue('../src/data/destinationGuides.ts', 'DESTINATION_GUIDES')
const windows = await sourceValue('../src/lib/seasonalHelpers.ts', 'BEST_MONTHS')
const guides = inventory.map(g => ({ ...g, image: g.heroImage, months: windows[g.id] ?? [] }))

for (let month = 1; month <= 12; month++) {
  test(`month ${month}: source-backed count, preview and six unique eligible picks`, () => {
    const selection = core.getMonthSelection(guides, month)
    assert.equal(selection.total, guides.filter(g => g.months.includes(month)).length)
    assert.equal(selection.shortlist.length, 6)
    assert.equal(new Set(selection.shortlist.map(g => g.id)).size, 6)
    assert.ok(selection.featured.months.includes(month))
    assert.equal(selection.featured.id, core.MONTHLY_LEADS[month - 1])
    assert.equal(selection.shortlist[0].id, selection.featured.id)
    for (const guide of selection.shortlist) assert.ok(windows[guide.id].includes(month))
    const copy = JSON.stringify(guides)
    core.getMonthSelection(guides, month)
    assert.equal(JSON.stringify(guides), copy, 'selection must not reorder or mutate source data')
  })
}

test('calendar validates all twelve preview windows', () => {
  const previews = core.getMonthPreviews(guides)
  assert.equal(previews.length, 12)
  assert.equal(new Set(previews.map(g => g.id)).size, 12)
  previews.forEach((guide, index) => assert.ok(windows[guide.id].includes(index + 1)))
})

test('invalid months are rejected, not silently repaired', () => {
  for (const month of [0, 13, -1, 1.5, NaN, Infinity]) assert.throws(() => core.getMonthSelection(guides, month), RangeError)
})

test('URL selection accepts only literal 1–12 and preserves the caller local-month fallback', () => {
  for (let month = 1; month <= 12; month++) assert.equal(core.readTravelMonth(`?month=${month}`, 7), month)
  for (const search of ['', '?month=0', '?month=13', '?month=05', '?month=1.0', '?month=NaN', '?month=January', '?month=%3Cscript%3E']) assert.equal(core.readTravelMonth(search, 7), 7)
})

test('image helper restricts scheme/host and bounds image request through explicit width', () => {
  const image = core.discoveryImage(guides[0].image, 480)
  const parsed = new URL(image)
  assert.equal(parsed.searchParams.get('w'), '480')
  assert.equal(parsed.searchParams.get('q'), '80')
  for (const image of ['http://images.unsplash.com/photo-x', 'https://evil.example/photo-x', 'javascript:alert(1)']) assert.throws(() => core.discoveryImage(image, 480))
})
