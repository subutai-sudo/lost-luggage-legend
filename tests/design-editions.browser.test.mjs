import { test, expect } from './browser-fixture.mjs'
import { headers } from './helpers/golf-guide-approved-headers.mjs'

// Independently pinned public design contracts; no imports from theme/model code.
const photographed = headers.find(x => x.id === 'oitavos-dunes')
const unavailable = headers.find(x => x.id === 'steenberg-golf-club')
expect(photographed?.photo).toBeTruthy()
expect(unavailable?.photo).toBeNull()

async function open(page, route, theme) {
  await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
  await page.evaluate(() => document.fonts.ready)
}
async function bounds(page) {
  const sizes = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) }))
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width + 1)
  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toHaveCount(1)
  const box = await h1.boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(-1)
  expect(box.x + box.width).toBeLessThanOrEqual(sizes.width + 1)
}
async function motif(page, edition) {
  const root = page.locator(`[data-design-edition="${edition}"]`)
  await expect(root).toHaveCount(1)
  const marks = root.locator(edition === 'travel' ? '[data-aviation-motif]' : '[data-golf-motif]')
  expect(await marks.count()).toBeGreaterThan(0)
  const mark = marks.first()
  await expect(mark).toBeVisible()
  await expect(mark).toHaveAttribute('aria-hidden', 'true')
  await expect(mark).toHaveAttribute('focusable', 'false')
  const box = await mark.boundingBox()
  expect(box.width).toBeGreaterThanOrEqual(32)
  expect(box.height).toBeGreaterThanOrEqual(20)
  expect(await mark.locator('path, circle, ellipse, polygon, line').count()).toBeGreaterThan(0)
}
for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${width}px ${theme}: aviation home retains a separate interactive month band`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      await open(page, '/?month=1', theme)
      const root = page.locator('[data-goldilocks-home]')
      await expect(root).toHaveAttribute('data-ready', 'true')
      await motif(page, 'travel')
      await bounds(page)
      const hero = await page.locator('[data-hero-scene]').boundingBox()
      const band = await page.locator('[data-calendar-band]').boundingBox()
      expect(band.y).toBeGreaterThanOrEqual(hero.y + hero.height - 1)
      await expect(page.locator('button[data-month]')).toHaveCount(12)
      await expect(page.locator('[data-results] article[data-id]')).toHaveCount(6)
      const february = page.getByRole('button', { name: 'February', exact: true })
      await february.click()
      await expect(february).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('[data-selected-month]')).toHaveText('February')
      await expect(page.locator('[data-feature-title]')).toHaveText('Cape Town')
      await expect(page.locator('[data-feature-link]')).toHaveAttribute('href', '/guides/cape-town?month=2')
      await bounds(page)
    })
    test(`${width}px ${theme}: golf finder remains golf-specific without a substitute photo`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      await open(page, '/golf?month=11', theme)
      await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
      await motif(page, 'golf')
      await expect(page.locator('[data-aviation-motif]')).toHaveCount(0)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Steenberg Golf Club')
      await expect(page.locator('[data-golf-hero-image]')).toHaveCount(0)
      await expect(page.locator('[data-golf-hero-credit]')).toContainText('Course photo unavailable')
      await expect(page.locator('button[data-golf-month]')).toHaveCount(12)
      await expect(page.locator('[data-golf-card]')).toHaveCount(6)
      await bounds(page)
      const january = page.getByRole('button', { name: 'January', exact: true })
      await january.click()
      await expect(january).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('[data-golf-card]')).toHaveCount(6)
      await bounds(page)
    })
  }
  for (const route of ['/guides', '/guides/marrakech?month=4', '/plan?destination=maldives&month=1', '/explore']) {
    test(`390px ${theme}: ${route} shares the aviation travel edition`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 1000 })
      await open(page, route, theme)
      await motif(page, 'travel')
      await bounds(page)
      await expect(page.locator('[data-golf-motif]')).toHaveCount(0)
      if (route.startsWith('/plan')) {
        await expect(page.locator('#flight-destination')).toHaveValue(/Maldives|Male|Malé|MLE/)
        for (const id of ['flight-origin', 'flight-depart', 'flight-return']) await expect(page.locator(`#${id}`)).toHaveValue('')
      }
    })
  }
  for (const record of [photographed, unavailable]) {
    test(`390px ${theme}: golf article ${record.id} keeps exact course media and golf identity`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 1000 })
      await open(page, `/golf/${record.id}`, theme)
      await motif(page, 'golf')
      await expect(page.locator('[data-aviation-motif]')).toHaveCount(0)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(record.name)
      const photo = page.locator('[data-golf-guide-image]')
      await expect(photo).toHaveCount(record.photo ? 1 : 0)
      if (record.photo) {
        const src = await photo.getAttribute('src')
        let url = new URL(src, page.url())
        if (url.pathname === '/_next/image') url = new URL(url.searchParams.get('url'), page.url())
        expect(url.pathname).toBe(record.photo.src)
      } else await expect(page.locator('[data-golf-guide-hero]')).toContainText('Course photograph not available')
      await bounds(page)
    })
  }
}
