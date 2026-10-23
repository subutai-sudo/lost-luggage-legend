import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { test, expect } from './browser-fixture.mjs'

// Static audit scope: the catalog cannot silently shrink the regression suite.
const AUDITED_IDS = [
  'bogota',
  'bordeaux',
  'brussels',
  'cancun',
  'casablanca',
  'denver',
  'dublin',
  'edinburgh',
  'geneva',
  'guangzhou',
  'helsinki',
  'iceland',
  'johannesburg',
  'krakow',
  'maasai-mara',
  'macau',
  'madrid',
  'maldives',
  'miami',
  'milan',
  'nashville',
  'new-orleans',
  'orlando',
  'patagonia',
  'pattaya',
  'phoenix',
  'phuket',
  'queenstown',
  'reykjavik',
  'san-diego',
  'sao-paulo',
  'seoul',
  'seville',
  'shanghai',
  'shenzhen',
  'st-petersburg',
  'tampa',
  'washington-dc',
]
const BASELINE = 'c1858b91776e83d4438d9df6d73a541b0d305dfa'

async function readCatalog() {
  const source = ts.createSourceFile('destinationGuides.ts', await readFile(new URL('../src/data/destinationGuides.ts', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
  expect(source.parseDiagnostics).toHaveLength(0)
  const declarations = source.statements.filter(ts.isVariableStatement)
    .flatMap(statement => [...statement.declarationList.declarations])
    .filter(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === 'DESTINATION_GUIDES')
  expect(declarations).toHaveLength(1)
  const array = declarations[0].initializer
  expect(array && ts.isArrayLiteralExpression(array)).toBeTruthy()
  return array.elements.map(element => {
    expect(ts.isObjectLiteralExpression(element)).toBeTruthy()
    // Do not evaluate the module or interpret unrelated literal/call properties.
    return Object.fromEntries(['id', 'slug', 'title', 'heroImage'].map(key => {
      const properties = element.properties.filter(property => ts.isPropertyAssignment(property) && property.name.text === key)
      expect(properties).toHaveLength(1)
      expect(ts.isStringLiteral(properties[0].initializer)).toBeTruthy()
      return [key, properties[0].initializer.text]
    }))
  })
}

const guides = await readCatalog()
let approved

function photoIdentity(value) {
  const url = new URL(value)
  expect(url.protocol).toBe('https:')
  expect(url.hostname).toBe('images.unsplash.com')
  expect(url.pathname).toMatch(/^\/photo-\d+-[a-zA-Z0-9]+$/)
  return url.pathname.slice(1)
}

function optimizerSource(value, baseURL) {
  const url = new URL(value, baseURL)
  expect(url.origin).toBe(new URL(baseURL).origin)
  expect(url.pathname).toBe('/_next/image')
  expect(url.searchParams.get('w')).toMatch(/^\d+$/)
  expect(url.searchParams.get('q')).toMatch(/^\d+$/)
  const source = url.searchParams.get('url')
  expect(source, 'optimizer must reference a real Unsplash photo').toBeTruthy()
  photoIdentity(source)
  return source
}

// Independent expected photo identities come from the approved review manifest,
// never from whatever photo the current catalog happens to supply. The unit
// suite separately pins previous assets/categories and provenance requirements.
test.beforeAll(async () => {
  const manifest = JSON.parse(await readFile(new URL('../src/data/destinationPhotoEvidence.json', import.meta.url), 'utf8'))
  expect(manifest.schemaVersion).toBe(1)
  expect(manifest.baselineCommit).toBe(BASELINE)
  expect(manifest.records).toHaveLength(38)
  approved = new Map(manifest.records.map(record => [record.id, record]))
  expect(approved.size).toBe(38)
  expect([...approved.keys()].sort()).toEqual([...AUDITED_IDS].sort())
  expect(guides).toHaveLength(100)
  expect(new Set(guides.map(guide => guide.id)).size).toBe(100)
  for (const id of AUDITED_IDS) {
    const guide = guides.find(guide => guide.id === id)
    expect(guide, `${id}: source destination exists`).toBeTruthy()
    photoIdentity(approved.get(id).imageUrl)
    expect(guide.heroImage, `${id}: source must agree with approved manifest`).toBe(approved.get(id).imageUrl)
  }
})

async function expectDecodedHero(page, record) {
  const hero = page.locator('header[data-guide-hero] img[data-guide-hero-image]')
  await expect(hero).toHaveCount(1)
  await expect(hero).toBeVisible()
  const src = await hero.getAttribute('src')
  expect(optimizerSource(src, page.url())).toBe(record.imageUrl)
  // No photo stubs or request interception: the shared fixture blocks marketing
  // only. decode() exercises actual optimized image bytes in each browser engine.
  await hero.evaluate(image => image.decode())
  const image = await hero.evaluate(image => ({
    currentSrc: image.currentSrc,
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  }))
  expect(image.complete).toBe(true)
  expect(image.naturalWidth).toBeGreaterThan(0)
  expect(image.naturalHeight).toBeGreaterThan(0)
  const selectedSource = optimizerSource(image.currentSrc, page.url())
  expect(selectedSource).toBe(record.imageUrl)
  expect(photoIdentity(selectedSource)).toBe(photoIdentity(record.imageUrl))
  return hero
}

for (const id of AUDITED_IDS) {
  // The configured Chromium/WebKit projects each run every destination as its
  // own bounded case, preserving the identity of any failed upstream image.
  test(`${id}: approved detail hero bytes and Open Graph photo`, async ({ page }) => {
    const guide = guides.find(guide => guide.id === id)
    const record = approved.get(id)
    const response = await page.goto(`/guides/${guide.slug}`)
    expect(response.status()).toBe(200)
    await expect(page.locator('header h1')).toContainText(guide.title)
    await expectDecodedHero(page, record)
    const ogImages = page.locator('meta[property="og:image"]')
    await expect(ogImages).toHaveCount(1)
    await expect(ogImages).toHaveAttribute('content', record.imageUrl)
    expect(photoIdentity(await ogImages.getAttribute('content'))).toBe(photoIdentity(record.imageUrl))
  })
}

test('directory retains all 100 source IDs and all 38 approved photo/link mappings', async ({ page }) => {
  const response = await page.goto('/guides')
  expect(response.status()).toBe(200)
  const cards = page.locator('[data-guide-directory] [data-guide-card]')
  await expect(cards).toHaveCount(100)
  const actual = await cards.evaluateAll(elements => elements.map(card => ({
    id: card.dataset.guideCard,
    href: card.getAttribute('href'),
    images: [...card.querySelectorAll('img')].map(image => ({ src: image.getAttribute('src'), srcset: image.getAttribute('srcset') })),
  })))
  const sourceOrder = [...guides].sort((a, b) => a.title.localeCompare(b.title))
  expect(actual.map(({ id, href }) => ({ id, href }))).toEqual(sourceOrder.map(guide => ({ id: guide.id, href: `/guides/${guide.slug}` })))
  expect(new Set(actual.map(card => card.id)).size).toBe(100)
  for (const id of AUDITED_IDS) {
    const card = actual.find(card => card.id === id)
    const guide = guides.find(guide => guide.id === id)
    const record = approved.get(id)
    expect(card.href, id).toBe(`/guides/${guide.slug}`)
    expect(card.images, `${id}: one destination thumbnail`).toHaveLength(1)
    const image = card.images[0]
    const source = optimizerSource(image.src, page.url())
    expect(source, id).toBe(record.imageUrl)
    expect(photoIdentity(source), id).toBe(photoIdentity(record.imageUrl))
    expect(image.srcset, `${id}: responsive photo sources`).toBeTruthy()
    for (const candidate of image.srcset.split(',')) {
      expect(optimizerSource(candidate.trim().split(/\s+/)[0], page.url()), id).toBe(record.imageUrl)
    }
  }
  // Directory identity/link coverage is intentionally one bounded case; actual
  // byte decoding is isolated in the 38 detail cases, not 38 lazy thumbnails.
})

test('320px: Queenstown replacement hero and heading fit without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  const guide = guides.find(guide => guide.id === 'queenstown')
  await page.goto(`/guides/${guide.slug}`)
  const image = await expectDecodedHero(page, approved.get('queenstown'))
  const heading = page.locator('header[data-guide-hero] h1')
  await expect(heading).toBeVisible()
  const geometry = await heading.evaluate(heading => {
    const hero = heading.closest('header[data-guide-hero]')
    return {
      heading: heading.getBoundingClientRect().toJSON(),
      hero: hero.getBoundingClientRect().toJSON(),
      clipped: heading.scrollWidth > heading.clientWidth + 1,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
    }
  })
  const imageBounds = await image.boundingBox()
  expect(imageBounds).not.toBeNull()
  expect(imageBounds.x).toBeGreaterThanOrEqual(-1)
  expect(imageBounds.x + imageBounds.width).toBeLessThanOrEqual(321)
  expect(imageBounds.width).toBeGreaterThan(0)
  expect(imageBounds.height).toBeGreaterThan(0)
  expect(geometry.heading.left).toBeGreaterThanOrEqual(0)
  expect(geometry.heading.right).toBeLessThanOrEqual(321)
  expect(geometry.heading.top).toBeGreaterThanOrEqual(geometry.hero.top)
  expect(geometry.heading.bottom).toBeLessThanOrEqual(geometry.hero.bottom + 1)
  expect(geometry.clipped).toBe(false)
  expect(geometry.viewportWidth).toBe(320)
  expect(geometry.documentWidth).toBeLessThanOrEqual(321)
})
