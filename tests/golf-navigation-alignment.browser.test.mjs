import { test, expect } from './browser-fixture.mjs'

const primaryNav = page => page.getByRole('navigation', { name: 'Primary navigation', exact: true })
const toggle = page => primaryNav(page).getByRole('button', { name: 'Toggle navigation', exact: true })

async function geometry(page) {
  await page.evaluate(() => document.fonts.ready)
  return primaryNav(page).evaluate(nav => ({
    nav: nav.getBoundingClientRect().toJSON(),
    brand: nav.querySelector('[data-brand-logo]').getBoundingClientRect().toJSON(),
    width: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    controls: [...nav.querySelectorAll('a, button')]
      .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
      .map(element => ({ name: element.getAttribute('aria-label') || element.textContent.trim(), ...element.getBoundingClientRect().toJSON() })),
  }))
}

function expectFits(value) {
  expect(Math.abs(value.nav.x), 'navigation starts at the viewport left edge').toBeLessThanOrEqual(1)
  expect(Math.abs(value.nav.y), 'navigation is flush with the viewport top').toBeLessThanOrEqual(1)
  expect(Math.abs(value.nav.width - value.width), 'navigation surface spans the viewport').toBeLessThanOrEqual(1)
  expect(value.overflow, 'navigation must not introduce horizontal overflow').toBeLessThanOrEqual(1)
  for (const control of value.controls) {
    expect(control.left, `${control.name}: visible left edge`).toBeGreaterThanOrEqual(0)
    expect(control.right, `${control.name}: visible right edge`).toBeLessThanOrEqual(value.width + 1)
    expect(control.width, `${control.name}: minimum target width`).toBeGreaterThanOrEqual(44)
    expect(control.height, `${control.name}: minimum target height`).toBeGreaterThanOrEqual(44)
  }
}

async function expectTheme(page, theme) {
  await expect(page.getByRole('button', { name: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
}

// Individual viewport/theme deadlines preserve the existing runner's 45s budget.
// The real homepage is the established alignment oracle, not GolfZone's CSS.
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  for (const theme of ['light', 'dark']) {
    test(`Golf navigation stays aligned from home at ${width}px ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
      await page.goto('/')
      await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
      await expectTheme(page, theme)
      const home = await geometry(page)
      expectFits(home)
      if (width < 768) await toggle(page).click()
      await primaryNav(page).getByRole('link', { name: 'Golf', exact: true }).click()
      await expect(page).toHaveURL(/\/golf\/?$/)
      await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
      await expectTheme(page, theme)
      const finder = await geometry(page)
      await testInfo.attach('home-and-finder-geometry', { body: JSON.stringify({ home, finder }, null, 2), contentType: 'application/json' })
      expectFits(finder)
      for (const dimension of ['x', 'y', 'width', 'height']) {
        expect(Math.abs(finder.brand[dimension] - home.brand[dimension]), `brand ${dimension} does not jump after Golf navigation`).toBeLessThanOrEqual(1)
      }
      const story = await page.locator('h1').boundingBox()
      expect(story.y, 'hero content remains below header').toBeGreaterThanOrEqual(finder.nav.bottom)
      expect(story.x, 'hero retains its editorial content gutter').toBeGreaterThanOrEqual(20)
      if (width < 768) {
        await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
        await toggle(page).click()
        expectFits(await geometry(page))
        await page.keyboard.press('Escape')
        await expect(toggle(page)).toBeFocused()
      }

      // Guides have their own editorial content gutter, but their navigation
      // must still be top-aligned, full-width and free of clipped controls.
      await page.goto('/golf/oitavos-dunes')
      await expectTheme(page, theme)
      const guide = await geometry(page)
      await testInfo.attach('guide-geometry', { body: JSON.stringify(guide, null, 2), contentType: 'application/json' })
      expectFits(guide)
      expect(Math.abs(guide.brand.y - home.brand.y), 'guide brand retains the common header baseline').toBeLessThanOrEqual(1)
      if (width < 768) {
        await toggle(page).click()
        expectFits(await geometry(page))
        await page.keyboard.press('Escape')
        await expect(toggle(page)).toBeFocused()
      }
    })
  }
}

for (const theme of ['light', 'dark']) {
  test(`Golf mobile disclosure preserves native navigation and dismissal in ${theme}`, async ({ page, browserName }) => {
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab'
    await page.setViewportSize({ width: 320, height: 900 })
    await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
    await page.goto('/golf?month=1')
    await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
    await expectTheme(page, theme)
    const button = toggle(page)
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    expectFits(await geometry(page))
    for (const name of ['Guides', 'Golf', 'Newsletter']) {
      await page.keyboard.press(tabKey)
      await expect(page.locator('#header-mobile-navigation').getByRole('link', { name, exact: true })).toBeFocused()
    }
    await page.keyboard.press('Escape')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toBeFocused()
    await page.keyboard.press('Space')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    for (let step = 0; step < 4; step++) await page.keyboard.press(tabKey)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.click()
    await page.locator('h1').click()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.click()
    await page.setViewportSize({ width: 1024, height: 900 })
    await expect(page.locator('#header-mobile-navigation')).toHaveCount(0)
    await page.setViewportSize({ width: 320, height: 900 })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.click()
    await page.locator('#header-mobile-navigation').getByRole('link', { name: 'Guides', exact: true }).click()
    await expect(page).toHaveURL(/\/guides\/?$/)
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false')
  })
}
