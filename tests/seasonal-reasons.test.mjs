import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

async function loadCore(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8')
  const js = ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
}
const core = await loadCore('../src/lib/seasonalReasons.ts')
// Synthetic contracts only: example.test is not a retrieved source or a production note.
const fixture = () => ({ sources: [{ id: 'test-source', url: 'https://example.test/climate', title: 'Fixture', publisher: 'Fixture publisher', checkedAt: '2026-10-22', evidence: 'Synthetic contract evidence.' }], notes: [{ destinationId: 'fixture-city', month: 10, why: 'Synthetic reason for October.', tradeoff: 'Synthetic limitation.', sourceIds: ['test-source'] }] })

test('lookup resolves exactly one destination/month without mutating the catalog', () => {
  const catalog = fixture()
  const original = JSON.stringify(catalog)
  const result = core.getSeasonalReason(catalog, 'fixture-city', 10)
  assert.equal(result.why, catalog.notes[0].why)
  assert.equal(result.tradeoff, catalog.notes[0].tradeoff)
  assert.deepEqual(result.sources, catalog.sources)
  assert.equal(JSON.stringify(catalog), original)
  assert.equal(core.getSeasonalReason(catalog, 'fixture-city', 11), null)
  assert.equal(core.getSeasonalReason(catalog, 'unknown-city', 10), null)
})

test('lookup rejects invalid months rather than silently repairing them', () => {
  for (const month of [0, 13, 1.5, NaN, Infinity, '1', null]) assert.throws(() => core.getSeasonalReason(fixture(), 'fixture-city', month), RangeError)
})

test('catalog validation accepts an internally consistent synthetic contract', () => {
  assert.doesNotThrow(() => core.validateSeasonalCatalog(fixture()))
})

test('catalog validation rejects missing evidence, invalid URLs/dates and duplicate identities', () => {
  const cases = [
    c => { c.sources.push({ ...c.sources[0] }) },
    c => { c.notes.push({ ...c.notes[0] }) },
    c => { c.notes[0].sourceIds = ['missing-source'] },
    c => { c.notes[0].sourceIds = [] },
    c => { c.notes[0].month = 13 },
    c => { c.notes[0].why = '' },
    c => { c.notes[0].tradeoff = '' },
    c => { c.sources[0].evidence = '' },
    c => { c.sources[0].url = 'javascript:alert(1)' },
    c => { c.sources[0].url = 'http://example.test/climate' },
    c => { c.sources[0].url = 'https://user:secret@example.test/' },
    c => { c.sources[0].url = 'https://example.test/?utm_source=tracking' },
    c => { c.sources[0].checkedAt = '2026-02-30' },
    c => { c.sources[0].checkedAt = 'tomorrow' },
  ]
  for (const mutate of cases) { const catalog = fixture(); mutate(catalog); assert.throws(() => core.validateSeasonalCatalog(catalog)) }
  const broken = fixture(); broken.sources = []
  assert.throws(() => core.getSeasonalReason(broken, 'fixture-city', 10), /source/i)
})

function literal(node) {
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(p => [p.name.text, literal(p.initializer)]))
  throw new Error(`Nonliteral source value: ${node.getText()}`)
}
async function sourceValue(path, name) {
  const source = ts.createSourceFile(path, await readFile(new URL(path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
  const declaration = source.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.text === name)
  return literal(declaration.initializer)
}

test('production evidence covers every currently rendered month/destination pair, without changing eligibility', async () => {
  const catalog = JSON.parse(await readFile(new URL('../src/data/seasonalReasons.json', import.meta.url), 'utf8'))
  core.validateSeasonalCatalog(catalog)
  const discovery = await loadCore('../src/lib/goldilocksDiscovery.ts')
  const inventory = await sourceValue('../src/data/destinationGuides.ts', 'DESTINATION_GUIDES')
  const windows = await sourceValue('../src/lib/seasonalHelpers.ts', 'BEST_MONTHS')
  const guides = inventory.map(g => ({ ...g, image: g.heroImage, months: windows[g.id] ?? [] }))
  const expected = new Set()
  for (let month = 1; month <= 12; month++) {
    for (const guide of discovery.getMonthSelection(guides, month).shortlist) {
      const note = core.getSeasonalReason(catalog, guide.id, month)
      assert.ok(note, `Missing sourced context: ${guide.id}/${month}`)
      assert.ok(note.sources.length > 0)
      assert.ok(note.why.length <= 240, `${guide.id}/${month}: keep the reason concise`)
      assert.ok(note.tradeoff.length <= 200, `${guide.id}/${month}: keep the caveat concise`)
      expected.add(`${guide.id}:${month}`)
    }
  }
  assert.equal(expected.size, 72)
  const actual = new Set(catalog.notes.map(n => `${n.destinationId}:${n.month}`))
  assert.deepEqual(actual, expected, 'catalog must reflect actual rendered recommendations, not unrelated or invented pairs')
  const known = new Set(inventory.map(g => g.id))
  for (const note of catalog.notes) assert.ok(known.has(note.destinationId))
})
