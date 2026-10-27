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
    '@/lib/golfPreviewCopy': inline(wire(await read('src/lib/golfPreviewCopy.ts'), {
      'server-only': inline(''), '../data/golfCourseCharacter.json': jsonModule(JSON.parse(await read('src/data/golfCourseCharacter.json'))),
      '../data/golfCourses': courseModule,
    })),
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


const leadIds = ['emirates-golf-club-majlis-course', 'tpc-scottsdale-stadium-course', 'royal-cape-golf-club', 'the-royal-melbourne-golf-club-west', 'portmarnock-golf-club', 'muirfield', 'keilir-golf-club', 'capilano-golf-and-country-club', 'bethpage-black', 'oitavos-dunes', 'steenberg-golf-club', 'new-south-wales-golf-club']
const text = node => node == null ? '' : Array.isArray(node) ? node.map(text).join(' ') : typeof node === 'object' ? text(node.props?.children) : String(node)
async function finderNodes(month) {
  const page = await renderPage()
  const component = wire(await read('src/components/GolfZone.tsx'), {
    react: inline('export const useEffect = () => {}; export const useMemo = fn => fn(); export const useState = value => [value, () => {}]'),
    'react/jsx-runtime': inline('export const jsx = (type, props) => ({type, props}); export const jsxs = jsx;'),
    'next/image': inline('export default "Image"'), 'next/link': inline('export default "Link"'),
    '@/components/Navbar': inline('export const Navbar = "Navbar"'),
    '@/components/NewsletterSignup': inline('export const NewsletterSignup = "NewsletterSignup"'),
    '@/components/GolfReason': inline('export const GolfReason = "GolfReason"'),
    '@/data/golfOperationalNotices': inline('export const GOLF_OPERATIONAL_NOTICES = {}'),
    '@/lib/golfDiscovery': discoveryModule, './GolfZone.module.css': inline('export default {}'),
  })
  const tree = (await import(inline(component))).GolfZone({ ...page.props, initialMonth: month })
  const nodes = []
  const walk = node => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) { node.forEach(walk); return }
    nodes.push(node); walk(node.props?.children)
  }
  walk(tree)
  return nodes
}

test('golf finder never displays an unrelated destination image in any month', async () => {
  for (let month = 1; month <= 12; month++) {
    const nodes = await finderNodes(month)
    for (const image of nodes.filter(n => n.type === 'Image')) {
      assert.match(image.props.src, /^\/golf-media\/[a-z0-9-]+\.(webp|png|jpg)$/, `month ${month}: no skyline/beach/destination substitute in the golf finder`)
    }
  }
})

test('each featured hero names its actual course instead of a generic slogan', async () => {
  for (let month = 1; month <= 12; month++) {
    const nodes = await finderNodes(month)
    const expected = GOLF_COURSES.find(c => c.id === leadIds[month - 1])
    assert.equal(text(nodes.find(n => n.type === 'h1')).trim(), expected.name)
  }
})

test('every month tile visibly identifies its exact named course, not only the city', async () => {
  const nodes = await finderNodes(1)
  const buttons = nodes.filter(n => n.type === 'button' && n.props['data-golf-month'])
  assert.equal(buttons.length, 12)
  for (const [index, button] of buttons.entries()) {
    const course = GOLF_COURSES.find(c => c.id === leadIds[index])
    assert.ok(text(button).includes(course.name), `month ${index + 1}: visibly show ${course.name}`)
    assert.equal(button.props['aria-label'], ['January','February','March','April','May','June','July','August','September','October','November','December'][index])
  }
})

test('card image overlays name the exact course rather than only generic photo labels', async () => {
  for (let month = 1; month <= 12; month++) {
    const nodes = await finderNodes(month)
    const figures = nodes.filter(n => n.type === 'Link' && n.props['aria-label']?.startsWith('Explore the '))
    assert.equal(figures.length, 6)
    for (const figure of figures) {
      const id = figure.props.href.split('/').pop()
      const course = GOLF_COURSES.find(c => c.id === id)
      assert.ok(text(figure).includes(course.name), `${id}: course name must be visible on the figure`)
    }
  }
})

test('every course shows a specific sourced character line, never generic travel copy', async () => {
  const page = await renderPage()
  const characterModule = inline(wire(await read('src/lib/golfPreviewCopy.ts'), {
    'server-only': inline(''), '../data/golfCourseCharacter.json': jsonModule(JSON.parse(await read('src/data/golfCourseCharacter.json'))),
    '../data/golfCourses': courseModule,
  }))
  const approved = (await import(characterModule)).getGolfCourseCharacter()
  const banned = /^(?:unforgettable|perfect|world-?class|hidden gem|must-?play|golf paradise|worth playing)\b|breathtaking|stunning|iconic/i
  for (const course of page.props.courses) {
    assert.equal(course.characterLine, approved[course.id])
    assert.ok(course.characterLine.length >= 24 && course.characterLine.length <= 72, `${course.id}: concise specific phrase`)
    assert.doesNotMatch(course.characterLine, banned, `${course.id}: no generic travel-marketing line`)
  }
  const phrases = page.props.courses.map(c => c.characterLine)
  assert.equal(new Set(phrases).size, phrases.length, 'character copy must be unique per course')
})

test('projected finder copy stays free of research language and destination-naming text', async () => {
  const page = await renderPage()
  // The projected catalogue legitimately carries reader-facing seasonal prose, so
  // scope this to the fields this change owns plus the research-language check.
  assert.doesNotMatch(JSON.stringify(page.props), /our review|\bretrieved\b|HTTP \\d{3}|\\brationale\\b|\\bevidence\\b/i)
  const owned = page.props.courses.flatMap(course => [course.characterLine, course.media.photo?.alt ?? '', course.media.photo?.caption ?? ''])
  for (const line of owned) assert.doesNotMatch(line, /not the course|destination photograph|destination view/i)
})

test('character copy guard rejects generic, unsafe and incomplete input', async () => {
  const base = JSON.parse(await read('src/data/golfCourseCharacter.json'))
  const load = async records => {
    const module = inline(wire(await read('src/lib/golfPreviewCopy.ts'), {
      'server-only': inline(''), '../data/golfCourseCharacter.json': jsonModule(records), '../data/golfCourses': courseModule,
    }))
    return (await import(module)).getGolfCourseCharacter()
  }
  assert.equal(Object.keys(await load(base)).length, 37)
  await assert.rejects(() => load(Object.fromEntries(Object.entries(base).slice(1))), /cover every course exactly once/)
  await assert.rejects(() => load({ ...base, muirfield: `${base.muirfield} ` }), /trimmed 24–72 character/)
  await assert.rejects(() => load({ ...base, muirfield: 'stunning must-play vista' }), /generic marketing copy/)
  await assert.rejects(() => load({ ...base, muirfield: 'Verified by our review and retrieved from evidence' }), /internal verification language/)
  await assert.rejects(() => load({ ...base, muirfield: 'Links golf see https://example.com for detail' }), /non-copy characters/)
})
