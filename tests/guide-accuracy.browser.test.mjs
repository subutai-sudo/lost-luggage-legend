import { test, expect } from './browser-fixture.mjs'

// Independently pinned to the free photo page/provenance in GUIDE-ACCURACY.md,
// not derived from the current catalog (which could otherwise validate itself).
const antalyaPhoto = 'photo-1648325129746-abcc1b872380'

for (const width of [320, 1280]) {
  test(`${width}px: Antalya's destination photo decodes in directory and article`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/guides')
    const thumbnail = page.locator('[data-guide-card="antalya"] img')
    await thumbnail.scrollIntoViewIfNeeded()
    await expect(thumbnail).toHaveAttribute('src', new RegExp(antalyaPhoto))
    await thumbnail.evaluate(img => img.decode())
    expect(await thumbnail.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)

    await page.goto('/guides/antalya')
    const hero = page.locator('header [data-guide-hero-image]')
    await expect(hero).toHaveAttribute('src', new RegExp(antalyaPhoto))
    await expect(hero).not.toHaveAttribute('src', /photo-1593352216840-1aee13f45818/)
    await hero.evaluate(img => img.decode())
    expect(await hero.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)
    const bounds = await page.locator('header h1').boundingBox()
    expect(bounds.x).toBeGreaterThanOrEqual(0)
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
  })
}

for (const slug of ['london', 'antalya']) {
  test(`${slug}: corrected instructions point to the actual downstream tools`, async ({ page }) => {
    await page.goto(`/guides/${slug}`)
    const article = page.locator('article[aria-label$="travel guide"]')
    await expect(article).toContainText('flight-time tools and booking links below')
    await expect(article).toContainText('current prices on supplier sites')
    await expect(article).not.toContainText(/(?:tools?|search)\s+(?:above|at the top)/i)
    const order = await article.evaluate(article => {
      const flight = document.querySelector('section[aria-labelledby="guide-flight-heading"]')
      const booking = document.querySelector('#book')
      return {
        flightAfterArticle: Boolean(flight && (article.compareDocumentPosition(flight) & Node.DOCUMENT_POSITION_FOLLOWING)),
        bookingAfterFlight: Boolean(flight && booking && (flight.compareDocumentPosition(booking) & Node.DOCUMENT_POSITION_FOLLOWING)),
      }
    })
    expect(order).toEqual({ flightAfterArticle: true, bookingAfterFlight: true })
    const flightLink = page.getByRole('link', { name: /Compare Flights/ })
    await expect(flightLink).toHaveAttribute('href', '/plan#compare-prices')
    await flightLink.click()
    await expect(page.locator('#compare-prices')).toBeInViewport()
  })
}
