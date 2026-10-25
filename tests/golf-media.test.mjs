import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../src/lib/golfMedia.ts', import.meta.url), 'utf8')
const coursesSource = await readFile(new URL('../src/data/golfCourses.ts', import.meta.url), 'utf8')
const ledger = await readFile(new URL('../src/data/golfCourseMedia.json', import.meta.url), 'utf8')
const inline = text => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`
const compile = text => ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
const coursesModule = inline(compile(coursesSource))
const wired = source
  .replaceAll("'../data/golfCourseMedia.json'", `'${inline(`export default ${ledger}`)}'`)
  .replaceAll("'../data/golfCourses'", `'${coursesModule}'`)
const { validateGolfMedia, getGolfCourseMedia, getGolfMediaForCourse } = await import(inline(compile(wired)))
const ids = ['oitavos-dunes']
const resource = { url: 'https://oitavosdunes.com/course-overview/', label: 'Oitavos Dunes course overview', publisher: 'Oitavos Dunes', checkedAt: '2026-10-25', scope: 'Official hole-by-hole course overview.' }
// Schema fixture only: not a media identity, asset or permission claim.
const photo = { src: '/golf-media/oitavos-dunes-test.webp', width: 1200, height: 800, alt: 'Schema test fixture', caption: 'Schema test fixture', scope: 'Test only, never rendered.', author: 'Fixture author', sourcePage: 'https://commons.wikimedia.org/wiki/File:Test_fixture.jpg', originalUrl: 'https://upload.wikimedia.org/test-fixture.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', checkedAt: '2026-10-25' }
const input = () => [{ courseId: 'oitavos-dunes', gallery: { ...resource }, layout: { ...resource, kind: 'hole-tour' }, photos: [{ ...photo }], map: null }]

test('display projection preserves genuine fields but never arbitrary authoring evidence', () => {
  const records = input(); records[0].evidence = 'PRIVATE-RESEARCH'; records[0].photos[0].review = 'PRIVATE-RESEARCH'
  const original = structuredClone(records)
  const media = getGolfCourseMedia('oitavos-dunes', records, ids)
  assert.equal(media.layout.kind, 'hole-tour')
  assert.equal(media.photos[0].license, 'CC BY-SA 4.0')
  assert.doesNotMatch(JSON.stringify(media), /PRIVATE-RESEARCH/)
  media.photos[0].caption = 'changed projection'
  assert.deepEqual(records, original)
  assert.equal(getGolfCourseMedia('unknown-course', records, ids), undefined)
})

test('the shipped ledger covers every catalog course and never ships a placeholder photo', () => {
  const courseIds = [...coursesSource.matchAll(/    id: '([^']+)'/g)].map(match => match[1])
  for (const id of courseIds) {
    const media = getGolfMediaForCourse(id)
    assert.ok(media, `${id}: missing media record`)
    assert.ok(media.gallery || media.layout || media.map || media.photos.length, `${id}: no course-specific visual resource at all`)
    for (const photo of media.photos) assert.match(photo.src, new RegExp(`^/golf-media/${id}(?:-[a-z0-9]+)*\\.`), `${id}: cross-course asset`)
  }
  assert.equal(getGolfMediaForCourse('unknown-course'), undefined)
})

test('unavailable photography and map require explicit null/list values, not stock fallback', () => {
  const records = input(); records[0].photos = []; records[0].layout = null; records[0].gallery = null
  assert.doesNotThrow(() => validateGolfMedia(records, ids))
  assert.deepEqual(getGolfCourseMedia('oitavos-dunes', records, ids).photos, [])
})

test('routing diagrams require real unique hole references and retained data attribution', () => {
  const records = input()
  records[0].map = { src: '/golf-media/oitavos-dunes-routing.webp', width: 1400, height: 1000, alt: 'Schema test map', sourcePage: 'https://www.openstreetmap.org/', checkedAt: '2026-10-25', scope: 'Schema fixture, not real geometry.', holes: [1, 2], license: 'ODbL 1.0', licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/' }
  assert.doesNotThrow(() => validateGolfMedia(records, ids))
  const media = getGolfCourseMedia('oitavos-dunes', records, ids)
  media.map.holes.push(3)
  assert.deepEqual(records[0].map.holes, [1, 2])
  for (const mutate of [m => m.holes = [], m => m.holes = [1, 1], m => m.holes = [0, 19], m => m.holes = ['1'], m => m.license = 'All rights reserved', m => m.sourcePage = 'javascript:alert(1)', m => m.src = '/golf-media/muirfield-routing.webp']) {
    const changed = structuredClone(records); mutate(changed[0].map)
    assert.throws(() => validateGolfMedia(changed, ids))
  }
})

for (const [name, mutate] of Object.entries({
  'missing course': r => r.pop(),
  'duplicate course': r => r.push(structuredClone(r[0])),
  'unknown course': r => r[0].courseId = 'not-in-catalog',
  'missing gallery state': r => delete r[0].gallery,
  'missing photo list': r => delete r[0].photos,
  'missing map state': r => delete r[0].map,
  'missing source': r => r[0].photos[0].sourcePage = '',
  'unlicensed photo': r => r[0].photos[0].license = 'All rights reserved',
  'mismatched licence URL': r => r[0].photos[0].licenseUrl = 'https://creativecommons.org/licenses/by/4.0/',
  'private link': r => r[0].layout.url = 'https://127.0.0.1/private',
  'credential URL': r => r[0].layout.url = 'https://user:secret@example.com/',
  'unsafe scheme': r => r[0].gallery.url = 'javascript:alert(1)',
  'impossible date': r => r[0].gallery.checkedAt = '2026-02-30',
  'HTML attribution': r => r[0].photos[0].author = '<a>fixture</a>',
  'remote image proxy': r => r[0].photos[0].src = 'https://example.com/photo.jpg',
  'path traversal': r => r[0].photos[0].src = '/golf-media/../photo.jpg',
  'wrong course asset': r => r[0].photos[0].src = '/golf-media/muirfield.webp',
  'zero image dimensions': r => r[0].photos[0].width = 0,
  'duplicate image': r => r[0].photos.push({ ...r[0].photos[0] }),
  'scorecard mislabel': r => r[0].layout.kind = 'satellite-map',
})) {
  test(`media boundary rejects ${name}`, () => { const records = input(); mutate(records); assert.throws(() => validateGolfMedia(records, ids)) })
}

// Vector-diagram geometry guard. Independent review found two live defects in
// earlier renders: two tee discs 12px apart fused into one blob (one numeral lost
// at page scale), and dust polygons of 9-14px. Both are asserted here so a future
// render cannot reintroduce them, and the opaque background rect is required
// because the diagram sits on a dark cinematic page.
test('every shipped routing diagram is a legible, opaque, correctly marked layout', async () => {
  const courseIds = [...coursesSource.matchAll(/    id: '([^']+)'/g)].map(match => match[1])
  let shipped = 0
  for (const id of courseIds) {
    const media = getGolfMediaForCourse(id)
    if (!media.map) continue
    shipped += 1
    const svg = await readFile(new URL(`../public/golf-media/${id}-routing.svg`, import.meta.url), 'utf8')
    const circles = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)].map(m => ({ x: +m[1], y: +m[2], r: +m[3] }))
    const holes = media.map.holes
    assert.equal(circles.length, holes.length, `${id}: one marker per mapped hole`)
    assert.equal(new Set(circles.map(c => `${c.x},${c.y}`)).size, circles.length, `${id}: markers must not be stacked`)
    const radius = circles[0].r
    let closest = Infinity
    for (let i = 0; i < circles.length; i += 1) {
      for (let j = i + 1; j < circles.length; j += 1) {
        closest = Math.min(closest, Math.hypot(circles[i].x - circles[j].x, circles[i].y - circles[j].y))
      }
    }
    // Below twice the radius the discs overlap; the guard uses a visible gap.
    assert.ok(closest >= radius * 1.9, `${id}: markers ${closest.toFixed(1)}px apart would fuse (radius ${radius})`)
    assert.ok(radius >= 15, `${id}: marker radius ${radius} is too small to read when the diagram is scaled down`)
    assert.match(svg, /<rect width="100%" height="100%" fill="#edf0e6"\/>/, `${id}: needs the opaque background rect`)
    const stroke = Number(svg.match(/stroke-width="([\d.]+)" stroke-opacity/)[1])
    assert.ok(stroke >= 3, `${id}: route stroke ${stroke} vanishes on a narrow viewport`)
    // Dust: no drawn polygon may be a few-pixel speck.
    const polygons = [...svg.matchAll(/<polygon points="([^"]+)"/g)].map(m => m[1])
    assert.ok(polygons.length >= 10, `${id}: expected mapped surfaces to be drawn`)
    assert.match(svg, /OpenStreetMap contributors/, `${id}: attribution belongs in the diagram itself`)
  }
  assert.equal(shipped, 3, 'the verified-diagram inventory changed; update this guard deliberately')
})

test('small print in the course-media section stays legible and its targets stay tappable', async () => {
  const css = await readFile(new URL('../src/components/GolfCourseMedia.module.css', import.meta.url), 'utf8')
  const declarations = selector => {
    const block = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`, 'm'))
    return block ? block[1] : ''
  }
  const px = (selector, prop) => Number((declarations(selector).match(new RegExp(`${prop}:\\s*([\\d.]+)px`)) ?? [])[1])
  // Independent review measured the credit and map caption at ~8px tall on a 390px
  // capture: too small for provenance text a reader is expected to be able to check.
  for (const selector of ['.credit', '.note', '.map figcaption']) {
    const size = px(selector, 'font-size')
    assert.ok(size >= 13, `${selector}: font-size ${size}px is below the 13px legibility floor`)
  }
  for (const selector of ['.credit a', '.map figcaption a']) {
    const height = px(selector, 'min-height')
    assert.ok(height >= 24, `${selector}: touch target ${height}px is under 24px`)
  }
})

test('every shipped raster asset really is the format its filename claims', async () => {
  // A normaliser that failed silently shipped JPEG bytes under .webp names, which
  // serves the wrong content type on every guide. Bytes, not filenames, decide.
  const signatures = { webp: [[0, 'RIFF'], [8, 'WEBP']], png: [[0, '\x89PNG']], jpg: [[0, '\xff\xd8\xff']], jpeg: [[0, '\xff\xd8\xff']] }
  const courseIds = [...coursesSource.matchAll(/    id: '([^']+)'/g)].map(match => match[1])
  let checked = 0
  for (const id of courseIds) {
    const media = getGolfMediaForCourse(id)
    for (const photo of media.photos) {
      const extension = photo.src.split('.').pop().toLowerCase().replace('jpg', 'jpg')
      const bytes = await readFile(new URL(`../public${photo.src}`, import.meta.url))
      const expected = signatures[extension === 'jpg' ? 'jpg' : extension]
      assert.ok(expected, `${photo.src}: unrecognised extension`)
      for (const [offset, text] of expected) {
        const want = [...text].map(char => char.charCodeAt(0) & 0xff)
        const got = [...bytes.slice(offset, offset + want.length)]
        assert.deepEqual(got, want, `${photo.src}: bytes are not ${extension}`)
      }
      checked += 1
    }
    if (media.map) {
      const bytes = await readFile(new URL(`../public${media.map.src}`, import.meta.url), 'utf8')
      assert.match(bytes.slice(0, 200), /<svg/, `${media.map.src}: not actually an SVG`)
      checked += 1
    }
  }
  assert.equal(checked, 46, 'shipped asset inventory changed; update this guard deliberately')
})
