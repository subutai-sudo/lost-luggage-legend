import { readFile } from 'node:fs/promises'
import { test, expect } from './browser-fixture.mjs'

// Frozen from real baseline page responses, not the mutable catalog. The unit
// suite pins the entire source/config so this Next default ladder cannot drift.
const frozen = JSON.parse(await readFile(new URL('./fixtures/guide-performance-baseline.json', import.meta.url), 'utf8'))
const widths = [32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
const nearest = pixels => widths.find(width => width >= Math.ceil(pixels - 1e-6))
function optimizer(src, base) {
  const url = new URL(src, base)
  expect(url.origin).toBe(new URL(base).origin)
  expect(url.pathname).toBe('/_next/image')
  expect(url.searchParams.get('q')).toBe('75')
  return { source: url.searchParams.get('url'), width: Number(url.searchParams.get('w')) }
}

// Every case gets a fresh Playwright context: shrinking an existing page can
// retain its larger cached currentSrc and conceal either regression or fix.
// Explicit DPR 1 and 3 in BOTH engines, with one bounded case per guide/width.
for (const dpr of [1, 3]) {
  test.describe(`guide rendition DPR ${dpr}`, () => {
    test.use({ deviceScaleFactor: dpr })
    for (const width of [320, 390, 639, 640, 959, 960, 1280, 1343, 1344, 1920]) {
      for (const slug of ['queenstown', 'lisbon']) {
        test(`${slug}: related images at ${width}px`, async ({ page }, testInfo) => {
          await page.setViewportSize({ width, height: 900 })
          await page.emulateMedia({ reducedMotion: 'reduce' })
          expect((await page.goto(`/guides/${slug}`)).status()).toBe(200)
          const hero = page.locator('[data-guide-hero-image]')
          await hero.evaluate(image => image.decode())
          const heroBefore = await hero.evaluate(image => ({
            src: image.currentSrc, sizes: image.sizes, loading: image.loading,
            fetchPriority: image.fetchPriority, width: image.getBoundingClientRect().width,
            preload: [...document.querySelectorAll('link[rel="preload"][as="image"]')].some(link => link.imageSrcset === image.srcset),
          }))
          expect(heroBefore.sizes).toBe('100vw')
          expect(heroBefore.loading).not.toBe('lazy')
          expect(heroBefore.preload).toBe(true)
          // The untouched hero's 100vw srcset starts at Next deviceSizes=640
          // and saturates at 3840; it does not use the related-image ladder.
          const heroWidth = widths.filter(value => value >= 640).find(value => value >= width * dpr) ?? 3840
          expect(optimizer(heroBefore.src, page.url())).toEqual({ source: frozen.identities[slug].hero, width: heroWidth })
          const images = page.locator('[data-guide-related] img')
          await expect(images).toHaveCount(3)
          for (const image of await images.all()) {
            await expect(image).toHaveAttribute('loading', 'lazy')
            await image.scrollIntoViewIfNeeded()
            await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0 && Boolean(element.currentSrc)),
              { message: 'native lazy source selection and real response completed' }).toBe(true)
            await image.evaluate(element => element.decode())
          }
          const measured = await images.evaluateAll(images => images.map(image => ({
            source: image.currentSrc, alt: image.alt,
            href: image.closest('a').getAttribute('href'),
            width: image.getBoundingClientRect().width,
            parentWidth: image.parentElement.getBoundingClientRect().width,
            complete: image.complete, naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight, dpr: devicePixelRatio,
          })))
          await testInfo.attach('related-image-geometry', { body: JSON.stringify({ heroBefore, measured }, null, 2), contentType: 'application/json' })
          for (const [index, image] of measured.entries()) {
            expect(image.complete).toBe(true)
            expect(image.naturalWidth).toBeGreaterThan(0)
            expect(image.naturalHeight).toBeGreaterThan(0)
            expect(image.dpr).toBe(dpr)
            // Reduced motion keeps geometry untransformed, but rendition budget
            // must still cover the preserved normal-motion 1.035 hover.
            expect(image.width).toBeCloseTo(image.parentWidth, 1)
            expect({ href: image.href, alt: image.alt, source: optimizer(image.source, page.url()).source }).toEqual(frozen.identities[slug].related[index])
            expect(optimizer(image.source, page.url()).width,
              `wrapper ${image.parentWidth}px × hover 1.035 × DPR ${image.dpr}: smallest supported rendition`).toBe(nearest(image.parentWidth * 1.035 * image.dpr))
          }
          expect(await hero.evaluate(image => image.currentSrc)).toBe(heroBefore.src)
        })
      }
    }
  })
}

test.describe('normal-motion related hover', () => {
  test.use({ isMobile: false, hasTouch: false, deviceScaleFactor: 1 })
  test('preserves the existing 1.035 bitmap transform and pixel headroom', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1920, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/guides/lisbon')
    const image = page.locator('[data-guide-related] img').first()
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true)
    await image.evaluate(i => i.decode())
    const before = await image.evaluate(i => ({ width: i.getBoundingClientRect().width, wrapper: i.parentElement.getBoundingClientRect().width, src: i.currentSrc }))
    await page.locator('[data-guide-related] a:has(img)').first().hover()
    await expect.poll(() => image.evaluate(i => i.getBoundingClientRect().width / i.parentElement.getBoundingClientRect().width)).toBeCloseTo(1.035, 4)
    const after = await image.evaluate(i => ({ width: i.getBoundingClientRect().width, wrapper: i.parentElement.getBoundingClientRect().width, transform: getComputedStyle(i).transform, src: i.currentSrc }))
    expect(before.width).toBeCloseTo(before.wrapper, 2)
    expect(after.wrapper).toBe(before.wrapper)
    expect(after.src).toBe(before.src)
    expect(optimizer(after.src, page.url()).width).toBeGreaterThanOrEqual(Math.ceil(after.width))
    await testInfo.attach('normal-motion-hover', { body: JSON.stringify({ before, after }, null, 2), contentType: 'application/json' })
    await testInfo.attach('normal-motion-hover-screenshot', { body: await page.locator('[data-guide-related]').screenshot(), contentType: 'image/png' })
  })
})
