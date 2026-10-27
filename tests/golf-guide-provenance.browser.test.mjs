import { test, expect } from './browser-fixture.mjs'

for (const width of [320, 390, 768, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`course-guide photo and no-photo provenance remains readable at ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(theme => localStorage.setItem('lll-theme', theme), theme)
      for (const course of [
        { id: 'keilir-golf-club', photo: true },
        { id: 'royal-cape-golf-club', photo: false },
      ]) {
        await page.goto(`/golf/${course.id}`)
        await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
        const hero = page.locator('[data-golf-guide-hero]')
        const disclosure = hero.locator('p').filter({ hasText: /^Course photograph/ })
        await expect(disclosure).toHaveCount(1)
        await expect(disclosure).toContainText(course.photo ? 'Course photograph:' : 'Course photograph not available')
        await expect(hero.locator('[data-golf-guide-image]')).toHaveCount(course.photo ? 1 : 0)
        const metrics = await disclosure.evaluate(el => {
          const r = el.getBoundingClientRect()
          const s = getComputedStyle(el)
          return { size: parseFloat(s.fontSize), x: r.x, right: r.right,
            clipped: el.scrollHeight > el.clientHeight + 1,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }
        })
        expect(metrics.size).toBeGreaterThanOrEqual(13)
        expect(metrics.x).toBeGreaterThanOrEqual(0)
        expect(metrics.right).toBeLessThanOrEqual(width + 1)
        expect(metrics.clipped).toBe(false)
        expect(metrics.overflow).toBeLessThanOrEqual(1)
        const action = hero.getByRole('link', { name: 'Read the course guide' })
        expect((await action.boundingBox()).height).toBeGreaterThanOrEqual(44)
      }
    })
  }
}
