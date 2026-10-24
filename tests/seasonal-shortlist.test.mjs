import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const BASELINE_COMMIT = '289fed62aff6a5b3d503f2c5d630dcd34b0c1f7b'
// Copied from the independently captured baseline-inventory.json, NOT from the
// selector or review manifest. All 72 original slots must receive a decision.
const ORIGINAL_SLOTS = [
  ['maldives', 'cape-town', 'mexico-city', 'sydney', 'bangkok', 'buenos-aires'],
  ['cape-town', 'maldives', 'mexico-city', 'sydney', 'bangkok', 'buenos-aires'],
  ['kyoto', 'marrakech', 'tokyo', 'maldives', 'cape-town', 'mexico-city'],
  ['marrakech', 'kyoto', 'tokyo', 'maldives', 'bali', 'mexico-city'],
  ['amalfi-coast', 'lisbon', 'kyoto', 'marrakech', 'santorini', 'tokyo'],
  ['santorini', 'lisbon', 'amalfi-coast', 'bali', 'iceland', 'amsterdam'],
  ['bali', 'iceland', 'amsterdam', 'athens', 'berlin', 'bordeaux'],
  ['maasai-mara', 'bali', 'iceland', 'amsterdam', 'athens', 'berlin'],
  ['iceland', 'lisbon', 'santorini', 'amalfi-coast', 'bali', 'amsterdam'],
  ['lisbon', 'kyoto', 'marrakech', 'santorini', 'tokyo', 'amalfi-coast'],
  ['mexico-city', 'kyoto', 'marrakech', 'tokyo', 'maldives', 'cape-town'],
  ['sydney', 'maldives', 'cape-town', 'mexico-city', 'bangkok', 'buenos-aires'],
]
const LEADS = ORIGINAL_SLOTS.map(ids => ids[0])
const pair = (month, id) => `${month}:${id}`
const sorted = values => [...values].sort()
const read = path => readFile(new URL(path, import.meta.url), 'utf8')
const readReview = async () => JSON.parse(await read('../src/data/seasonalShortlistReview.json'))
const catalog = JSON.parse(await read('../src/data/seasonalReasons.json'))

function literal(node) {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return literal(node.expression)
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    assert.ok(ts.isPropertyAssignment(property), 'inventory must remain literal')
    return [property.name.text, literal(property.initializer)]
  }))
  throw new Error(`Nonliteral inventory value: ${node.getText()}`)
}
async function sourceValue(path, name) {
  const source = ts.createSourceFile(path, await read(path), ts.ScriptTarget.Latest, true)
  const declaration = source.statements.filter(ts.isVariableStatement)
    .flatMap(statement => [...statement.declarationList.declarations]).find(item => item.name.text === name)
  assert.ok(declaration?.initializer, `Missing source inventory ${name}`)
  return literal(declaration.initializer)
}
const inventory = await sourceValue('../src/data/destinationGuides.ts', 'DESTINATION_GUIDES')
const windows = await sourceValue('../src/lib/seasonalHelpers.ts', 'BEST_MONTHS')
const guides = inventory.map(guide => ({ ...guide, image: guide.heroImage, months: windows[guide.id] ?? [] }))
const source = await read('../src/lib/goldilocksDiscovery.ts')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
const discovery = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

function calendarDate(value, label) {
  assert.equal(typeof value, 'string', label)
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/, label)
  const date = new Date(`${value}T00:00:00Z`)
  assert.ok(Number.isFinite(date.getTime()), `${label}: invalid calendar date`)
  assert.equal(date.toISOString().slice(0, 10), value, `${label}: impossible calendar date`)
}
function meaningful(value, label, minLength = 25) {
  assert.equal(typeof value, 'string', label)
  assert.equal(value, value.trim(), `${label}: no padding`)
  assert.ok(value.length >= minLength, `${label}: explain the decision, not a label`)
  assert.ok(value.split(/\s+/).length >= 5, `${label}: must be meaningful prose`)
  assert.doesNotMatch(value, /\b(?:TODO|TBD|placeholder|lorem ipsum|replace me|insert here)\b/i, label)
}
function sourceUrl(value) {
  const url = new URL(value)
  assert.equal(url.protocol, 'https:', value)
  assert.equal(url.username, '', value)
  assert.equal(url.password, '', value)
  assert.doesNotMatch(url.hostname, /(?:^|\.)(?:example\.(?:com|org|net|test)|localhost|invalid)$/, value)
  for (const key of url.searchParams.keys()) {
    assert.doesNotMatch(key, /^(?:utm_.*|fbclid|gclid|msclkid|mc_cid|mc_eid|affiliate|aff_id|clickid)$/i, value)
  }
}
function validateReview(review, evidence = catalog) {
  assert.equal(review.schemaVersion, 1)
  assert.equal(review.baselineCommit, BASELINE_COMMIT)
  calendarDate(review.checkedAt, 'review.checkedAt')
  assert.ok(Array.isArray(review.records))
  assert.equal(review.records.length, 72, 'review every original slot exactly once')
  const expectedSlots = ORIGINAL_SLOTS.flatMap((ids, index) => ids.map(id => pair(index + 1, id)))
  const actualSlots = review.records.map(record => pair(record.month, record.originalDestinationId))
  assert.equal(new Set(actualSlots).size, 72, 'duplicate original slot')
  assert.deepEqual(sorted(actualSlots), sorted(expectedSlots), 'frozen original-slot coverage')
  const sources = new Map(evidence.sources.map(item => [item.id, item]))
  assert.equal(sources.size, evidence.sources.length, 'duplicate source ID')
  const notes = new Map(evidence.notes.map(note => [pair(note.month, note.destinationId), note]))
  assert.equal(notes.size, evidence.notes.length, 'duplicate destination/month note')
  const knownIds = new Set(inventory.map(guide => guide.id))
  const finalPairs = []
  for (const record of review.records) {
    const label = pair(record.month, record.originalDestinationId)
    assert.ok(Number.isInteger(record.month) && record.month >= 1 && record.month <= 12, label)
    assert.ok(['retain', 'revise', 'replace'].includes(record.decision), label)
    assert.ok(['high', 'medium'].includes(record.confidence), label)
    assert.ok(knownIds.has(record.finalDestinationId), `${label}: unknown final guide`)
    if (record.decision === 'replace') assert.notEqual(record.finalDestinationId, record.originalDestinationId, label)
    else assert.equal(record.finalDestinationId, record.originalDestinationId, label)
    meaningful(record.rationale, `${label} rationale`, 40)
    meaningful(record.why, `${label} why`)
    meaningful(record.tradeoff, `${label} tradeoff`)
    assert.ok(windows[record.finalDestinationId]?.includes(record.month), `${label}: final guide is ineligible`)
    assert.ok(Array.isArray(record.sourceIds) && record.sourceIds.length > 0, `${label}: citations required`)
    assert.equal(new Set(record.sourceIds).size, record.sourceIds.length, `${label}: duplicate citation`)
    const key = pair(record.month, record.finalDestinationId)
    finalPairs.push(key)
    const note = notes.get(key)
    assert.ok(note, `${label}: missing exact final destination/month note`)
    assert.equal(record.why, note.why, `${label}: approved reason differs from published note`)
    assert.equal(record.tradeoff, note.tradeoff, `${label}: approved caveat differs from published note`)
    assert.deepEqual(record.sourceIds, note.sourceIds, `${label}: approved citations differ from published note`)
    for (const id of record.sourceIds) {
      const item = sources.get(id)
      assert.ok(item, `${label}: unresolved source ${id}`)
      sourceUrl(item.url)
      calendarDate(item.checkedAt, `${id}.checkedAt`)
      assert.ok(item.checkedAt <= review.checkedAt, `${id}: source check is later than review`)
      assert.ok(typeof item.title === 'string' && item.title.trim().length > 0, `${id}: source title required`)
      assert.ok(typeof item.publisher === 'string' && item.publisher.trim().length > 0, `${id}: publisher required`)
      meaningful(item.evidence, `${id} evidence`)
    }
  }
  assert.equal(new Set(finalPairs).size, 72, 'duplicate final destination/month')
  assert.deepEqual(sorted(notes.keys()), sorted(finalPairs), 'published notes must cover the approved final pairs exactly')
  for (let month = 1; month <= 12; month++) {
    const records = review.records.filter(record => record.month === month)
    assert.equal(records.length, 6)
    assert.equal(new Set(records.map(record => record.finalDestinationId)).size, 6)
    assert.ok(records.some(record => record.finalDestinationId === LEADS[month - 1]), `month ${month}: preserve approved feature`)
  }
}

// These are hashes of actual git-show bytes at BASELINE_COMMIT, recorded before
// implementation. Neither the current selector nor manifest supplies this oracle.
test('all 100 guides and eligibility-window bytes stay frozen to the audited baseline', async () => {
  assert.equal(inventory.length, 100)
  assert.equal(new Set(inventory.map(guide => guide.id)).size, 100)
  for (const [path, hash] of [
    ['../src/data/destinationGuides.ts', 'be97c31c88f6809cb94aad175089c0c40fef85ba0d7de1baeeafa0d605f1e471'],
    ['../src/lib/seasonalHelpers.ts', '9bc4bfef4e82adc4036b5079365b2033a6a7c32b7f4786e3e2da5407ac79be90'],
  ]) assert.equal(createHash('sha256').update(await read(path)).digest('hex'), hash, path)
  assert.deepEqual([...discovery.MONTHLY_LEADS], LEADS)
})

test('review manifest accounts independently for all frozen 72 slots and exact published evidence', async () => {
  validateReview(await readReview())
})

for (let month = 1; month <= 12; month++) {
  test(`month ${month}: actual selection equals the approved final set, with six eligible picks and lead first`, async () => {
    const review = await readReview()
    validateReview(review)
    const expected = review.records.filter(record => record.month === month).map(record => record.finalDestinationId)
    const actual = discovery.getMonthSelection(guides, month)
    assert.equal(actual.shortlist.length, 6)
    assert.equal(new Set(actual.shortlist.map(guide => guide.id)).size, 6)
    assert.deepEqual(sorted(actual.shortlist.map(guide => guide.id)), sorted(expected))
    assert.equal(actual.featured.id, LEADS[month - 1])
    assert.equal(actual.shortlist[0].id, actual.featured.id)
    assert.equal(actual.total, guides.filter(guide => guide.months.includes(month)).length)
    for (const guide of actual.shortlist) assert.ok(windows[guide.id].includes(month))
  })

  test(`month ${month}: missing any selected guide fails closed instead of backfilling`, () => {
    const selected = discovery.getMonthSelection(guides, month).shortlist
    for (const guide of selected) {
      const missing = guides.filter(candidate => candidate.id !== guide.id)
      assert.throws(() => discovery.getMonthSelection(missing, month), `missing ${guide.id}/${month} must not silently choose another guide`)
    }
  })

  test(`month ${month}: duplicate guide identities fail closed, even outside the shortlist`, () => {
    const selectedIds = new Set(discovery.getMonthSelection(guides, month).shortlist.map(guide => guide.id))
    const selected = guides.find(guide => selectedIds.has(guide.id))
    const other = guides.find(guide => !selectedIds.has(guide.id))
    for (const guide of [selected, other]) {
      assert.throws(() => discovery.getMonthSelection([...guides, structuredClone(guide)], month), `duplicate ${guide.id} must not corrupt identity/counts`)
    }
  })

  test(`month ${month}: selection does not mutate input or depend on alphabetical fallback`, () => {
    const input = structuredClone(guides)
    for (const guide of input) { Object.freeze(guide.months); Object.freeze(guide) }
    Object.freeze(input)
    const before = JSON.stringify(input)
    const expected = discovery.getMonthSelection(input, month).shortlist.map(guide => guide.id)
    assert.equal(JSON.stringify(input), before)
    const reordered = structuredClone(guides).reverse().map(guide => ({ ...guide, title: `reordered ${guide.id}` }))
    const unselected = reordered.find(guide => guide.months.includes(month) && !expected.includes(guide.id))
    assert.ok(unselected, 'baseline has eligible non-shortlisted guides for this perturbation')
    unselected.title = '000000 forced alphabetical first'
    assert.deepEqual(discovery.getMonthSelection(reordered, month).shortlist.map(guide => guide.id), expected,
      'curated order must be explicit and independent of titles or caller ordering')
  })
}

test('the independent manifest oracle rejects structural and evidence mutations', async () => {
  const valid = await readReview()
  validateReview(valid)
  const mutations = [
    review => { review.records.pop() },
    review => { review.records[1] = structuredClone(review.records[0]) },
    review => { review.records[0].originalDestinationId = 'invented-original-slot' },
    review => { review.records[0].decision = 'unchecked' },
    review => { review.records[0].confidence = 'low' },
    review => { review.records[0].decision = 'replace'; review.records[0].finalDestinationId = review.records[0].originalDestinationId },
    review => { review.records[0].why += ' unapproved change' },
    review => { review.records[0].tradeoff += ' unapproved change' },
    review => { review.records[0].rationale = 'TODO' },
    review => { review.records[0].sourceIds = [] },
    review => { review.records[0].sourceIds = ['missing-source'] },
    review => { review.checkedAt = '2026-02-30' },
  ]
  for (const mutate of mutations) {
    const broken = structuredClone(valid)
    mutate(broken)
    assert.throws(() => validateReview(broken), mutate.toString())
  }
  for (const mutate of [
    item => { item.checkedAt = '2026-02-30' },
    item => { item.url = 'http://example.org/climate' },
    item => { item.url = 'https://user:secret@weather.test/climate' },
    item => { item.url = 'https://weather.test/climate?utm_source=tracking' },
    item => { item.evidence = 'TBD' },
  ]) {
    const broken = structuredClone(catalog)
    mutate(broken.sources.find(item => item.id === valid.records[0].sourceIds[0]))
    assert.throws(() => validateReview(valid, broken), mutate.toString())
  }
})
