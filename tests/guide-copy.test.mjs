import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

async function parseSource(path, kind = ts.ScriptKind.TS) {
  const source = ts.createSourceFile(path, await readFile(new URL(path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, kind)
  assert.equal(source.parseDiagnostics.length, 0, `${path} must parse without errors`)
  return source
}

// Read the source inventory, not a duplicated fixture or a Next/affiliate import.
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    assert.ok(ts.isPropertyAssignment(property), 'guide inventory must contain literal properties')
    return [property.name.text, literal(property.initializer)]
  }))
  throw new Error(`Nonliteral guide inventory: ${node.getText()}`)
}

const dataSource = await parseSource('../src/data/destinationGuides.ts')
const declarations = dataSource.statements.filter(ts.isVariableStatement)
  .flatMap(statement => [...statement.declarationList.declarations])
  .filter(declaration => declaration.name.text === 'DESTINATION_GUIDES')
assert.equal(declarations.length, 1)
assert.ok(declarations[0].initializer)
const guides = literal(declarations[0].initializer)
assert.ok(guides.length > 0, 'the source guide inventory must not be empty')

// Transpile only the actual content function: no Next, JSX runtime or CSS imports.
const pageSource = await parseSource('../src/app/guides/[slug]/page.tsx', ts.ScriptKind.TSX)
const functions = pageSource.statements.filter(statement => ts.isFunctionDeclaration(statement) && statement.name?.text === 'getArticleContent')
assert.equal(functions.length, 1)
const compiled = ts.transpileModule(`${functions[0].getText(pageSource)}\nexport { getArticleContent }`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
})
assert.equal(compiled.diagnostics?.length ?? 0, 0, 'article content must transpile without errors')
const { getArticleContent } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`)
const articles = guides.map(guide => ({ guide, article: getArticleContent(guide) }))
const generic = articles.filter(({ guide, article }) => article.sections[0]?.title === `Planning Your ${guide.title} Trip`)

function passages(article) {
  return article.sections.flatMap(section => [section.title, section.content, ...(section.items ?? [])])
}

// Keep geographic prose such as a terrace "above" or a food hall "at the top" valid.
const staleDirection = /\b(?:search(?:es)?|tools?|booking links|comparison)\b[^.!?\n]*\b(?:above|at\s+the\s+top)\b|\b(?:above|at\s+the\s+top)\b[^.!?\n]*\b(?:search(?:es)?|tools?|booking links|comparison)\b/i
const onPageQuoteClaim = /\b(?:live|real(?:[- ]time)?)\s+(?:flight\s+)?(?:fares?|prices?|quotes?)\b/i
const belowSupplierInstruction = /\bflight-time tools and booking links below\b[^.!?]*\bexplore departure options\b[^.!?]*\bcurrent prices on supplier sites\b/i

function assertNoViolations(violations, message) {
  assert.equal(violations.length, 0, `${message}: ${violations.length} violation(s)${violations.length ? `; first: ${violations[0]}` : ''}`)
}

test('every source guide produces nonempty article sections and valid prose/items', t => {
  for (const { guide, article } of articles) {
    assert.ok(article.sections.length > 0, guide.slug)
    for (const section of article.sections) {
      assert.ok(typeof section.title === 'string' && section.title.trim(), `${guide.slug}: section title`)
      assert.ok(typeof section.content === 'string' && section.content.trim(), `${guide.slug}: section content`)
      if (section.items !== undefined) assert.ok(Array.isArray(section.items), `${guide.slug}: items`)
      for (const item of section.items ?? []) assert.ok(typeof item === 'string' && item.trim(), `${guide.slug}: item`)
    }
  }
  t.diagnostic(`Exercised ${articles.length} source guides, ${articles.reduce((sum, { article }) => sum + article.sections.length, 0)} sections, and ${articles.reduce((sum, { article }) => sum + article.sections.reduce((count, section) => count + (section.items?.length ?? 0), 0), 0)} items`)
})

test('all article titles, content and items reject search/tool directions above or at the top', () => {
  const violations = articles.flatMap(({ guide, article }) => passages(article)
    .filter(text => staleDirection.test(text)).map(text => `${guide.slug}: ${text}`))
  assertNoViolations(violations, 'Stale on-page direction')
})

test('generic articles direct readers below and put current-price checks on supplier sites', t => {
  assert.ok(generic.length > 0, 'identify a nonempty generic set by its generated first title')
  const violations = generic.flatMap(({ guide, article }) => [article.sections[0], article.sections.at(-1)]
    .filter(section => !belowSupplierInstruction.test(section.content)).map(section => `${guide.slug}: ${section.title}`))
  assertNoViolations(violations, 'Missing below/supplier-site instruction')
  t.diagnostic(`Checked ${generic.length} generic guides without a fixed generic-guide count`)
})

test('generic articles do not promise live or real on-page fare quotes', () => {
  assert.ok(generic.length > 0)
  const violations = generic.flatMap(({ guide, article }) => passages(article)
    .filter(text => onPageQuoteClaim.test(text)).map(text => `${guide.slug}: ${text}`))
  assertNoViolations(violations, 'Unsupported live/real-price claim')
})

test('generic no-flight-time fallback points to departure tools below, not live prices above', () => {
  assert.ok(generic.length > 0)
  for (const { guide } of generic) {
    const withoutFlightTime = { ...guide, stats: guide.stats.filter(stat => !/flight/i.test(stat.label)) }
    const article = getArticleContent(withoutFlightTime)
    assert.equal(article.sections[0].items[1], 'Explore departure options using the flight tools below', guide.slug)
    for (const text of passages(article)) {
      assert.doesNotMatch(text, staleDirection, guide.slug)
      assert.doesNotMatch(text, onPageQuoteClaim, guide.slug)
    }
  }
})
