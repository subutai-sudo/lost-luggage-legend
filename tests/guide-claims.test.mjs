import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { test } from 'node:test'
import ts from 'typescript'

const root = new URL('../', import.meta.url)
const path = 'src/app/guides/[slug]/page.tsx'
const page = await readFile(new URL(path, root), 'utf8')
const catalog = await readFile(new URL('src/data/destinationGuides.ts', root), 'utf8')
const source = ts.createSourceFile(path, page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const fn = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'getArticleContent')
const code = ts.transpileModule(`${fn.getText(source)}\nexport { getArticleContent }`, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { getArticleContent } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(p => [p.name.text, literal(p.initializer)]))
  throw new Error('Non-literal catalog')
}
function records(text) {
  const parsed = ts.createSourceFile('data.ts', text, ts.ScriptTarget.Latest, true)
  const decl = parsed.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.text === 'DESTINATION_GUIDES')
  return literal(decl.initializer)
}
const guides = records(catalog)
const articles = guides.map(guide => ({ id: guide.id, sections: getArticleContent(guide).sections }))
const passages = articles.flatMap(article => article.sections.flatMap(section => [section.title, section.content, ...(section.items ?? [])]))

test('all bespoke and generated prose reject unsupported numeric discounts and savings guarantees', () => {
  for (const text of [...passages, catalog]) {
    assert.doesNotMatch(text, /\b\d+(?:[-–]\d+)?\s*%|half (?:the|as much)|3x more|significant savings/i)
  }
})

test('high-visibility geographic, admission and blanket transport claims are removed', () => {
  for (const text of [...passages, catalog]) assert.doesNotMatch(text, /Kechmich|Indian Ocean side|every resort occupies|included with every resort|JR Pass\) is essential|ranked better than Michelin|cleaner than any taxi|route you perfectly|Anne Frank House: free|huts and tracks are excellent and free|bus \(the only public transport/i)
  const marrakech = guides.find(guide => guide.id === 'marrakech')
  assert.equal(marrakech.subtitle, 'Morocco')
  assert.equal(`${marrakech.title}, ${marrakech.subtitle}`, 'Marrakech, Morocco')
  assert.ok(catalog.includes("destination=Marrakech+Morocco&adults=2"))
})

test('Seville excerpt removes only the erroneous Plaza de Espana river clause', () => {
  const baseline = records(execFileSync('git', ['show', '3d4af2c:src/data/destinationGuides.ts'], { cwd: root, encoding: 'utf8' }))
  const before = baseline.find(guide => guide.id === 'seville').excerpt
  assert.ok(before.includes(' along the Guadalquivir'))
  assert.equal(guides.find(guide => guide.id === 'seville').excerpt, before.replace(' along the Guadalquivir', ''))
})

test('retained numeric cost sections are explicitly undated estimates, never current quotes', () => {
  for (const article of articles) for (const section of article.sections) {
    if (section.title === 'What It Costs' && /\d/.test(section.content)) {
      assert.match(section.content, /^Rough, undated planning estimates — not current supplier quotes\./, article.id)
    }
  }
})

test('generic copy does not turn old originless durations, month windows or transport into guarantees', () => {
  for (const article of articles.filter(article => article.sections[0].title.startsWith('Planning Your '))) {
    const text = JSON.stringify(article.sections)
    assert.doesNotMatch(text, /from (?:most|major) European hubs|best combination of weather|served by major international routes|cover most visitor needs|only marginal weather/i)
    assert.match(text, /editorial/i)
    assert.match(text, /current prices on supplier sites/)
  }
})

test('catalog repairs preserve every unrelated field and all URL/image/identity bytes', () => {
  const baselineText = execFileSync('git', ['show', '3d4af2c:src/data/destinationGuides.ts'], { cwd: root, encoding: 'utf8' })
  const baseline = records(baselineText)
  const allowed = new Set(['maldives', 'tokyo', 'amalfi-coast', 'kyoto', 'singapore', 'lisbon', 'mexico-city', 'marrakech', 'helsinki', 'cape-town', 'seville'])
  assert.equal(guides.length, baseline.length)
  let restored = catalog
  for (let i = 0; i < baseline.length; i++) {
    const before = baseline[i], after = guides[i]
    const permittedFields = allowed.has(before.id) ? ['excerpt'] : []
    if (before.id === 'marrakech') permittedFields.push('subtitle')
    const copy = { ...after }
    for (const field of permittedFields) {
      copy[field] = before[field]
      if (before[field] !== after[field]) {
        // Restore the exact source literal, retaining its original quote style.
        // Seville uses double quotes around text containing apostrophes; always
        // escaping as a single-quoted literal would fail to restore those bytes.
        const fieldLiteral = (text, id, key) => {
          const ast = ts.createSourceFile('data.ts', text, ts.ScriptTarget.Latest, true)
          const declaration = ast.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.text === 'DESTINATION_GUIDES')
          const record = declaration.initializer.elements.find(node => node.properties.some(p => p.name.text === 'id' && p.initializer.text === id))
          const value = record.properties.find(p => p.name.text === key).initializer
          return { start: value.getStart(ast), end: value.getEnd(), text: value.getText(ast) }
        }
        const afterLiteral = fieldLiteral(restored, after.id, field)
        restored = restored.slice(0, afterLiteral.start) + fieldLiteral(baselineText, before.id, field).text + restored.slice(afterLiteral.end)
      }
    }
    assert.deepEqual(copy, before, before.id)
  }
  assert.equal(restored, baselineText, 'no unrelated catalog bytes may change')
})
