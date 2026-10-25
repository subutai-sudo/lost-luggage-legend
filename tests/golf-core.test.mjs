import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

// Golf discovery mirrors the seasonal-shortlist pattern: one course-id list per
// month, a fail-closed selector, and a reviewed note ledger with cited sources.
// Load the compiled pure libs through data: URLs so the suites need no bundler.
const transpile = text => ts.transpileModule(text, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText
const asModule = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`

const discovery = asModule(transpile(await readFile(new URL('../src/lib/goldilocksDiscovery.ts', import.meta.url), 'utf8')))
const golfSource = (await readFile(new URL('../src/lib/golfDiscovery.ts', import.meta.url), 'utf8'))
  .replace("'./goldilocksDiscovery'", `'${discovery}'`)
const golfModule = asModule(transpile(golfSource))
const core = await import(golfModule)

const dataUrl = name => new URL(`../src/data/${name}`, import.meta.url)
async function readJson(name) {
  try {
    return JSON.parse(await readFile(dataUrl(name), 'utf8'))
  } catch {
    return null
  }
}
async function readText(name) {
  try {
    return await readFile(dataUrl(name), 'utf8')
  } catch {
    return null
  }
}

// Source-derived inventory, never evaluated application data.
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    assert.ok(ts.isPropertyAssignment(property), `nonliteral golf inventory: ${property.getText()}`)
    return [property.name.text, literal(property.initializer)]
  }))
  throw new Error(`Nonliteral golf inventory: ${node.getText()}`)
}
async function sourceValue(path, name) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8')
  const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
  const declaration = file.statements.filter(ts.isVariableStatement)
    .flatMap(statement => [...statement.declarationList.declarations])
    .find(item => item.name.text === name)
  assert.ok(declaration?.initializer, `missing ${name} in ${path}`)
  return literal(declaration.initializer)
}

const courseSource = await readText('golfCourses.ts')
const inventoryText = await readText('destinationGuides.ts')
assert.ok(inventoryText, 'destination inventory must exist')
const destinations = await sourceValue('../src/data/destinationGuides.ts', 'DESTINATION_GUIDES')
const destinationIds = new Set(destinations.map(d => d.id))

const sources = await readJson('golfSources.json')
const notes = await readJson('golfCourseNotes.json')

// Parsed only when the data file exists, so the red run reports the real gap.
let courses = null
if (courseSource) {
  const file = ts.createSourceFile('golfCourses.ts', courseSource, ts.ScriptTarget.Latest, true)
  const declaration = file.statements.filter(ts.isVariableStatement)
    .flatMap(statement => [...statement.declarationList.declarations])
    .find(item => item.name.text === 'GOLF_COURSES')
  assert.ok(declaration?.initializer, 'golfCourses.ts must export GOLF_COURSES')
  courses = literal(declaration.initializer)
}

test('curated golf data exists', () => {
  assert.ok(courses, 'src/data/golfCourses.ts must define GOLF_COURSES')
  assert.ok(sources, 'src/data/golfSources.json must exist')
  assert.ok(notes, 'src/data/golfCourseNotes.json must exist')
  assert.ok(Array.isArray(courses) && courses.length >= 12, 'expected a curated course catalog')
  assert.ok(Array.isArray(sources) && sources.length > 0, 'expected cited sources')
  assert.ok(Array.isArray(notes) && notes.length === 72, 'expected exactly 72 month notes')
})

test('every course is real-looking, unique and keyed to an existing destination', () => {
  assert.ok(courses, 'no golf courses yet')
  const ids = new Set()
  for (const course of courses) {
    assert.match(course.id, /^[a-z0-9-]+$/, `bad course id: ${course.id}`)
    assert.ok(!ids.has(course.id), `duplicate course id: ${course.id}`)
    ids.add(course.id)
    for (const field of ['name', 'city', 'country', 'character']) {
      assert.ok(typeof course[field] === 'string' && course[field].trim(), `course ${course.id} missing ${field}`)
    }
    assert.ok(destinationIds.has(course.destinationId), `course ${course.id} maps to unknown destination ${course.destinationId}`)
  }
})

for (let month = 1; month <= 12; month++) {
  test(`month ${month}: six unique existing courses, live lead first, no mutation`, () => {
    const selection = core.getGolfMonthSelection(courses, month)
    assert.equal(selection.shortlist.length, 6)
    assert.equal(new Set(selection.shortlist.map(c => c.id)).size, 6)
    assert.equal(selection.shortlist[0].id, core.MONTHLY_GOLF_LEADS[month - 1])
    assert.equal(selection.featured.id, core.MONTHLY_GOLF_LEADS[month - 1])
    assert.ok(selection.total >= 6)
    const copy = JSON.stringify(courses)
    core.getGolfMonthSelection(courses, month)
    assert.equal(JSON.stringify(courses), copy, 'selection must not mutate source data')
  })
}

test('calendar exposes twelve distinct month previews', () => {
  const previews = core.getGolfMonthPreviews(courses)
  assert.equal(previews.length, 12)
  assert.equal(new Set(previews.map(c => c.id)).size, 12)
})

test('invalid months are rejected, not silently repaired', () => {
  for (const month of [0, 13, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => core.getGolfMonthSelection(courses, month), RangeError)
  }
})

test('URL selection accepts only literal 1-12 and preserves the caller fallback', () => {
  for (let month = 1; month <= 12; month++) assert.equal(core.readGolfMonth(`?month=${month}`, 7), month)
  for (const search of ['', '?month=0', '?month=13', '?month=05', '?month=1.0', '?month=NaN', '?month=June', '?month=%3Cscript%3E']) {
    assert.equal(core.readGolfMonth(search, 7), 7)
  }
})

test('source catalog satisfies the authoring contract and every source is cited', () => {
  assert.ok(sources && notes, 'golf sources or notes missing')
  core.validateGolfCatalog({ sources, notes })
  const cited = new Set(notes.flatMap(note => note.sourceIds))
  for (const source of sources) assert.ok(cited.has(source.id), `uncited source: ${source.id}`)
})

test('every month note set explains exactly its six selected courses with a trade-off', () => {
  assert.ok(courses && notes && sources, 'golf data missing')
  const byId = new Map(courses.map(course => [course.id, course]))
  for (let month = 1; month <= 12; month++) {
    const selected = core.MONTHLY_GOLF_SHORTLISTS[month - 1]
    const monthNotes = notes.filter(note => note.month === month)
    const noted = new Set(monthNotes.map(note => note.courseId))
    assert.equal(monthNotes.length, 6, `${core.MONTH_NAMES[month - 1]} needs exactly six notes`)
    for (const id of selected) {
      assert.ok(byId.has(id), `selected course missing from catalog: ${id}`)
      assert.ok(noted.has(id), `${core.MONTH_NAMES[month - 1]} has no note for ${id}`)
    }
    assert.equal(new Set(monthNotes.map(note => note.courseId)).size, 6)
    for (const note of monthNotes) {
      assert.ok(note.why.trim().length >= 40, `thin reason: ${note.courseId}/${note.month}`)
      assert.ok(note.tradeoff.trim().length >= 20, `thin trade-off: ${note.courseId}/${note.month}`)
      assert.ok(note.sourceIds.length >= 1, `unsourced note: ${note.courseId}/${note.month}`)
    }
  }
})

test('each month draws six distinct courses and the year offers real variety', () => {
  assert.ok(courses, 'no golf courses yet')
  for (let month = 1; month <= 12; month++) {
    assert.equal(new Set(core.MONTHLY_GOLF_SHORTLISTS[month - 1]).size, 6)
  }
  const used = new Set(core.MONTHLY_GOLF_SHORTLISTS.flat())
  assert.ok(used.size >= 18, `expected a varied catalog, saw ${used.size} courses across the year`)
  const characters = new Set(courses.map(course => course.character))
  assert.ok(characters.size >= 3, `expected varied course characters, saw ${[...characters].join(', ')}`)
})

test('no slot quotes a green fee, price or travel time as a promise', () => {
  assert.ok(notes && notes.length, 'golf notes missing')
  const money = /(?:NZ|US|AU|CA)?\$\s?\d|\d[\d,]*\s?(?:dirhams|dollars|euros|pounds|AED|EUR|GBP|USD|NZD)\b|€\s?\d|£\s?\d/i
  const duration = /\b\d+\s?(?:min|minutes|hours|hrs)\b/i
  for (const note of notes) {
    const text = `${note.why} ${note.tradeoff}`
    assert.doesNotMatch(text, money, `${note.courseId}/${note.month} quotes a price`)
    assert.doesNotMatch(text, duration, `${note.courseId}/${note.month} quotes a travel time`)
  }
})

test('no two slots share the same reason or trade-off, and none is a stub', () => {
  assert.ok(notes && notes.length, 'golf notes missing')
  const reasons = new Map(), tradeoffs = new Map()
  for (const note of notes) {
    const key = `${note.courseId}/${note.month}`
    assert.ok(!reasons.has(note.why), `duplicate reason copy: ${key} and ${reasons.get(note.why)}`)
    assert.ok(!tradeoffs.has(note.tradeoff), `duplicate trade-off copy: ${key} and ${tradeoffs.get(note.tradeoff)}`)
    reasons.set(note.why, key); tradeoffs.set(note.tradeoff, key)
    // A generic sentence that could describe any course or month is not a reason.
    assert.doesNotMatch(note.why, /^(?:a )?(?:great|good|lovely|beautiful) (?:course|destination)\b/i, `${key} is generic`)
    assert.doesNotMatch(note.why, /\b(?:whether|as a|in terms of)\b.*\b(?:depends|varies)\b/i, `${key} hedges instead of stating a reason`)
  }
})

test('rejected climate slots cannot return in notes or shortlists', () => {
  for (const [month, rejected, replacement] of [
    [7, 'millbrook-resort', 'portmarnock-golf-club'],
    [9, 'emirates-golf-club-majlis-course', 'real-club-de-golf-el-prat'],
  ]) {
    assert.ok(!core.MONTHLY_GOLF_SHORTLISTS[month - 1].includes(rejected))
    assert.ok(!notes.some(note => note.month === month && note.courseId === rejected))
    assert.ok(core.MONTHLY_GOLF_SHORTLISTS[month - 1].includes(replacement))
    const note = notes.find(note => note.month === month && note.courseId === replacement)
    assert.ok(note)
    assert.match(note.why, month === 7 ? /July.*(?:warmest|daylight)/ : /September.*(?:eases|heat)/)
  }
})

test('course identities are unique and Royal Marrakech is one evidenced Old layout', () => {
  const identities = courses.map(course => `${course.name.normalize('NFKC').toLowerCase()}|${course.city.normalize('NFKC').toLowerCase()}`)
  assert.equal(new Set(identities).size, courses.length, 'duplicate name/location identity')
  const royal = courses.filter(course => /^royal-golf-marrakech(?:-|$)/.test(course.id))
  assert.equal(royal.length, 1, 'do not duplicate the club under generic and Old-course IDs')
  assert.equal(royal[0].id, 'royal-golf-marrakech-old-course')
  assert.equal(royal[0].name, 'Royal Golf Marrakech (Old Course)')
  for (const month of [2, 10]) {
    assert.ok(core.MONTHLY_GOLF_SHORTLISTS[month - 1].includes(royal[0].id))
    assert.ok(notes.some(note => note.courseId === royal[0].id && note.month === month))
  }
  assert.ok(!notes.some(note => note.courseId === 'royal-golf-marrakech'))
  const oldSource = sources.find(source => source.url === 'https://frmg.ma/en/royal-golf-marrakech-2/')
  assert.match(oldSource.evidence, /Old course.*Gustave Golias.*Arnaud Massy/)
})

test('review ledger matches all 72 ordered selections and records explicit decisions', async () => {
  const review = await readJson('golfCourseReview.json')
  assert.equal(review.months.length, 12)
  let count = 0
  for (const month of review.months) {
    assert.equal(month.lead, core.MONTHLY_GOLF_LEADS[month.month - 1])
    assert.deepEqual(month.slots.map(slot => slot.courseId), [...core.MONTHLY_GOLF_SHORTLISTS[month.month - 1]])
    for (const [index, slot] of month.slots.entries()) {
      assert.equal(slot.month, month.month)
      assert.equal(slot.chosenAsLead, index === 0)
      assert.ok(['retained', 'revised', 'replaced'].includes(slot.decision))
      assert.ok(slot.rationale?.trim())
      count++
    }
  }
  assert.equal(count, 72)
  assert.equal(review.months[6].slots[3].replacedCourseId, 'millbrook-resort')
  assert.equal(review.months[8].slots[3].replacedCourseId, 'emirates-golf-club-majlis-course')
})

test('Keilir keeps native names without the uncited added temperature', () => {
  const note = notes.find(note => note.courseId === 'keilir-golf-club' && note.month === 7)
  assert.match(note.why, /Reykjavík/)
  assert.match(note.why, /Snæfellsjökull/)
  assert.doesNotMatch(note.why, /\d+\s*°?C\b/)
})

test('winter and transition notes avoid false climate and gateway guarantees', () => {
  for (const note of notes.filter(note => note.courseId === 'kennemer-golf-country-club')) {
    assert.doesNotMatch(note.why, /frost-free|when inland courses freeze/)
  }
  const sentosa = notes.find(note => note.courseId === 'sentosa-golf-club-serapong' && note.month === 10)
  assert.doesNotMatch(sentosa.why, /lull|dry break/)
  assert.match(sentosa.why, /less rainfall.*November.*December/)
  const crans = notes.find(note => note.courseId === 'crans-sur-sierre-golf-club-ballesteros')
  assert.match(crans.tradeoff, /Geneva is a gateway/)
  assert.doesNotMatch(`${crans.why} ${crans.tradeoff}`, /11\s*°?C/)
  assert.ok(!crans.sourceIds.some(id => sources.find(source => source.id === id).url.includes('geneva-weather')))
  const melbourne = notes.find(note => note.courseId === 'the-royal-melbourne-golf-club-west' && note.month === 9)
  assert.doesNotMatch(melbourne.tradeoff, /16 days/)
})

test('private access is useful information, never disguised as open tee-time booking', () => {
  const wentworth = notes.find(note => note.courseId === 'wentworth-club-west')
  assert.match(wentworth.tradeoff, /members and their guests/)
  assert.doesNotMatch(`${wentworth.why} ${wentworth.tradeoff}`, /May BMW PGA/)
  const portmarnock = notes.find(note => note.courseId === 'portmarnock-golf-club' && note.month === 7)
  assert.match(portmarnock.tradeoff, /visitor days|members-only/)
})

test('display projection strips authoring evidence without mutating the input', () => {
  assert.ok(sources && notes, 'golf data missing')
  const catalog = { sources, notes }
  const display = core.getGolfDisplayCatalog(catalog, courses)
  assert.equal(display.notes.length, notes.length)
  assert.ok(!JSON.stringify(display).includes('evidence'))
  assert.equal(sources[0].evidence.length > 0, true, 'authoring evidence should exist before projection')
  assert.equal(core.getGolfReason(display, notes[0].courseId, notes[0].month).sources.length >= 1, true)
  // Missing pairs throw; lookup never substitutes a nearby month.
  const otherMonth = (notes[0].month % 12) + 1
  const otherNote = notes.find(note => note.courseId === notes[0].courseId && note.month === otherMonth)
  if (otherNote) assert.equal(core.getGolfReason(display, notes[0].courseId, otherMonth).why, otherNote.why)
  else assert.throws(() => core.getGolfReason(display, notes[0].courseId, otherMonth), /Missing golf course\/month note/)
})

// Execute the actual server page, replacing only framework/data imports. Its
// golfDiscovery import is the same real transpiled module tested above.
const pageSource = await readFile(new URL('../src/app/golf/page.tsx', import.meta.url), 'utf8')
const reasonSource = await readFile(new URL('../src/components/GolfReason.tsx', import.meta.url), 'utf8')
const jsxModule = asModule('export const jsx = (type, props) => ({type, props}); export const jsxs = jsx;')
async function renderPage(catalog = { sources, notes }, inventory = courses) {
  let code = ts.transpileModule(pageSource, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const imports = {
    'react/jsx-runtime': jsxModule,
    '@/components/GolfZone': asModule('export const GolfZone = "GolfZone";'),
    '@/data/destinationGuides': asModule(`export const DESTINATION_GUIDES = ${JSON.stringify(destinations)};`),
    '@/data/golfCourses': asModule(`export const GOLF_COURSES = ${JSON.stringify(inventory)};`),
    '@/data/golfSources.json': asModule(`export default ${JSON.stringify(catalog.sources)};`),
    '@/data/golfCourseNotes.json': asModule(`export default ${JSON.stringify(catalog.notes)};`),
    '@/lib/golfDiscovery': golfModule,
    '@/lib/site': asModule('export const pageMetadata = x => x;'),
  }
  for (const [name, replacement] of Object.entries(imports)) code = code.replaceAll(`'${name}'`, `'${replacement}'`).replaceAll(`"${name}"`, `"${replacement}"`)
  return (await import(asModule(code))).default()
}

async function renderReason(catalog, courseId, month) {
  let code = ts.transpileModule(reasonSource, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  for (const [name, replacement] of Object.entries({
    'react/jsx-runtime': jsxModule,
    '@/lib/golfDiscovery': golfModule,
    '@/lib/goldilocksDiscovery': discovery,
    './GolfReason.module.css': asModule('export default {};'),
  })) code = code.replaceAll(`'${name}'`, `'${replacement}'`).replaceAll(`"${name}"`, `"${replacement}"`)
  const { GolfReason } = await import(asModule(code))
  return GolfReason({ catalog, courseId, month, courseName: courseId })
}

const freshCatalog = () => structuredClone({ sources, notes })

// These invoke both the exported boundary and the real server page with the
// same in-memory corruptions. Valid-data or source-text checks cannot pass them.
for (const [label, mutate, expected] of [
  ['missing selected note', c => c.notes.shift(), /Missing golf course\/month note/],
  ['duplicate selected note', c => c.notes.push(structuredClone(c.notes[0])), /Duplicate golf course\/month note/],
  ['unexpected extra note', c => c.notes.push({ ...c.notes[0], courseId: 'capilano-golf-and-country-club' }), /Ineligible|Unexpected golf course\/month note/],
  ['dangling source reference', c => c.notes[0].sourceIds.push('missing-source'), /Invalid golf source references/],
  ['duplicate source reference', c => c.notes[0].sourceIds.push(c.notes[0].sourceIds[0]), /Invalid golf source references/],
  ['missing source', c => c.sources.splice(c.sources.findIndex(s => s.id === c.notes[0].sourceIds[0]), 1), /Invalid golf source references/],
  ['duplicate source identity', c => c.sources.push(structuredClone(c.sources[0])), /duplicate golf source ID/],
]) {
  test(`real rendering boundary rejects ${label}`, async () => {
    const catalog = freshCatalog()
    mutate(catalog)
    assert.throws(() => core.getGolfDisplayCatalog(catalog, courses), expected)
    await assert.rejects(() => renderPage(catalog), expected)
  })
}

for (const url of [
  'javascript:alert(1)', 'http://example.org/course', 'https://user:secret@example.org/course',
  'https://example.org/course?utm_source=test', 'https://example.org/course?UTM_MEDIUM=test',
  'https://example.org/course?fbclid=test', 'https://example.org/course?gclid=test', 'not a URL',
]) {
  test(`real rendering boundary rejects unsafe source URL: ${url}`, async () => {
    const catalog = freshCatalog()
    catalog.sources[0].url = url
    assert.throws(() => core.getGolfDisplayCatalog(catalog, courses), /Unsafe or tracked golf source URL|Invalid URL/)
    await assert.rejects(() => renderPage(catalog), /Unsafe or tracked golf source URL|Invalid URL/)
  })
}

for (const checkedAt of ['2026-02-30', '2026-13-01', '2026-2-01', 'not-a-date']) {
  test(`real rendering boundary rejects invalid source check date: ${checkedAt}`, async () => {
    const catalog = freshCatalog()
    catalog.sources[0].checkedAt = checkedAt
    assert.throws(() => core.getGolfDisplayCatalog(catalog, courses), /Invalid golf source check date/)
    await assert.rejects(() => renderPage(catalog), /Invalid golf source check date/)
  })
}

test('authoring validator itself rejects incomplete selected-note coverage', () => {
  const catalog = freshCatalog()
  catalog.notes.shift()
  assert.throws(() => core.validateGolfCatalog(catalog), /Missing golf course\/month note/)
})

test('rendering boundary rejects missing and duplicated course identities', async () => {
  const missing = courses.filter(c => c.id !== core.MONTHLY_GOLF_LEADS[0])
  const duplicate = [...courses, structuredClone(courses[0])]
  for (const [inventory, expected] of [[missing, /Missing golf course selection/], [duplicate, /Duplicate golf course identity/]]) {
    assert.throws(() => core.getGolfDisplayCatalog(freshCatalog(), inventory), expected)
    await assert.rejects(() => renderPage(freshCatalog(), inventory), expected)
  }
})

test('supported eligibility matches independent reviewed ledger, not mutable shortlist tables', async () => {
  const review = await readJson('golfCourseReview.json')
  const reviewedPairs = review.months.flatMap(month => month.slots.map(slot => `${slot.courseId}:${slot.month}`)).sort()
  const supportedPairs = Object.entries(core.SUPPORTED_GOLF_MONTHS).flatMap(([id, months]) => months.map(month => `${id}:${month}`)).sort()
  assert.deepEqual(supportedPairs, reviewedPairs)
  assert.ok(Object.isFrozen(core.SUPPORTED_GOLF_MONTHS))
  for (const months of Object.values(core.SUPPORTED_GOLF_MONTHS)) assert.ok(Object.isFrozen(months))
})

for (const [label, mutate] of [
  ['duplicate selection', ids => { ids[1] = ids[0] }],
  ['missing selection', ids => { ids.pop() }],
  ['wrong lead order', ids => { [ids[0], ids[1]] = [ids[1], ids[0]] }],
]) {
  test(`client and rendering boundary reject ${label}`, async () => {
    const ids = core.MONTHLY_GOLF_SHORTLISTS[0]
    const original = [...ids]
    try {
      mutate(ids)
      assert.throws(() => core.getGolfMonthSelection(courses, 1), /Invalid golf shortlist/)
      assert.throws(() => core.getGolfDisplayCatalog(freshCatalog(), courses), /Invalid golf shortlist/)
      await assert.rejects(() => renderPage(), /Invalid golf shortlist/)
    } finally {
      ids.splice(0, ids.length, ...original)
    }
  })
}

test('client selector and server boundary reject catalog-known but unsupported January Capilano', async () => {
  const ids = core.MONTHLY_GOLF_SHORTLISTS[0]
  const original = ids[1]
  ids[1] = 'capilano-golf-and-country-club'
  try {
    assert.throws(() => core.getGolfMonthSelection(courses, 1), /Ineligible golf course selection/)
    // Even forging a matching note cannot grant eligibility from a shortlist.
    const catalog = freshCatalog()
    catalog.notes.find(n => n.courseId === original && n.month === 1).courseId = ids[1]
    assert.throws(() => core.getGolfDisplayCatalog(catalog, courses), /Ineligible golf course selection|Ineligible golf course\/month note/)
    await assert.rejects(() => renderPage(catalog), /Ineligible golf course selection|Ineligible golf course\/month note/)
  } finally {
    ids[1] = original
  }
})

test('real page projection is allowlisted, nonmutating and contains no authoring evidence', async () => {
  const catalog = freshCatalog()
  catalog.notes[0].privateReview = 'PRIVATE_NOTE_SENTINEL'
  catalog.sources[0].evidence = 'PRIVATE_EVIDENCE_SENTINEL'
  catalog.sources.push({ ...catalog.sources[0], id: 'uncited-source', evidence: 'PRIVATE_UNCITED_SENTINEL' })
  const before = JSON.stringify(catalog)
  const direct = core.getGolfDisplayCatalog(catalog, courses)
  const page = await renderPage(catalog)
  assert.deepEqual(page.props.catalog, direct, 'page must use the same tested validation/projection boundary')
  assert.equal(JSON.stringify(catalog), before)
  assert.equal(direct.notes.length, 72)
  assert.doesNotMatch(JSON.stringify(direct), /PRIVATE_|evidence|privateReview|uncited-source/)
  for (const source of direct.sources) assert.deepEqual(Object.keys(source).sort(), ['checkedAt', 'id', 'publisher', 'title', 'url'])
  for (const note of direct.notes) assert.deepEqual(Object.keys(note).sort(), ['courseId', 'month', 'sourceIds', 'tradeoff', 'why'])
  const enriched = page.props.courses.map(c => ({ ...c, testMarker: 'preserved-generic-field' }))
  assert.equal(core.getGolfMonthSelection(enriched, 1).featured.testMarker, 'preserved-generic-field')
})

test('lookup and real GolfReason reject missing or duplicate notes rather than pending/first match', async () => {
  const display = core.getGolfDisplayCatalog(freshCatalog(), courses)
  const { courseId, month } = display.notes[0]
  const missing = structuredClone(display)
  missing.notes.shift()
  const duplicate = structuredClone(display)
  duplicate.notes.push(structuredClone(duplicate.notes[0]))
  for (const [catalog, expected] of [[missing, /Missing golf course\/month note/], [duplicate, /Duplicate golf course\/month note/]]) {
    assert.throws(() => core.getGolfReason(catalog, courseId, month), expected)
    await assert.rejects(() => renderReason(catalog, courseId, month), expected)
  }
  const duplicateSource = structuredClone(display)
  duplicateSource.sources.push(structuredClone(duplicateSource.sources.find(s => s.id === display.notes[0].sourceIds[0])))
  assert.throws(() => core.getGolfReason(duplicateSource, courseId, month), /Duplicate golf source/)
})
