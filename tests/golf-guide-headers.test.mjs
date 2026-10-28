import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import sharp from 'sharp'
import { page, guides, nodes, text, render, metadata } from './helpers/golf-guide-render.mjs'
const read = path => readFile(new URL(`../${path}`, import.meta.url))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
import { baseline, headers, hashOverrides, approvedHeaderIds, articleHashOverrides } from './helpers/golf-guide-approved-headers.mjs'
const neutral = { url: '/brand/golf-guide-social.png', width: 1200, height: 630, alt: 'Golf course guides · Goldilocks Zone' }

test('header inventory is complete and actual static route projection stays unchanged', () => {
  assert.equal(headers.length, 37)
  assert.deepEqual(page.generateStaticParams(), headers.map(g => ({slug:g.id})))
  assert.deepEqual(guides.map(g=>g.course.id), headers.map(g=>g.id))
  assert.equal(headers.filter(g=>g.photo).length, 22)
})
test('only the four explicitly approved photo/article expectations advance; all names, character and non-image metadata stay frozen', () => {
  assert.equal(baseline.records.length, 37)
  assert.equal(baseline.records.filter(record => record.photo).length, 18)
  assert.deepEqual(headers.map(record => record.id), baseline.records.map(record => record.id))
  assert.deepEqual(headers.filter((record, index) => record !== baseline.records[index]).map(record => record.id).sort(), [...approvedHeaderIds].sort())
  for (const [index, record] of headers.entries()) {
    const original = baseline.records[index]
    assert.deepEqual({ ...record, photo: original.photo, articleHash: original.articleHash }, original)
    if (!approvedHeaderIds.includes(record.id)) assert.deepEqual(record, original)
  }
  assert.ok(headers.find(record => record.id === 'oitavos-dunes').photo)
  assert.equal(headers.find(record => record.id === 'royal-cape-golf-club').photo, null)
})
for (const expected of headers) {
  test(`${expected.id}: exact course hero or truthful no-photo state`, async () => {
    const all = nodes(await render(expected.id))
    const hero = all.find(n=>Object.hasOwn(n.props ?? {}, 'data-golf-guide-hero'))
    assert.ok(hero, 'real header must render')
    const children = nodes(hero)
    assert.equal(text(children.find(n=>n.type==='h1')), expected.name)
    const images = children.filter(n=>n.type==='Image')
    if (expected.photo) {
      assert.equal(images.length, 1, 'an available approved photo must not be blanked')
      assert.equal(images[0].props.src, expected.photo.src)
      assert.equal(images[0].props.alt, expected.photo.alt)
      assert.match(text(hero), /Course photograph:/)
    } else {
      assert.equal(images.length, 0, 'no destination, stock, map or brand image in the course header')
      assert.match(text(hero), /Course photograph not available/)
    }
    assert.doesNotMatch(text(hero), /Destination photograph/i)
    assert.equal(text(children.find(n=>n.props?.['data-golf-guide-character'] !== undefined)), expected.character)
  })
  test(`${expected.id}: social images and all other metadata retain exact identity`, async () => {
    const result = await metadata(expected.id)
    const image = expected.photo ? {url:expected.photo.src,width:expected.photo.width,height:expected.photo.height,alt:expected.photo.alt} : neutral
    assert.deepEqual(result.openGraph.images, [image])
    assert.deepEqual(result.twitter.images, [image.url])
    const omitImages = m => ({...m, openGraph:{...m.openGraph,images:[]},twitter:{...m.twitter,images:[]}})
    assert.deepEqual(omitImages(result), omitImages(expected.metadata), 'canonical/title/description/article type and exact URLs unchanged')
  })
  test(`${expected.id}: entire rendered article including notes, sources and access is unchanged`, async () => {
    const main = nodes(await render(expected.id)).find(n=>n.props?.id==='golf-guide-main')
    assert.ok(main)
    assert.equal(hash(JSON.stringify(main)), articleHashOverrides[expected.id] ?? expected.articleHash)
    assert.notEqual(hash(JSON.stringify(main)+'unapproved'), articleHashOverrides[expected.id] ?? expected.articleHash)
  })
}
test('article template, sourced copy, notices and all 40 previously accepted assets stay byte-exact except the named media extension', async () => {
  const source = (await read('src/app/golf/[slug]/page.tsx')).toString()
  assert.equal(hash(source.slice(source.indexOf('      <div id="golf-guide-main"'))), baseline.articleSourceHash)
  assert.equal(Object.keys(baseline.hashes).filter(p=>p.startsWith('public/golf-media/')).length, 40)
  for (const [path, expected] of Object.entries(baseline.hashes)) {
    const bytes = await read(path)
    const approved = hashOverrides[path] ?? expected
    assert.equal(hash(bytes), approved, path)
    assert.notEqual(hash(Buffer.concat([bytes, Buffer.from('unapproved')])), approved, `${path}: reject appended bytes`)
  }
})
test('neutral social asset is a real 1200x630 PNG; disguised images fail the byte guard', async () => {
  const check = bytes => assert.deepEqual([...bytes.subarray(0,8)], [137,80,78,71,13,10,26,10])
  const bytes = await read('public/brand/golf-guide-social.png')
  check(bytes)
  assert.throws(()=>check(Buffer.from('<svg>not a PNG</svg>')))
  const info = await sharp(bytes).metadata()
  assert.equal(info.format, 'png'); assert.equal(info.width,1200); assert.equal(info.height,630)
})
