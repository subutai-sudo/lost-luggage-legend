import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/lib/golfFilters.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
const { readGolfFilters, filterGolfCourses, golfFinderQuery, golfCourseHref } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const courses = [
  { id: 'a', name: 'Muirfield', city: 'Gullane', country: 'Scotland', character: 'links', media: { photo: { src: '/a.webp' } } },
  { id: 'b', name: 'El Prat', city: 'Terrassa', country: 'Spain', character: 'parkland', media: { photo: null } },
  { id: 'c', name: 'Crans-sur-Sierre', city: 'Crans-Montana', country: 'Switzerland', character: 'mountain', media: { photo: null } },
]
const none = { q: '', character: '', photos: false }
test('validates URL filters and bounds query input', () => {
  assert.deepEqual(readGolfFilters('?q=  Muirfield  &style=links&photos=1'), { q: 'Muirfield', character: 'links', photos: true })
  assert.deepEqual(readGolfFilters('?style=private&photos=true'), none)
  assert.equal(readGolfFilters('?q=' + 'x'.repeat(300)).q.length, 80)
  assert.equal(readGolfFilters('?q=%00hello').q, 'hello')
})
test('searches names, cities and countries without changing curated order or inputs', () => {
  for (const q of ['muirfield', ' GULLANE ', 'scotland']) assert.deepEqual(filterGolfCourses(courses, { ...none, q }).map(c => c.id), ['a'])
  assert.deepEqual(filterGolfCourses(courses, none).map(c => c.id), ['a', 'b', 'c'])
  assert.equal(courses.length, 3)
  assert.deepEqual(filterGolfCourses(courses, { ...none, q: 'no match' }), [])
})
test('intersects exact character and real on-page photo availability, not destination fallbacks', () => {
  assert.deepEqual(filterGolfCourses(courses, { ...none, character: 'parkland' }).map(c => c.id), ['b'])
  assert.deepEqual(filterGolfCourses(courses, { ...none, photos: true }).map(c => c.id), ['a'])
  assert.deepEqual(filterGolfCourses(courses, { ...none, q: 'Spain', photos: true }), [])
  assert.deepEqual(filterGolfCourses(courses, { ...none, q: 'Scotland', character: 'links', photos: true }).map(c => c.id), ['a'])
})
test('serializes canonical bounded filters, never external URLs or raw markup', () => {
  assert.equal(golfFinderQuery(6, { q: 'Muirfield & friends', character: 'links', photos: true }), '?month=6&q=Muirfield+%26+friends&style=links&photos=1')
  assert.equal(golfFinderQuery(6, none), '?month=6')
  assert.throws(() => golfFinderQuery(13, none), /month/i)
  assert.equal(golfCourseHref('muirfield', 6), '/golf/muirfield?month=6')
  assert.equal(golfCourseHref('muirfield', 6, true), '/golf/muirfield?month=6#course-visuals')
  assert.throws(() => golfCourseHref('../evil', 6), /course/i)
})
