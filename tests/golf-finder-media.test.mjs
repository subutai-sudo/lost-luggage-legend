import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const inline = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const compile = code => ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
const jsonModule = value => inline(`export default ${JSON.stringify(value)}`)
const wire = (code, imports) => Object.entries(imports).reduce((text, [name, url]) => text.replaceAll(`'${name}'`, `'${url}'`).replaceAll(`"${name}"`, `"${url}"`), compile(code))
const courseModule = inline(compile(await read('src/data/golfCourses.ts')))
const { GOLF_COURSES } = await import(courseModule)
const destinations = (await read('src/data/destinationGuides.ts')).replace(/import type[^\n]+\n/g, '')
const ledger = JSON.parse(await read('src/data/golfCourseMedia.json'))
const mediaModule = inline(wire(await read('src/lib/golfMedia.ts'), {
  '../data/golfCourses': courseModule, '../data/golfCourseMedia.json': jsonModule(ledger),
}))
const discoveryModule = inline(wire(await read('src/lib/golfDiscovery.ts'), {
  './goldilocksDiscovery': inline(compile(await read('src/lib/goldilocksDiscovery.ts'))),
}))
async function renderPage(records = ledger) {
  const imports = {
    'react/jsx-runtime': inline('export const jsx = (type, props) => ({type, props}); export const jsxs = jsx;'),
    '@/components/GolfZone': inline('export const GolfZone = "GolfZone"'),
    '@/data/destinationGuides': inline(compile(destinations)),
    '@/data/golfCourses': courseModule,
    '@/data/golfSources.json': jsonModule(JSON.parse(await read('src/data/golfSources.json'))),
    '@/data/golfCourseNotes.json': jsonModule(JSON.parse(await read('src/data/golfCourseNotes.json'))),
    '@/lib/golfDiscovery': discoveryModule,
    '@/lib/site': inline('export const pageMetadata = x => x'),
  }
  // The real server helper and real validator execute here; only the framework
  // poison pill and the authoring import are replaced for this Node harness.
  try {
    imports['@/lib/golfFinderMedia'] = inline(wire(await read('src/lib/golfFinderMedia.ts'), {
      'server-only': inline(''), './golfMedia': mediaModule,
      '../data/golfCourseMedia.json': jsonModule(records), '../data/golfCourses': courseModule,
    }))
  } catch (error) { if (error.code !== 'ENOENT') throw error }
  return (await import(inline(wire(await read('src/app/golf/page.tsx'), imports)))).default()
}

test('real finder page projects first approved photo, never destination scenery as course media', async () => {
  const page = await renderPage()
  assert.equal(page.props.courses.length, 37)
  assert.equal(page.props.catalog.notes.length, 72)
  for (const course of page.props.courses) {
    const record = ledger.find(r => r.courseId === course.id)
    assert.ok(course.media, `${course.id}: missing validated finder media`)
    assert.deepEqual(Object.keys(course.media).sort(), ['gallery', 'hasRoutingDiagram', 'layoutKind', 'photo', 'photoCount'])
    assert.equal(course.media.photoCount, record.photos.length)
    assert.equal(course.media.hasRoutingDiagram, !!record.map)
    assert.equal(course.media.layoutKind, record.layout?.kind ?? null)
    assert.equal(course.media.gallery, !!record.gallery)
    if (!record.photos.length) { assert.equal(course.media.photo, null); continue }
    const keys = ['src', 'alt', 'author', 'license', 'licenseUrl', 'sourcePage']
    assert.deepEqual(Object.keys(course.media.photo).sort(), [...keys].sort())
    assert.deepEqual(course.media.photo, Object.fromEntries(keys.map(key => [key, record.photos[0][key]])))
  }
  const byId = Object.fromEntries(page.props.courses.map(c => [c.id, c]))
  assert.equal(byId['oitavos-dunes'].media.photo.src, '/golf-media/oitavos-dunes-01.webp')
  assert.equal(byId['emirates-golf-club-majlis-course'].media.photo.src, '/golf-media/emirates-golf-club-majlis-course-02.webp')
  assert.equal(byId.muirfield.media.photo.src, '/golf-media/muirfield-01.webp')
  assert.equal(byId['keilir-golf-club'].media.photo, null)
  assert.match(byId['keilir-golf-club'].image, /^https:\/\/images.unsplash.com\//)
})

for (const [label, mutate] of [
  ['missing record', r => r.pop()],
  ['duplicated record', r => { r[1] = structuredClone(r[0]) }],
  ['cross-course image', r => { r.find(x => x.courseId === 'oitavos-dunes').photos[0].src = '/golf-media/muirfield-01.webp' }],
  ['missing credit', r => { r.find(x => x.photos.length).photos[0].author = '' }],
  ['unsafe source', r => { r.find(x => x.photos.length).photos[0].sourcePage = 'javascript:alert(1)' }],
  ['wrong licence', r => { r.find(x => x.photos.length).photos[0].licenseUrl = 'https://example.com/' }],
]) test(`actual finder boundary rejects ${label}`, async () => {
  const records = structuredClone(ledger); mutate(records)
  await assert.rejects(() => renderPage(records))
})

test('finder projection strips private and unused media fields without mutating authoring input', async () => {
  const records = structuredClone(ledger)
  for (const r of records) {
    r.privateReview = 'PRIVATE_SENTINEL'
    for (const p of r.photos) p.privateReview = 'PRIVATE_SENTINEL'
  }
  const before = JSON.stringify(records)
  const page = await renderPage(records)
  assert.doesNotMatch(JSON.stringify(page.props), /PRIVATE_SENTINEL|originalUrl|"scope"|"checkedAt"(?=:.*golf-media)/)
  assert.equal(JSON.stringify(records), before)
  assert.deepEqual(page.props.courses.map(c => c.id), GOLF_COURSES.map(c => c.id))
})

test('client never imports authoring media or rewrites local photos through destination discovery', async () => {
  const client = await read('src/components/GolfZone.tsx')
  assert.doesNotMatch(client, /import (?!type)[^\n]*(?:golfFinderMedia|golfMedia|golfCourseMedia)/)
  assert.match(client, /golfCourseHref\(course.id, month, true\)/)
  assert.match(await read('src/lib/golfFilters.ts'), /#course-visuals/)
  assert.match(client, /Course photograph/)
  assert.match(client, /Destination photograph/)
  assert.doesNotMatch(client, /Photos show destinations, not courses\./)
})

test('all twelve real preview buttons show their own photo kind while the credits stay collapsed', async () => {
  const page = await renderPage()
  const component = wire(await read('src/components/GolfZone.tsx'), {
    react: inline('export const useEffect = () => {}; export const useMemo = fn => fn(); export const useRef = value => ({current: value}); export const useState = value => [value, () => {}]'),
    'react/jsx-runtime': inline('export const jsx = (type, props) => ({type, props}); export const jsxs = jsx;'),
    'next/image': inline('export default "Image"'), 'next/link': inline('export default "Link"'),
    '@/components/Navbar': inline('export const Navbar = "Navbar"'),
    '@/components/NewsletterSignup': inline('export const NewsletterSignup = "NewsletterSignup"'),
    '@/components/GolfReason': inline('export const GolfReason = "GolfReason"'),
    '@/data/golfOperationalNotices': inline('export const GOLF_OPERATIONAL_NOTICES = {}'),
    '@/lib/golfDiscovery': discoveryModule, '@/lib/golfFilters': inline(compile(await read('src/lib/golfFilters.ts'))), './GolfZone.module.css': inline('export default {}'),
  })
  const tree = (await import(inline(component))).GolfZone(page.props)
  const nodes = []
  const walk = node => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) { node.forEach(walk); return }
    nodes.push(node); walk(node.props?.children)
  }
  walk(tree)
  const buttons = nodes.filter(node => node.type === 'button' && node.props['data-golf-month'])
  assert.equal(buttons.length, 12)
  // Independently accepted lead photo kinds, not derived from the rendered flag.
  const expected = ['Course photo', 'Course photo', 'Destination view', 'Destination view', 'Course photo', 'Course photo', 'Destination view', 'Destination view', 'Course photo', 'Course photo', 'Destination view', 'Destination view']
  for (const [index, button] of buttons.entries()) {
    const label = button.props.children.find(node => node.props?.['data-golf-preview-kind'] !== undefined)
    assert.ok(label, `month ${index + 1}: must have its own visible photo-kind label`)
    assert.equal(label.props.children, expected[index])
    assert.notEqual(label.props.hidden, true)
  }
  assert.equal(nodes.find(node => node.type === 'details' && node.props['data-golf-preview-credits'] !== undefined).props.open, undefined)
})
