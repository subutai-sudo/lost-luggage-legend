import { test, expect } from './browser-fixture.mjs'

// Runs in the configured Desktop Chrome and genuine iPhone 13 WebKit contexts.
// The old WebKit aspect-ratio/min-height automatic minimum gives every figure
// a 386.66px width, even when its parent card is only 251.84px wide.
async function assertFits(page) {
  const geometry = await page.evaluate(() => {
    const width = document.documentElement.clientWidth
    const cards = [...document.querySelectorAll('[data-golf-card]')].map(card => {
      const figure = card.querySelector(':scope > a')
      const rect = figure.getBoundingClientRect()
      const parent = card.getBoundingClientRect()
      const copy = [...figure.querySelectorAll('[data-golf-figure-title], [data-golf-figure-phrase], [data-golf-photo-kind]')].map(element => {
        const range = document.createRange()
        range.selectNodeContents(element)
        return { text: element.textContent, rects: [...range.getClientRects()].map(r => r.toJSON()) }
      })
      return { rect: rect.toJSON(), parent: parent.toJSON(), copy }
    })
    return { width, scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), cards }
  })
  expect(geometry.scroll, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.width + 1)
  expect(geometry.cards).toHaveLength(6)
  for (const { rect, parent, copy } of geometry.cards) {
    expect(rect.left).toBeGreaterThanOrEqual(parent.left - 1)
    expect(rect.right).toBeLessThanOrEqual(parent.right + 1)
    for (const line of copy) {
      expect(line.text.trim()).not.toBe('')
      expect(line.rects.length).toBeGreaterThan(0)
      for (const text of line.rects) {
        expect(text.left).toBeGreaterThanOrEqual(rect.left - 1)
        expect(text.right).toBeLessThanOrEqual(rect.right + 1)
        expect(text.top).toBeGreaterThanOrEqual(rect.top - 1)
        expect(text.bottom).toBeLessThanOrEqual(rect.bottom + 1)
      }
    }
  }
}

for (const width of [320, 390]) {
  for (const theme of ['light', 'dark']) {
    test(`${width}px ${theme}: golf figures and complete document fit without clipping copy`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
      await page.goto('/golf?month=11', { waitUntil: 'domcontentloaded' })
      await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
      await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
      await page.evaluate(() => document.fonts.ready)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Steenberg Golf Club')
      await assertFits(page)
      const credits = page.locator('[data-golf-preview-credits] > summary')
      await credits.click()
      await expect(page.locator('[data-golf-preview-credits]')).toHaveAttribute('open', '')
      await assertFits(page)
      await credits.click()
      const minimums = await page.evaluate(() => ({
        buttons: [...document.querySelectorAll('button[data-golf-month]')].map(e => e.getBoundingClientRect().height),
        credits: [...document.querySelectorAll('[data-golf-hero-credit], [data-golf-photo-credit], [data-golf-preview-credits]')].map(e => parseFloat(getComputedStyle(e).fontSize)),
      }))
      expect(minimums.buttons).toHaveLength(12)
      for (const height of minimums.buttons) expect(height).toBeGreaterThanOrEqual(44)
      for (const size of minimums.credits) expect(size).toBeGreaterThanOrEqual(13)
      await page.getByRole('button', { name: 'January', exact: true }).click()
      await expect(page.getByRole('button', { name: 'January', exact: true })).toHaveAttribute('aria-pressed', 'true')
      await assertFits(page)
    })
  }
}
