import { test, expect } from './browser-fixture.mjs'

for (const width of [320, 390, 768, 1440]) {
  test(`hero photograph is separate from the calendar at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/?month=10')
    await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
    const hero = page.locator('[data-hero-scene]')
    const band = page.locator('[data-calendar-band]')
    await expect(hero).toBeVisible()
    await expect(band).toBeVisible()
    const layout = await page.evaluate(() => {
      const hero = document.querySelector('[data-hero-scene]')
      const band = document.querySelector('[data-calendar-band]')
      const image = document.querySelector('[data-hero-image]')
      const jump = document.querySelector('a[href="#month-picker"]:not([class*="skip"])')
      const caption = document.querySelector('[data-feature-link]').parentElement
      return { hero: hero.getBoundingClientRect().toJSON(), band: band.getBoundingClientRect().toJSON(), image: image.getBoundingClientRect().toJSON(), jump: jump.getBoundingClientRect().toJSON(), caption: caption.getBoundingClientRect().toJSON(), nested: hero.contains(band), overflow: document.documentElement.scrollWidth, viewport: innerWidth }
    })
    expect(layout.nested, 'calendar must not be inside the photo frame').toBe(false)
    expect(layout.band.top, 'calendar must start below the complete splash image').toBeGreaterThanOrEqual(layout.hero.bottom - 1)
    expect(layout.hero.height, 'give the main photograph its own substantial frame').toBeGreaterThanOrEqual(480)
    expect(layout.image.width).toBeGreaterThanOrEqual(layout.hero.width)
    expect(layout.image.height).toBeGreaterThanOrEqual(layout.hero.height)
    expect(layout.caption.top).toBeGreaterThanOrEqual(layout.hero.top)
    expect(layout.caption.bottom).toBeLessThanOrEqual(layout.hero.bottom)
    expect(layout.jump.bottom).toBeLessThanOrEqual(layout.hero.bottom)
    const overlaps = layout.jump.left < layout.caption.right && layout.jump.right > layout.caption.left && layout.jump.top < layout.caption.bottom && layout.jump.bottom > layout.caption.top
    expect(overlaps, 'month jump and destination caption must not cover each other').toBe(false)
    expect(layout.overflow).toBeLessThanOrEqual(layout.viewport + 1)
    await page.locator('[data-hero-image]').evaluate(img => img.decode())
    await expect(page.locator('button[data-month]')).toHaveCount(12)
    await page.getByRole('link', { name: 'Choose your month', exact: true }).click()
    await expect(page.locator('#month-picker')).toBeInViewport()
    await page.locator('button[data-month="1"]').click()
    await expect(page.locator('[data-selected-month]')).toHaveText('January')
    await expect(page.locator('[data-feature-title]')).toHaveText('Maldives')
    await expect(page.locator('[data-results] article')).toHaveCount(6)
  })
}
