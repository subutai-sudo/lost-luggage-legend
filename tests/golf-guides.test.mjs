import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'
const read = p => readFile(new URL(`../${p}`, import.meta.url), 'utf8')
const mod = s => `data:text/javascript;base64,${Buffer.from(s).toString('base64')}`
const compile = s => ts.transpileModule(s, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
const gd = mod(compile(await read('src/lib/goldilocksDiscovery.ts')))
const golf = mod(compile((await read('src/lib/golfDiscovery.ts')).replace("'./goldilocksDiscovery'", `'${gd}'`)))
const coursesModule = mod(compile(await read('src/data/golfCourses.ts')))
const destinationsModule = mod(compile(await read('src/data/destinationGuides.ts')))
const json = async p => JSON.parse(await read(`src/data/${p}.json`))
const details = await json('golfGuideDetails'), sources = await json('golfSources'), notes = await json('golfCourseNotes')
let helper = await read('src/lib/golfGuides.ts')
for (const [path, url] of Object.entries({
  '../data/destinationGuides': destinationsModule,
  '../data/golfCourses': coursesModule,
  '../data/golfGuideDetails.json': mod(`export default ${JSON.stringify(details)}`),
  '../data/golfSources.json': mod(`export default ${JSON.stringify(sources)}`),
  '../data/golfCourseNotes.json': mod(`export default ${JSON.stringify(notes)}`),
  './golfDiscovery': golf,
})) helper = helper.replaceAll(`'${path}'`, `'${url}'`)
const core = await import(mod(compile(helper)))
const { GOLF_COURSES: courses } = await import(coursesModule)
const { DESTINATION_GUIDES: destinations } = await import(destinationsModule)
const input = () => structuredClone({ details, sources, notes, courses, destinations })

test('every catalog course has substantive unique golf copy and exact source references', () => {
  const guides = core.getGolfGuides()
  assert.equal(guides.length, courses.length)
  assert.equal(guides.length, 37)
  assert.deepEqual(guides.map(g => g.course.id), courses.map(c => c.id))
  assert.equal(new Set(guides.map(g => g.overview)).size, guides.length)
  for (const guide of guides) {
    assert.ok(guide.overview.length > 160)
    assert.ok(guide.playingNotes.length >= 3)
    assert.ok(guide.planning.length >= 3)
    assert.ok(guide.access.length > 80)
    assert.ok(guide.sources.length)
    assert.ok(guide.monthlyNotes.length)
    for (const line of [guide.overview, guide.access, ...guide.playingNotes, ...guide.planning]) {
      assert.doesNotMatch(line, /(?:\$|£|€)\s*\d|\d+[- ]minute drive|top attractions|where to eat/i)
    }
  }
  assert.equal(core.getGolfGuide('unknown-course'), undefined)
})

for (const [name, mutate] of Object.entries({
  'missing guide': i => i.details.pop(),
  'duplicate guide': i => i.details.push(i.details[0]),
  'unknown course': i => i.details[0].courseId = 'unknown-course',
  'empty overview': i => i.details[0].overview = ' ',
  'empty access': i => i.details[0].access = '',
  'empty playing notes': i => i.details[0].playingNotes = [],
  'duplicate playing notes': i => i.details[0].playingNotes.push(i.details[0].playingNotes[0]),
  'empty planning': i => i.details[0].planning = [],
  'dangling source': i => i.details[0].sourceIds = ['unknown-source'],
  'duplicate source ref': i => i.details[0].sourceIds.push(i.details[0].sourceIds[0]),
  'unsafe added source': i => i.details[0].sources = [{ ...i.sources[0], id: 'extra-source', url: 'javascript:alert(1)' }],
  'bad date': i => i.sources[0].checkedAt = '2026-02-30',
  'missing destination': i => i.destinations = [],
  'missing monthly note': i => i.notes.pop(),
})) {
  test(`real guide rendering boundary rejects ${name}`, () => {
    const i = input(); mutate(i)
    assert.throws(() => core.getGolfGuides(i))
  })
}

test('El Prat inventory and Royal Melbourne ordinary visitor restrictions remain explicit', () => {
  const el = core.getGolfGuide('real-club-de-golf-el-prat')
  assert.match(el.overview, /five nine-hole/)
  assert.match(el.overview, /Pink, Yellow and Green/)
  assert.doesNotMatch(el.overview, /four nine-hole/)
  const rm = core.getGolfGuide('the-royal-melbourne-golf-club-west')
  assert.match(rm.access, /International and interstate/)
  assert.match(rm.access, /Mondays, Tuesdays and Fridays/)
  assert.match(rm.access, /excluding public holidays/)
})

test('projection is nonmutating and strips authoring and audit fields', () => {
  const i = input(), original = structuredClone(i)
  i.details[0].evidence = 'DO-NOT-SHIP'
  i.sources[0].audit = 'DO-NOT-SHIP'
  const result = core.getGolfGuides(i)
  assert.doesNotMatch(JSON.stringify(result), /DO-NOT-SHIP|"evidence"|"audit"/)
  result[0].playingNotes.push('projection only')
  assert.deepEqual(i.details[0].playingNotes, original.details[0].playingNotes)
})
