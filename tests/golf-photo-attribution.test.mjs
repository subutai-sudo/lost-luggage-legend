import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const inline = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const compile = code => ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
const wire = (code, imports) => Object.entries(imports).reduce((text, [name, url]) => text.replaceAll(`'${name}'`, `'${url}'`).replaceAll(`"${name}"`, `"${url}"`), compile(code))
const module = async (path, imports = {}) => inline(wire(await read(path), imports))
const json = value => inline(`export default ${JSON.stringify(value)}`)
const jsonFile = async path => json(JSON.parse(await read(path)))
const require = createRequire(import.meta.url)
const runtime = Object.fromEntries(['react', 'react/jsx-runtime'].map(name => [name, pathToFileURL(require.resolve(name)).href]))
const css = inline('export default new Proxy({}, { get: (_, key) => key })')
const noop = inline('export const Navbar = () => null; export const BrandLogo = () => null; export const GolfVisualsFragment = () => null; export const NewsletterSignup = () => null; export const GolfReason = () => null')
const framework = {
  ...runtime,
  'next/image': inline(`import { createElement } from '${runtime.react}'; export default ({src, alt, width, height}) => createElement('img', {src, alt, width, height})`),
  'next/link': inline('export default "a"'),
  'next/navigation': inline('export const notFound = () => { throw new Error("Not found") }'),
  '@/components/Navbar': noop, '@/components/BrandLogo': noop,
  '@/components/NewsletterSignup': noop, '@/components/GolfReason': noop,
  './GolfVisualsFragment': noop,
  './GolfZone.module.css': css, './GolfCourseMedia.module.css': css,
  '@/components/GolfGuide.module.css': css,
}
const ledger = JSON.parse(await read('src/data/golfCourseMedia.json'))
const coursesModule = await module('src/data/golfCourses.ts')
const { GOLF_COURSES } = await import(coursesModule)
const ids = GOLF_COURSES.map(course => course.id)
const mediaModule = await module('src/lib/golfMedia.ts', {
  '../data/golfCourses': coursesModule, '../data/golfCourseMedia.json': json(ledger),
})
const { validateGolfMedia, getGolfCourseMedia } = await import(mediaModule)
const finderModule = await module('src/lib/golfFinderMedia.ts', {
  'server-only': inline(''), './golfMedia': mediaModule,
  '../data/golfCourses': coursesModule, '../data/golfCourseMedia.json': json(ledger),
})
const { getGolfFinderMedia } = await import(finderModule)
const discovery = await module('src/lib/golfDiscovery.ts', {
  './goldilocksDiscovery': await module('src/lib/goldilocksDiscovery.ts'),
})
const destinations = await module('src/data/destinationGuides.ts')
const previewCopy = await module('src/lib/golfPreviewCopy.ts', {
  'server-only': inline(''), '../data/golfCourses': coursesModule,
  '../data/golfCourseCharacter.json': await jsonFile('src/data/golfCourseCharacter.json'),
})
const sources = await jsonFile('src/data/golfSources.json')
const notes = await jsonFile('src/data/golfCourseNotes.json')
const guides = await module('src/lib/golfGuides.ts', {
  '../data/destinationGuides': destinations, '../data/golfCourses': coursesModule,
  '../data/golfGuideDetails.json': await jsonFile('src/data/golfGuideDetails.json'),
  '../data/golfSources.json': sources, '../data/golfCourseNotes.json': notes,
  './golfDiscovery': discovery,
})
const { GolfCourseMedia } = await import(await module('src/components/GolfCourseMedia.tsx', framework))
const courseMediaModule = await module('src/components/GolfCourseMedia.tsx', framework)
const { default: GuidePage } = await import(await module('src/app/golf/[slug]/page.tsx', {
  ...framework,
  '@/lib/golfDiscovery': discovery, '@/lib/golfGuides': guides,
  '@/lib/golfMedia': mediaModule, '@/lib/golfPreviewCopy': previewCopy,
  '@/lib/site': inline('export const pageMetadata = x => x'),
  '@/components/GolfCourseMedia': courseMediaModule,
  '@/data/golfOperationalNotices': await module('src/data/golfOperationalNotices.ts'),
}))
const { default: FinderPage } = await import(await module('src/app/golf/page.tsx', {
  ...runtime, '@/components/GolfZone': inline('export const GolfZone = "GolfZone"'),
  '@/data/destinationGuides': destinations, '@/data/golfCourses': coursesModule,
  '@/data/golfSources.json': sources, '@/data/golfCourseNotes.json': notes,
  '@/lib/golfDiscovery': discovery, '@/lib/golfFinderMedia': finderModule,
  '@/lib/golfPreviewCopy': previewCopy, '@/lib/site': inline('export const pageMetadata = x => x'),
}))
const finderProps = FinderPage().props
// Arrange each approved asset as a feature, month preview and card, including the
// second Al Maaden photo (not currently first in its ledger). The real server
// projection and real component execute; this selection stub tests credit reuse,
// not monthly eligibility, which is independently covered by finder tests.
const { GolfZone: CreditSurfaces } = await import(await module('src/components/GolfZone.tsx', {
  ...framework, '@/data/golfOperationalNotices': inline('export const GOLF_OPERATIONAL_NOTICES = {}'),
  '@/lib/golfDiscovery': inline(`export const MONTH_NAMES = ${JSON.stringify((await import(discovery)).MONTH_NAMES)};
    export const readGolfMonth = () => 1;
    export const getGolfMonthSelection = courses => ({ featured: courses[0], shortlist: courses.slice(0, 6) });
    export const getGolfMonthPreviews = courses => Array(12).fill(courses[0]);`),
}))
const text = html => html.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"')
const render = (component, props) => renderToStaticMarkup(createElement(component, props))
const alMaadenAuthor = 'Didierlefort (DL2A – Didier Lefort Architectes Associés)'
const conversion = 'Converted to WebP at the original dimensions; cropped for display where used.'
const resized = 'Resized and converted to WebP; cropped for display where used.'
const permanentCrop = 'Permanently cropped from the left side of the original panorama, resized and converted to WebP; further cropped for display where used.'
// Independent audited expectations: neither statements nor hashes are derived
// from the production ledger that these assertions are meant to constrain.
const expected = [
  ['al-maaden-golf', 'al-maaden-golf-01.webp', alMaadenAuthor, conversion, '59346beba6444000bcb66f26ba988bae7cf4a904e4675669b9db22f918ed22c5'],
  ['al-maaden-golf', 'al-maaden-golf-02.webp', alMaadenAuthor, conversion, '02eb25cf06eccbae2fa538f020720e3d1da658d2160d5d5f266d01768c9c5183'],
  ['keilir-golf-club', 'keilir-golf-club-01.webp', 'Eysteinn Guðni Guðnason', resized, 'e638d16ba5bfdad83793834dfbf0986fe56cc922aae83c260283aafbf2b1b3d3'],
  ['new-south-wales-golf-club', 'new-south-wales-golf-club-01.webp', 'Eddy23', permanentCrop, 'b012b1a863d04a0ec4dd878c53de705127ef3678a412bdeada88d59c9d79bb5e'],
  ['wentworth-club-west', 'wentworth-club-west-01.webp', 'Alan Hunt', resized, '44f477816f91107662a3aaf34d4458cdad41b6ad0eecad5d34505d02fb7d1fe2'],
]

for (const [courseId, filename, author, modifications, hash] of expected) {
  test(`${filename}: truthful source credit and unchanged reviewed pixels`, async () => {
    const photo = ledger.find(record => record.courseId === courseId).photos.find(photo => photo.src === `/golf-media/${filename}`)
    assert.equal(photo.author, author)
    assert.equal(photo.modifications, modifications)
    if (courseId === 'al-maaden-golf') {
      assert.ok(photo.scope.includes(alMaadenAuthor))
      assert.doesNotMatch(photo.modifications, /resiz/i, 'same-dimension Al Maaden conversion is not a resize')
    }
    const bytes = await readFile(new URL(`../public${photo.src}`, import.meta.url))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash)
  })

  test(`${filename}: actual server projections and all finder/guide credit surfaces carry changes`, async () => {
    const records = structuredClone(ledger)
    const record = records.find(record => record.courseId === courseId)
    const index = record.photos.findIndex(photo => photo.src === `/golf-media/${filename}`)
    ;[record.photos[0], record.photos[index]] = [record.photos[index], record.photos[0]]
    record.photos[0].privateReview = 'PRIVATE_SENTINEL'
    const media = getGolfCourseMedia(courseId, records, ids)
    const finder = getGolfFinderMedia(records)[courseId]
    assert.equal(media.photos[0].modifications, modifications)
    assert.equal(finder.photo.modifications, modifications)
    assert.doesNotMatch(JSON.stringify([media, finder]), /PRIVATE_SENTINEL/)
    const originalCourse = finderProps.courses.find(course => course.id === courseId)
    assert.equal(originalCourse.media.photo.modifications, modifications)
    const course = { ...originalCourse, media: finder }
    const finderHtml = render(CreditSurfaces, { ...finderProps, courses: [course, ...finderProps.courses.filter(item => item.id !== courseId)] })
    const hero = finderHtml.match(/<div[^>]*data-golf-hero-credit="[^"]*"[^>]*>(.*?)<\/div>/s)?.[1]
    const preview = finderHtml.match(/<li[^>]*data-golf-preview-credit="1"[^>]*>(.*?)<\/li>/s)?.[1]
    const card = finderHtml.match(/<div[^>]*data-golf-photo-credit="[^"]*"[^>]*>(.*?)<\/div>/s)?.[1]
    for (const [surface, html] of Object.entries({ hero, preview, card })) {
      assert.ok(html, `${surface}: credit surface missing`)
      assert.ok(text(html).includes(author), `${surface}: source author omitted`)
      assert.ok(text(html).includes(modifications), `${surface}: changes omitted`)
      assert.ok(html.includes(finder.photo.sourcePage), `${surface}: source link omitted`)
      assert.ok(html.includes(finder.photo.licenseUrl), `${surface}: licence link omitted`)
    }
    const gallery = render(GolfCourseMedia, { media, courseName: course.name })
    const firstFigure = gallery.match(/<figure[^>]*data-golf-photo="[^"]*"[^>]*>(.*?)<\/figure>/s)?.[1]
    assert.ok(firstFigure && text(firstFigure).includes(modifications), 'full-size gallery must disclose the source-file change')
    assert.ok(text(firstFigure).includes(author))
    assert.doesNotMatch(text(firstFigure), /cropped in the hero where used/, 'specific changes replace the generic fallback')
    const guideHtml = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug: courseId }) }))
    const guideHero = guideHtml.match(/<header[^>]*data-golf-guide-hero="[^"]*"[^>]*>(.*?)<\/header>/s)?.[1]
    assert.ok(guideHero && text(guideHero).includes(modifications), 'actual course-guide hero must disclose changes')
    assert.ok(text(guideHero).includes(author))
    if (courseId === 'new-south-wales-golf-club') {
      for (const html of [hero, preview, card, firstFigure, guideHero]) {
        assert.match(text(html), /Permanently cropped from the left side of the original panorama/)
      }
    }
  })
}

for (const bad of ['', '   ', null, 17, {}, '<script>alert(1)</script>', 'Converted\u0000to WebP.', 'Our review confirmed conversion.', 'HTTP 200; resized.', 'Retrieved from the source.']) {
  test(`actual validator and both projection boundaries reject modifications ${JSON.stringify(bad)}`, () => {
    const records = structuredClone(ledger)
    records[0].photos[0].modifications = bad
    assert.throws(() => validateGolfMedia(records, ids), /modifications/)
    assert.throws(() => getGolfCourseMedia(records[0].courseId, records, ids), /modifications/)
    assert.throws(() => getGolfFinderMedia(records), /modifications/)
  })
}

test('optional modifications preserve legacy credit text and the 42-photo / 22-course / 45-asset inventory', async () => {
  assert.equal(ledger.flatMap(record => record.photos).length, 42)
  assert.equal(ledger.filter(record => record.photos.length).length, 22)
  assert.equal(ledger.flatMap(record => record.photos).length + ledger.filter(record => record.map).length, 45)
  assert.equal(ledger.flatMap(record => record.photos).filter(photo => photo.modifications !== undefined).length, 5)
  let unchanged = 0
  for (const record of ledger) {
    const legacy = record.photos.filter(photo => photo.modifications === undefined)
    if (!legacy.length) continue
    unchanged += legacy.length
    const media = getGolfCourseMedia(record.courseId, ledger, ids)
    assert.ok(media.photos.filter(photo => photo.modifications === undefined).every(photo => !Object.hasOwn(photo, 'modifications')))
    const html = render(GolfCourseMedia, { media: { ...media, photos: legacy }, courseName: record.courseId })
    assert.equal(text(html).split('Resized for display; cropped in the hero where used.').length - 1, legacy.length)
    const finder = getGolfFinderMedia(ledger)[record.courseId]
    assert.ok(!Object.hasOwn(finder.photo, 'modifications'))
    const guideHtml = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug: record.courseId }) }))
    assert.ok(text(guideHtml).includes(`Photo ${record.photos[0].author}, ${record.photos[0].license}, resized for display.`))
  }
  assert.equal(unchanged, 37)
})
