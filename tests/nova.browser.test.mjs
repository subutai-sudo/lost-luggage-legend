import { test, expect } from './browser-fixture.mjs'

const expectedNova = {
  disabledMethods: ['ahref', 'whitespace'],
  disabledMediums: ['undertab', 'underpop', 'overpop'],
  force: false,
}

test('every page initializes Nova opt-out before the vendor script without disabling LinkSwap', async ({ page }) => {
  for (const path of ['/', '/guides', '/guides/lisbon']) {
    await page.goto(path)
    await expect.poll(() => page.evaluate(() => ({
      lmaID: window.Stay22?.params?.lmaID,
      disableLinkSwap: window.Stay22?.params?.disableLinkSwap,
      nova: window.Stay22?.params?.nova,
    }))).toEqual({
      lmaID: '69d481c8e570ac3a76202d74',
      disableLinkSwap: false,
      nova: expectedNova,
    })
    await expect(page.locator('script[src="https://scripts.stay22.com/letmeallez.js"]')).toHaveCount(1)
  }
})

test('deliberate affiliate links retain provider routing and affiliate IDs', async ({ page }) => {
  await page.goto('/guides/lisbon')
  const links = page.locator('a[href*="stay22.com/allez/"][rel~="sponsored"]')
  await expect.poll(() => links.count()).toBeGreaterThan(0)
  for (const link of await links.all()) {
    const url = new URL(await link.getAttribute('href'))
    expect(url.protocol).toBe('https:')
    expect(url.hostname).toBe('www.stay22.com')
    expect(url.pathname).toMatch(/^\/allez\/[a-z]+$/)
    expect(url.searchParams.get('aid')).toBeTruthy()
    await expect(link).toHaveAttribute('target', '_blank')
  }
})
