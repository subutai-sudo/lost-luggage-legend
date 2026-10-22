import { test, expect } from './browser-fixture.mjs'

const primaryNav = page => page.getByRole('navigation', { name: 'Primary navigation', exact: true })
const navigationToggle = page => primaryNav(page).getByRole('button', { name: 'Toggle navigation' })
const currencyToggle = page => primaryNav(page).getByRole('button', { name: /^Currency:/ })

async function expectHeaderFits(page) {
  const width = page.viewportSize().width
  const bounds = await primaryNav(page).evaluate(nav => ({
    scrollWidth: nav.scrollWidth,
    controls: [...nav.querySelectorAll('a, button')]
      .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
      .map(element => ({ name: element.textContent || element.getAttribute('aria-label'), ...element.getBoundingClientRect().toJSON() })),
  }))
  expect(bounds.scrollWidth, 'header must not cause horizontal overflow').toBeLessThanOrEqual(width + 1)
  for (const control of bounds.controls) {
    expect(control.left, `${control.name}: left edge`).toBeGreaterThanOrEqual(0)
    expect(control.right, `${control.name}: right edge`).toBeLessThanOrEqual(width + 1)
    expect(control.height, `${control.name}: touch height`).toBeGreaterThanOrEqual(44)
    expect(control.width, `${control.name}: touch width`).toBeGreaterThanOrEqual(44)
  }
}

// Keep every width and interaction, but give each theme its own test deadline.
// The old combined 22-width sweep exceeded 45s on the local WebKit runner.
for (const theme of ['light', 'dark']) {
  test(`header controls fit narrow phones, tablet breakpoints and desktop in ${theme} theme`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
    await page.goto('/guides')
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
    for (const width of [320, 360, 375, 390, 414, 640, 767, 768, 820, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      const mobile = width < 768
      await expect(navigationToggle(page)).toBeVisible({ visible: mobile })
      await expect(primaryNav(page).getByRole('link', { name: 'Subscribe', exact: true })).toBeVisible({ visible: width >= 1024 })
      await expectHeaderFits(page)
      if (mobile) {
        await navigationToggle(page).click()
        await expect(page.locator('#header-mobile-navigation')).toBeVisible()
        await expectHeaderFits(page)
        await page.keyboard.press('Escape')
      } else {
        await expect(primaryNav(page).getByRole('link', { name: 'Guides', exact: true })).toBeVisible()
        await expect(primaryNav(page).getByRole('link', { name: 'Newsletter', exact: true })).toHaveAttribute('href', '/#newsletter')
      }
    }
    await page.setViewportSize({ width: 320, height: 568 })
    await primaryNav(page).getByRole('button', { name: /Switch to .* mode/ }).click()
    await navigationToggle(page).click()
    await expectHeaderFits(page)
    await page.keyboard.press('Escape')
    await currencyToggle(page).click()
    await expect(page.locator('#header-currencies')).toBeVisible()
    await expectHeaderFits(page)
    const currencyBounds = await page.locator('#header-currencies').boundingBox()
    expect(currencyBounds.y + currencyBounds.height).toBeLessThanOrEqual(568)
  })
}

test('mobile disclosure supports keyboard, Escape, outside pointer, focus exit and resize', async ({ page, browserName }) => {
  // WebKit follows Safari's default: Option-Tab includes links and buttons.
  const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab'
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/guides')
  const toggle = navigationToggle(page)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press(tabKey)
  await expect(page.locator('#header-mobile-navigation').getByRole('link', { name: 'Guides' })).toBeFocused()
  await page.keyboard.press(tabKey)
  await expect(page.locator('#header-mobile-navigation').getByRole('link', { name: 'Newsletter' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press(tabKey)
  await page.keyboard.press(tabKey)
  await page.keyboard.press(tabKey)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await page.locator('body').click({ position: { x: 2, y: 300 } })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page.setViewportSize({ width: 1024, height: 812 })
  await expect(page.locator('#header-mobile-navigation')).toHaveCount(0)
  await page.setViewportSize({ width: 375, height: 812 })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('currency and navigation disclosures are exclusive, dismissible and keyboard usable', async ({ page, browserName }) => {
  const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab'
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/guides')
  await navigationToggle(page).click()
  await currencyToggle(page).click()
  await expect(navigationToggle(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(currencyToggle(page)).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#header-currencies').getByRole('button', { pressed: true })).toHaveCount(1)
  await currencyToggle(page).focus()
  await page.keyboard.press(tabKey)
  await expect(page.locator('#header-currencies').getByRole('button').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(currencyToggle(page)).toBeFocused()
  await expect(currencyToggle(page)).toHaveAttribute('aria-expanded', 'false')

  await currencyToggle(page).click()
  await page.locator('#header-currencies').getByRole('button', { name: /EUR/ }).click()
  await expect(currencyToggle(page)).toHaveAccessibleName('Currency: EUR')
  await expect(currencyToggle(page)).toBeFocused()
  await expect(currencyToggle(page)).toHaveAttribute('aria-expanded', 'false')
  await currencyToggle(page).click()
  await navigationToggle(page).click()
  await expect(currencyToggle(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(navigationToggle(page)).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')

  await currencyToggle(page).click()
  await page.locator('body').click({ position: { x: 2, y: 300 } })
  await expect(currencyToggle(page)).toHaveAttribute('aria-expanded', 'false')
})

test('mobile links navigate to Guides and the home newsletter from a nested page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await navigationToggle(page).click()
  await page.locator('#header-mobile-navigation').getByRole('link', { name: 'Guides' }).click()
  await expect(page).toHaveURL(/\/guides\/?$/)
  await expect(navigationToggle(page)).toHaveAttribute('aria-expanded', 'false')
  await navigationToggle(page).click()
  await page.locator('#header-mobile-navigation').getByRole('link', { name: 'Newsletter' }).click()
  await expect(page).toHaveURL(/\/#newsletter$/)
  await expect(page.locator('#newsletter')).toBeInViewport()
  await expect(navigationToggle(page)).toHaveAttribute('aria-expanded', 'false')
  // Same-page hash navigation also closes the disclosure.
  await navigationToggle(page).click()
  await page.locator('#header-mobile-navigation').getByRole('link', { name: 'Newsletter' }).click()
  await expect(navigationToggle(page)).toHaveAttribute('aria-expanded', 'false')
})

test('desktop newsletter link and Subscribe CTA reach the home newsletter from Guides', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  for (const name of ['Newsletter', 'Subscribe']) {
    await page.goto('/guides')
    const link = primaryNav(page).getByRole('link', { name, exact: true })
    await expect(link).toHaveAttribute('href', '/#newsletter')
    await link.click()
    await expect(page).toHaveURL(/\/#newsletter$/)
    await expect(page.locator('#newsletter')).toBeInViewport()
  }
})
