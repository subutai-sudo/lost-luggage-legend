import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

// Frozen from 98b23f16c57c91d3b049a888d213828262354463 before the
// performance implementation. No runtime git/external-audit dependency.
const FROZEN = {
  '../src/data/seasonalReasons.json': '63a037b2908e282e9bd7da9f242686fc1d19848e972b77306f9dd6749aedb1e0',
  '../src/data/destinationGuides.ts': 'be97c31c88f6809cb94aad175089c0c40fef85ba0d7de1baeeafa0d605f1e471',
  '../src/data/destinationPhotoEvidence.json': '29f345c2b007768c51cb3ca7bc838fe6ea5ca4c77ddb45784f74e9f6140511c6',
  '../src/data/seasonalShortlistReview.json': '0842145532fe754729bf68434e55f3d2f44491f1ca21482650490975b761ad3e',
  '../src/lib/seasonalHelpers.ts': '9bc4bfef4e82adc4036b5079365b2033a6a7c32b7f4786e3e2da5407ac79be90',
  '../next.config.js': '77ccf261fbe99e1fdba503cb8566b5cb0ba8f2cb364c6b7751af70448852ce26',
}
const read = path => readFile(new URL(path, import.meta.url), 'utf8')
const raw = JSON.parse(await read('../src/data/seasonalReasons.json'))
const js = ts.transpileModule(await read('../src/lib/seasonalReasons.ts'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText
const core = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)

function project(catalog) {
  assert.equal(typeof core.getSeasonalDisplayCatalog, 'function', 'export the pure server-side display projection')
  return core.getSeasonalDisplayCatalog(catalog)
}
const sourceKeys = ['checkedAt', 'id', 'publisher', 'title', 'url']
const expectedSource = ({ id, url, title, publisher, checkedAt }) => ({ id, url, title, publisher, checkedAt })
function freezeDeep(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freezeDeep); Object.freeze(value) }
  return value
}

// These hashes intentionally protect copy, eligibility, all 100 photos, provenance
// and optimizer policy; this change is not permission to rewrite approved content.
test('performance work preserves frozen editorial data, photos, windows and image config', async () => {
  for (const [path, hash] of Object.entries(FROZEN)) {
    assert.equal(createHash('sha256').update(await read(path)).digest('hex'), hash, path)
  }
  assert.equal(raw.notes.length, 72)
  assert.equal(raw.sources.length, 91)
})

test('display projection preserves all 72 notes and exact referenced source metadata only', () => {
  const referenced = new Set(raw.notes.flatMap(note => note.sourceIds))
  assert.equal(referenced.size, 85, 'baseline includes six audit-only sources')
  const display = project(freezeDeep(structuredClone(raw)))
  assert.deepEqual(Object.keys(display).sort(), ['notes', 'sources'])
  assert.deepEqual(display.notes, raw.notes, 'all reason/trade-off text, pair ordering and sourceIds stay exact')
  assert.equal(display.sources.length, referenced.size, 'only sources the notes cite may ship')
  const byId = new Map(raw.sources.map(source => [source.id, source]))
  for (const source of display.sources) {
    assert.deepEqual(source, expectedSource(byId.get(source.id)), `${source.id}: exact catalog metadata, nothing else`)
    assert.ok(Object.keys(source).sort().join() === sourceKeys.join(), `${source.id}: no raw evidence or other audit fields`)
  }
  assert.deepEqual([...display.sources.map(source => source.id)].sort(), [...referenced].sort(), 'no unused, dropped or invented source IDs')
  assert.ok(!JSON.stringify(display).includes('"evidence"'))
})

test('display projection makes defensive copies without mutating full audit input', () => {
  const input = structuredClone(raw)
  const before = structuredClone(input)
  const display = project(input)
  assert.notStrictEqual(display, input)
  assert.notStrictEqual(display.notes, input.notes)
  assert.notStrictEqual(display.sources, input.sources)
  for (const [index, note] of display.notes.entries()) {
    assert.notStrictEqual(note, input.notes[index])
    assert.notStrictEqual(note.sourceIds, input.notes[index].sourceIds)
  }
  for (const source of display.sources) assert.notStrictEqual(source, input.sources.find(item => item.id === source.id))
  display.notes[0].sourceIds.push('display-only-change')
  display.notes[0].why = 'display-only-change'
  display.sources[0].title = 'display-only-change'
  assert.deepEqual(input, before)
})

test('display projection drops unused sources and raw audit fields, not merely evidence', () => {
  // Explicit synthetic contract; these are not retrieved sources or product data.
  const source = { id: 'fixture-source', url: 'https://example.test/source', title: 'Fixture', publisher: 'Fixture', checkedAt: '2026-10-22', evidence: 'Synthetic evidence', auditBlob: 'must-not-ship' }
  const input = { sources: [source, { ...source, id: 'unused-source' }], notes: [{ destinationId: 'fixture-city', month: 1, why: 'Synthetic reason', tradeoff: 'Synthetic caveat', sourceIds: ['fixture-source'] }], auditBlob: 'must-not-ship' }
  const display = project(freezeDeep(input))
  assert.deepEqual(display.sources, [expectedSource(source)], 'ship the five display fields only')
  assert.equal(display.sources.length, 1, 'an uncited source is dropped')
  assert.equal(display.notes.length, 1)
  const note = display.notes[0]
  assert.deepEqual({
    destinationId: note.destinationId, month: note.month, why: note.why, tradeoff: note.tradeoff, sourceIds: note.sourceIds,
  }, { destinationId: 'fixture-city', month: 1, why: 'Synthetic reason', tradeoff: 'Synthetic caveat', sourceIds: ['fixture-source'] })
  assert.ok(!JSON.stringify(display).includes('evidence') && !JSON.stringify(display).includes('auditBlob'), 'raw audit payload must not ship')
  assert.ok(!('auditBlob' in display), 'catalog-level audit fields are dropped')
})

test('display catalog resolves every original note with identical citations and dates', () => {
  const display = project(raw)
  for (const note of raw.notes) {
    const full = core.getSeasonalReason(raw, note.destinationId, note.month)
    const result = core.getSeasonalReason(display, note.destinationId, note.month)
    assert.deepEqual(result, { ...note, sources: full.sources.map(expectedSource) })
  }
  assert.equal(core.getSeasonalReason(display, 'not-a-destination', 1), null)
  for (const month of [0, 13, 1.5, NaN, '1']) assert.throws(() => core.getSeasonalReason(display, 'lisbon', month), RangeError)
})

test('full audit validation still requires evidence on every source', () => {
  assert.doesNotThrow(() => core.validateSeasonalCatalog(raw))
  for (const index of raw.sources.keys()) {
    const broken = structuredClone(raw)
    delete broken.sources[index].evidence
    assert.throws(() => core.validateSeasonalCatalog(broken), /evidence/i, raw.sources[index].id)
  }
})

function parse(text, name) { return ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) }
function collect(root, predicate) {
  const found = []
  function visit(node) { if (predicate(node)) found.push(node); ts.forEachChild(node, visit) }
  visit(root)
  return found
}
function attr(element, name) { return element.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.text === name) }
/** Read a JSX attribute written as a string literal, a template literal or an expression wrapping one. */
function attrText(element, name) {
  const attribute = attr(element, name)
  if (!attribute || !attribute.initializer) return undefined
  const initializer = ts.isJsxExpression(attribute.initializer) ? attribute.initializer.expression : attribute.initializer
  if (!initializer) return undefined
  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) return initializer.text
  return initializer.getText()
}
function tag(node) { return ts.isJsxElement(node) ? node.openingElement : node }
function tagName(node) { const name = tag(node).tagName; return ts.isIdentifier(name) ? name.text : name.getText() }
function jsx(root, name) { return collect(root, n => (ts.isJsxSelfClosingElement(n) || ts.isJsxElement(n)) && tagName(n) === name) }
const importsOf = source => source.statements.filter(ts.isImportDeclaration).map(node => node.moduleSpecifier.text)

test('full seasonal JSON enters through the server projection, never a client runtime import', async () => {
  const server = parse(await read('../src/app/page.tsx'), 'page.tsx')
  const home = parse(await read('../src/components/GoldilocksHome.tsx'), 'GoldilocksHome.tsx')
  const reason = parse(await read('../src/components/SeasonalReason.tsx'), 'SeasonalReason.tsx')
  assert.equal(home.statements[0].expression?.text, 'use client')
  for (const client of [home, reason]) assert.ok(!importsOf(client).some(path => path.endsWith('/seasonalReasons.json')), 'client must not import the full audit JSON')
  assert.ok(importsOf(server).some(path => path.endsWith('/seasonalReasons.json')), 'full JSON remains a server-side input')
  assert.ok(collect(server, n => ts.isCallExpression(n) && n.expression.getText(server) === 'getSeasonalDisplayCatalog').length > 0, 'server invokes the display projection')
  const renderedHome = jsx(server, 'GoldilocksHome')
  assert.equal(renderedHome.length, 1)
  assert.ok(attr(tag(renderedHome[0]), 'seasonalCatalog'), 'server supplies the projected seasonalCatalog prop')
  const homeProps = collect(home, node => ts.isParameter(node) && ts.isObjectBindingPattern(node.name))
    .flatMap(node => [...node.name.elements].map(element => (element.propertyName ?? element.name).text))
  assert.ok(homeProps.includes('seasonalCatalog'), 'the client component takes the projected catalog, not the raw JSON')
  const renderedReason = jsx(home, 'SeasonalReason')
  assert.equal(renderedReason.length, 1)
  const passed = attr(tag(renderedReason[0]), 'catalog') ?? attr(tag(renderedReason[0]), 'seasonalCatalog')
  assert.ok(passed, 'SeasonalReason must receive the projected display catalog')
  const passedValue = passed.initializer?.expression?.getText(home)
  assert.notEqual(passedValue, 'seasonalReasons', 'cards must not receive the raw audit JSON')
  assert.ok(homeProps.includes(passedValue), `cards receive a value the client already holds, not a raw import (got ${passedValue})`)
})

test('month thumbnails opt into native lazy loading while the cinematic hero stays high-priority/eager', async () => {
  const home = parse(await read('../src/components/GoldilocksHome.tsx'), 'GoldilocksHome.tsx')
  const button = jsx(home, 'button').find(node => attr(tag(node), 'data-month'))
  assert.ok(button, 'find the actual month-map button')
  const images = jsx(button, 'Image')
  assert.equal(images.length, 1)
  assert.equal(attrText(tag(images[0]), 'loading'), 'lazy', 'month preview declares native lazy loading')
  const hero = jsx(home, 'Image').find(node => attr(tag(node), 'data-hero-image'))
  assert.ok(hero)
  assert.equal(attrText(tag(hero), 'loading'), 'eager', 'the cinematic hero still loads eagerly')
  assert.equal(attrText(tag(hero), 'fetchPriority'), 'high', 'the cinematic hero keeps high fetch priority')
})
