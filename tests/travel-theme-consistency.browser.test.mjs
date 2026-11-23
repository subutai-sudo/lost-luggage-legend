import { test, expect } from './browser-fixture.mjs'

const today = '2030-01-10'
const navy = 'rgb(20, 44, 59)'
const cream = 'rgb(245, 241, 231)'
const lime = 'rgb(224, 242, 155)'

async function settledColors(locator, backgroundColor, color) {
  await expect(locator).toHaveCSS('background-color', backgroundColor)
  await expect(locator).toHaveCSS('color', color)
  await expect(locator).toHaveCSS('background-image', 'none')
}

for (const theme of ['light', 'dark']) {
  test(`${theme}: travel navigation and valid planner results share the travel palette`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.clock.setFixedTime(new Date('2030-01-10T20:00:00Z'))
    await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
    for (const route of ['/guides', '/explore', '/plan']) {
      await page.goto(route)
      await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
      const nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true })
      await expect(nav).toHaveCSS('background-color', route === '/guides' ? 'rgba(16, 39, 53, 0.92)' : 'rgb(16, 39, 53)')
      await expect(nav).toHaveCSS('--color-accent', '#e0f29b')
      if (route !== '/guides') await expect(nav).toHaveCSS('--color-accent-light', '#e0f29b')
      await nav.getByRole('button', { name: /^Currency:/ }).click()
      await expect(nav.locator('#header-currencies button[aria-pressed="true"]')).toHaveCSS('color', lime)
      await page.keyboard.press('Escape')
    }

    const form = page.locator('#compare-prices')
    const ink = theme === 'dark' ? cream : navy
    const actionBg = theme === 'dark' ? lime : navy
    const actionInk = theme === 'dark' ? navy : cream
    const search = form.getByRole('button', { name: 'Search Flights', exact: true })
    await expect(form.locator('#flight-depart')).toHaveAttribute('min', today)
    await expect(search).toBeDisabled()
    await expect(search).toHaveCSS('color', 'rgb(255, 255, 255)')
    const disabledBackground = await search.evaluate(element => getComputedStyle(element).backgroundColor)
    expect(disabledBackground).not.toBe(actionBg)
    await expect(form.locator('[class*="divider"]')).toHaveCount(2)
    for (const divider of await form.locator('[class*="divider"]').all()) await expect(divider).toHaveCSS('background-color', ink)
    const trustIcons = form.locator('svg[style*="--planning-accent-text"]')
    await expect(trustIcons).toHaveCount(3)
    for (const icon of await trustIcons.all()) await expect(icon).toHaveCSS('color', ink)

    // Use the existing booking-suite's real airport selection and valid dates.
    await form.getByLabel('From (City or Airport)', { exact: true }).fill('New York')
    await form.getByRole('button', { name: /New York\s*USA/ }).click()
    await form.getByLabel('To (City or Airport)', { exact: true }).fill('London')
    await form.getByRole('button', { name: /London\s*UK/ }).click()
    await form.getByLabel('Depart', { exact: true }).fill(today)
    await expect(search).toBeEnabled()
    await settledColors(search, actionBg, actionInk)
    await search.click()
    const links = form.locator('a[rel~="sponsored"]')
    await expect(links).toHaveCount(3)
    await expect(links.first()).toHaveAttribute('href', `https://www.kayak.com/flights/JFK-LHR/${today}?sort=price_a`)

    async function checkResults(count) {
      await expect(form.getByRole('status')).toContainText(`${count} ${count === 3 ? 'flight' : 'hotel'} comparison links ready`)
      const countLabel = form.getByText(`${count} sites`, { exact: true })
      await expect(countLabel).toHaveCSS('color', ink)
      const summary = countLabel.locator('..').locator('..')
      await expect(summary).toHaveCSS('background-color', theme === 'dark' ? 'rgb(27, 53, 69)' : 'rgb(238, 232, 219)')
      await expect(summary).toHaveCSS('border-top-color', theme === 'dark' ? 'rgb(113, 137, 149)' : 'rgb(166, 178, 182)')
      await settledColors(links.first().locator('span').filter({ hasText: /^1$/ }), actionBg, actionInk)
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer sponsored')
        await expect(link.locator('img')).toHaveCount(1)
        // Both responsive labels are guarded, without following supplier links.
        for (const cta of await link.locator('span').filter({ hasText: /^Check(?: Prices)?$/ }).all()) await settledColors(cta, actionBg, actionInk)
      }
    }
    await checkResults(3)

    await form.getByRole('button', { name: 'Hotels', exact: true }).click()
    await expect(links).toHaveCount(0)
    await form.getByLabel('Destination', { exact: true }).fill('Lisbon')
    await form.getByLabel('Check-in', { exact: true }).fill('2030-01-11')
    await form.getByLabel('Check-out (Optional)', { exact: true }).fill('2030-01-15')
    const hotelSearch = form.getByRole('button', { name: 'Search Hotels', exact: true })
    await expect(hotelSearch).toBeEnabled()
    await settledColors(hotelSearch, actionBg, actionInk)
    await hotelSearch.click()
    await expect(links).toHaveCount(6)
    const deepLink = new URL(new URL(await links.first().getAttribute('href')).searchParams.get('link'))
    expect(deepLink.searchParams.get('checkin')).toBe('2030-01-11')
    expect(deepLink.searchParams.get('checkout')).toBe('2030-01-15')
    await checkResults(6)
    expect(errors).toEqual([])
  })
}
