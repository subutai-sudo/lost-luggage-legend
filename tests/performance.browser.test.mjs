import { test, expect } from './browser-fixture.mjs'

// Fixture blocks marketing hosts only: real optimizer bytes, no image mocks.
// Sizing oracle: the browser may only select the smallest Next-supported width
// that still covers the pixels the tile actually paints at the current DPR.
// Frozen from Next's default image config (next.config.js is hash-pinned in the
// unit suite; only this one size ladder remains enabled).
const SUPPORTED_WIDTHS = [32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
const nearestSupported = pixels => SUPPORTED_WIDTHS.find(width => width >= pixels)
const neededWidth = (paintedWidth, dpr) => Math.ceil(paintedWidth * dpr - 1e-6)
const round = value => Math.round(value * 100) / 100

// Frozen baseline identities for the twelve monthly-lead photographs (month 1..12),
// read from the public page before the performance work, not from the approved
// photo-audit manifest and not from whatever the live catalog supplies today.
const LEAD_PHOTOS = [
  'photo-1514282401047-d79a71a590e8',
  'photo-1580060839134-75a5edca2e99',
  'photo-1493976040374-85c8e12f0c0e',
  'photo-1597212618440-806262de4f6b',
  'photo-1612698093158-e07ac200d44e',
  'photo-1570077188670-e3a8d69ac5ff',
  'photo-1537996194471-e657df975ab4',
  'photo-1521766794531-959971b1f444',
  'photo-1532586733327-54ac07aa1154',
  'photo-1754151630904-da4334bddfbf',
  'photo-1585464231875-d9ef1f5ad396',
  'photo-1506973035872-a4ec16b8e8d9',
]
const TILE_QUERY = '?w=480&q=80&auto=format&fit=crop'
const HERO_QUERY = '?w=1600&q=80&auto=format&fit=crop'
const HERO_MONTH = 10

function optimizerParams(value, baseURL) {
  const url = new URL(value, baseURL)
  expect(url.origin, 'optimizer stays first-party').toBe(new URL(baseURL).origin)
  expect(url.pathname).toBe('/_next/image')
  return { width: Number(url.searchParams.get('w')), quality: url.searchParams.get('q'), source: url.searchParams.get('url') }
}

async function tilePayloads(page) {
  return page.evaluate(() => {
    const tiles = [...document.querySelectorAll('button[data-month]')]
    return {
      dpr: devicePixelRatio,
      viewport: innerWidth,
      tiles: tiles.map(tile => {
        const image = tile.querySelector('img')
        const rect = tile.getBoundingClientRect()
        return {
          month: Number(tile.dataset.month),
          paintedWidth: rect.width,
          loading: image.loading,
          chosen: image.currentSrc || image.src,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        }
      }),
    }
  })
}

// One bounded case per width: 320/390 mobile, the 700/701 breakpoint boundary,
// and 1280 desktop. Both configured engines run each width at their own DPR.
for (const width of [320, 390, 700, 701, 1280]) {
  test(`month tiles request only the pixels they paint at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const response = await page.goto(`/?month=${HERO_MONTH}`)
    expect(response.status()).toBe(200)
    await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')

    const tiles = page.locator('button[data-month]')
    await expect(tiles).toHaveCount(12)

    // Native lazy loading may begin near the viewport; this asserts every tile
    // still delivers real decoded bytes once the calendar has been reached,
    // not that offscreen requests are absent.
    for (let month = 1; month <= 12; month++) {
      const image = page.locator(`button[data-month="${month}"] img`)
      await image.scrollIntoViewIfNeeded()
      await image.evaluate(element => element.decode())
    }

    const { dpr, tiles: payloads } = await tilePayloads(page)
    expect(payloads.map(tile => tile.month)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    for (const tile of payloads) {
      const label = `month ${tile.month}`
      expect(tile.complete, `${label}: real image bytes`).toBe(true)
      expect(tile.naturalWidth, `${label}: decoded`).toBeGreaterThan(0)
      expect(tile.naturalHeight, `${label}: decoded`).toBeGreaterThan(0)
      const chosen = optimizerParams(tile.chosen, page.url())
      expect(chosen.source, `${label}: frozen lead photo identity`).toBe(`https://images.unsplash.com/${LEAD_PHOTOS[tile.month - 1]}${TILE_QUERY}`)
      expect(chosen.quality, `${label}: optimizer quality unchanged`).toBe('75')
      const needed = neededWidth(tile.paintedWidth, dpr)
      expect(chosen.width, `${label}: painted ${round(tile.paintedWidth)}px at DPR ${dpr} needs ${needed}px, nearest supported is ${nearestSupported(needed)}px`).toBe(nearestSupported(needed))
    }
  })
}

test('hero photograph keeps high priority, eager bytes and its approved photo', async ({ page }) => {
  const width = 390
  await page.setViewportSize({ width, height: 900 })
  await page.goto(`/?month=${HERO_MONTH}`)
  await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
  const hero = page.locator('[data-hero-scene] img[data-hero-image]')
  await expect(hero).toHaveCount(1)
  await expect(hero).toHaveAttribute('loading', 'eager')
  await expect(hero).toHaveAttribute('fetchpriority', 'high')
  await hero.evaluate(element => element.decode())
  const measured = await hero.evaluate(element => ({
    chosen: element.currentSrc || element.src,
    complete: element.complete,
    naturalWidth: element.naturalWidth,
    dpr: devicePixelRatio,
    viewport: innerWidth,
  }))
  expect(measured.complete).toBe(true)
  expect(measured.naturalWidth).toBeGreaterThan(0)
  const chosen = optimizerParams(measured.chosen, page.url())
  expect(chosen.source).toBe(`https://images.unsplash.com/${LEAD_PHOTOS[HERO_MONTH - 1]}${HERO_QUERY}`)
  expect(chosen.quality).toBe('75')
  expect(chosen.width).toBe(nearestSupported(neededWidth(measured.viewport, measured.dpr)))
  expect(chosen.width).toBeGreaterThanOrEqual(640)
})
