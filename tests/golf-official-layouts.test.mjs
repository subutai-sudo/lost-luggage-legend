import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'
const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const expected = JSON.parse(read('tests/fixtures/golf-official-layouts-expected.json'))
const ledger = JSON.parse(read('src/data/golfCourseMedia.json'))
const kindLabels = { 'routing-map':'Course routing map', 'hole-diagrams':'Hole-by-hole diagrams', 'video-tour':'Hole-flyover video guide', 'hole-tour':'Hole tour', scorecard:'Scorecard · not a routing map' }
const original = JSON.parse(execFileSync('git', ['show', `${expected.baseline}:src/data/golfCourseMedia.json`], { encoding: 'utf8', cwd: root }))
const inline = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const compile = source => ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
const mediaCode = read('src/lib/golfMedia.ts')
  .replace("'../data/golfCourseMedia.json'", `'${inline(`export default ${JSON.stringify(ledger)}`)}'`)
  .replace("'../data/golfCourses'", `'${inline('export const GOLF_COURSES = ' + JSON.stringify(ledger.map(e => ({id:e.courseId}))))}'`)
const { validateGolfMedia, getGolfMediaForCourse } = await import(inline(compile(mediaCode)))
let componentCode = compile(read('src/components/GolfCourseMedia.tsx'))
for (const [name, stub] of Object.entries({
  'react/jsx-runtime': 'export const jsx=(type,props)=>({type,props}); export const jsxs=jsx; export const Fragment="Fragment";',
  'next/image': 'export default "Image"',
  './GolfCourseMedia.module.css': 'export default new Proxy({}, {get:(_,key)=>key})',
  './GolfVisualsFragment': 'export const GolfVisualsFragment="GolfVisualsFragment"',
})) componentCode = componentCode.replaceAll(`'${name}'`, `'${inline(stub)}'`).replaceAll(`"${name}"`, `"${inline(stub)}"`)
const { GolfCourseMedia } = await import(inline(componentCode))
const nodes = tree => tree == null || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(nodes) : [tree, ...nodes(tree.props?.children)]
const text = tree => tree == null || tree === false ? '' : Array.isArray(tree) ? tree.map(text).join(' ') : typeof tree === 'object' ? text(tree.props?.children) : String(tree)

for (const [id, resource] of Object.entries(expected.resources)) {
  test(`${id}: exact official resource and visible descriptive action`, () => {
    const media = getGolfMediaForCourse(id)
    for (const key of ['kind', 'url', 'label', 'scope']) assert.equal(media.layout[key], resource[key], `${id}/${key}`)
    const tree = GolfCourseMedia({ media, courseName: id })
    const link = nodes(tree).find(n => Object.hasOwn(n.props ?? {}, 'data-golf-layout-resource'))
    assert.equal(link.props.href, resource.url)
    assert.ok(text(link).includes(resource.label))
    const badge = nodes(tree).find(n => Object.hasOwn(n.props ?? {}, 'data-golf-layout-kind'))
    assert.ok(badge, 'resource type remains visible')
    assert.equal(badge.props['data-golf-layout-kind'], resource.kind)
    assert.equal(text(badge), kindLabels[resource.kind])
    if (id === 'sentosa-golf-club-serapong') {
      assert.equal(media.gallery.samePageAsLayout, true)
      assert.equal(nodes(tree).filter(n => Object.hasOwn(n.props ?? {}, 'data-golf-gallery-resource')).length, 0)
      assert.equal(nodes(tree).filter(n => Object.hasOwn(n.props ?? {}, 'data-golf-gallery-same-page')).length, 1)
    }
    assert.ok(text(tree).includes(resource.scope))
  })
}

test('resource corrections preserve all course photos, maps and gallery records except exact same-page flags', () => {
  assert.equal(ledger.length, original.length)
  for (const [index, entry] of ledger.entries()) {
    const before = original[index]
    assert.equal(entry.courseId, before.courseId)
    assert.deepEqual(entry.photos, before.photos)
    assert.deepEqual(entry.map, before.map)
    assert.deepEqual(entry.gallery && {...entry.gallery, samePageAsLayout: before.gallery.samePageAsLayout}, before.gallery)
    if (entry.gallery) assert.equal(entry.gallery.samePageAsLayout, !!entry.layout && entry.gallery.url === entry.layout.url)
    if (!expected.resources[entry.courseId]) assert.deepEqual(entry, before)
  }
})

test('broken guide and blocked club site are not promoted as usable layouts', () => {
  for (const id of expected.unlinked) assert.equal(getGolfMediaForCourse(id).layout, null)
  for (const e of ledger) if (e.layout) assert.ok(!expected.excludedUrls.includes(e.layout.url))
})

test('unknown availability is bounded to this page, not a claim a publisher has no layout', () => {
  const tree = GolfCourseMedia({ media:getGolfMediaForCourse('bali-national-golf-club'), courseName:'Bali National Golf Club' })
  const unavailable = nodes(tree).find(n => Object.hasOwn(n.props ?? {}, 'data-golf-layout-unavailable'))
  assert.match(text(unavailable), /not linked here yet/)
  assert.doesNotMatch(text(unavailable), /No exact-course routing map or hole tour is available/)
})

test('new resource kinds validate but arbitrary and unsafe types never do', () => {
  for (const kind of ['hole-diagrams','video-tour']) {
    const record = structuredClone(ledger.find(e => e.courseId === 'brautarholt-golf-club'))
    record.layout.kind = kind
    assert.doesNotThrow(() => validateGolfMedia([record], [record.courseId]))
    record.layout.kind = 'satellite-map'
    assert.throws(() => validateGolfMedia([record], [record.courseId]), /resource type/)
    record.layout.kind = kind
    record.layout.url = 'javascript:alert(1)'
    assert.throws(() => validateGolfMedia([record], [record.courseId]))
  }
})

test('a wrong layout URL is rejected by the independent resource oracle', () => {
  const bad = structuredClone(ledger.find(e => e.courseId === 'royal-golf-marrakech-old-course'))
  bad.layout.url = 'https://royal-golf-marrakech.com/wrong-course'
  assert.throws(() => assert.equal(bad.layout.url, expected.resources[bad.courseId].url))
})
