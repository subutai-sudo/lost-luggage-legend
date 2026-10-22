import { test, expect } from './browser-fixture.mjs'

for (const theme of ['light', 'dark']) {
  for (const width of [320, 1280]) {
    test(`cinematic brand is complete and fits at ${width}px in ${theme}`, async ({ page }) => {
      await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
      await page.setViewportSize({ width, height: 900 })
      for (const route of ['/', '/guides', '/guides/lisbon']) {
        await page.goto(route)
        await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
        const nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true })
        const brand = nav.getByRole('link', { name: 'Lost Luggage Legend — home', exact: true })
        await expect(brand).toHaveAttribute('href', '/')
        await expect(brand.locator('[data-brand-name]')).toHaveText('Lost Luggage')
        await expect(brand.locator('[data-brand-parent]')).toHaveText('Legend')
        await expect(brand.locator('[data-brand-descriptor]')).toHaveText('Goldilocks Zone')
        const image = brand.locator('img')
        await expect(image).toHaveAttribute('src', '/brand/goldilocks-mark.svg')
        await expect(image).toHaveAttribute('alt', '')
        await image.evaluate(img => img.decode())
        const bounds = await brand.evaluate(el => {
          const text = el.querySelector('[data-brand-wordmark]')
          const textBox = text.getBoundingClientRect()
          const logo = el.getBoundingClientRect()
          return { ...logo.toJSON(), textLeft: textBox.left, textRight: textBox.right, textOverflow: text.scrollWidth > text.clientWidth + 1, navOverflow: el.closest('nav').scrollWidth, docOverflow: document.documentElement.scrollWidth, viewport: innerWidth }
        })
        expect(bounds.left).toBeGreaterThanOrEqual(0)
        expect(bounds.right).toBeLessThanOrEqual(width + 1)
        expect(bounds.height).toBeGreaterThanOrEqual(44)
        expect(bounds.textLeft).toBeGreaterThanOrEqual(bounds.left)
        expect(bounds.textRight).toBeLessThanOrEqual(bounds.right + 1)
        expect(bounds.textOverflow).toBe(false)
        expect(bounds.navOverflow).toBeLessThanOrEqual(width + 1)
        expect(bounds.docOverflow).toBeLessThanOrEqual(width + 1)
        await expect(nav).not.toContainText('🧳')
      }
    })
  }
}

test('browser icons use the same original vector, with real decoded PNG fallbacks', async ({ page, request }) => {
  await page.goto('/guides')
  const icons = page.locator('head link[rel="icon"]')
  await expect(icons).toHaveCount(2)
  await expect(page.locator('head link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/brand/goldilocks-mark.svg')
  await expect(page.locator('head link[rel="icon"][type="image/png"]')).toHaveAttribute('href', '/brand/favicon-32.png')
  await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/brand/apple-touch-icon.png')
  const vector = await request.get('/brand/goldilocks-mark.svg')
  expect(vector.ok()).toBe(true)
  const svg = await vector.text()
  expect(svg).toContain('viewBox="0 0 48 48"')
  const geometry = await page.evaluate(markup => {
    const doc = new DOMParser().parseFromString(markup, 'image/svg+xml')
    return {
      sun: doc.querySelector('[data-sun]')?.getAttribute('d'),
      horizon: doc.querySelector('[data-horizon]')?.getAttribute('d'),
      rays: [...doc.querySelectorAll('[data-sun-rays] path')].map(node => node.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)),
      groups: doc.querySelectorAll('g').length,
      circles: doc.querySelectorAll('circle').length,
    }
  }, svg)
  expect(geometry.sun).toBe('M15.5 28.5A8.5 8.5 0 0 1 32.5 28.5Z')
  expect(geometry.horizon).toBe('M10 28.5H38')
  expect(geometry.rays).toHaveLength(7)
  expect(geometry.groups).toBe(1)
  expect(geometry.circles, 'only background and rim, not a floating sun').toBe(2)
  for (const [x1, y1, x2, y2] of geometry.rays) {
    const startDistance = Math.hypot(x1 - 24, y1 - 28.5)
    const endDistance = Math.hypot(x2 - 24, y2 - 28.5)
    expect(startDistance).toBeGreaterThan(8.5)
    expect(endDistance).toBeGreaterThan(startDistance)
    expect(endDistance).toBeLessThan(18)
    expect(y1).toBeLessThan(28.5)
    expect(y2).toBeLessThan(y1)
    expect(Math.abs((x1 - 24) * (y2 - 28.5) - (y1 - 28.5) * (x2 - 24)), 'rays radiate from the sun centre').toBeLessThan(.03)
  }
  expect(svg).not.toMatch(/<script|foreignObject|\bonload=|(?:href|src)\s*=\s*['"]https?:\/\//i)
  for (const [src, size] of [['/brand/favicon-32.png', 32], ['/brand/apple-touch-icon.png', 180]]) {
    const response = await request.get(src)
    expect(response.ok()).toBe(true)
    const body = await response.body()
    expect(body.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
    const dimensions = await page.evaluate(async src => {
      const image = new Image()
      image.src = src
      await image.decode()
      return [image.naturalWidth, image.naturalHeight]
    }, src)
    expect(dimensions).toEqual([size, size])
  }
})

test('brand link remains keyboard-accessible and returns from a guide to discovery', async ({ page }) => {
  await page.goto('/guides/lisbon')
  const brand = page.getByRole('navigation', { name: 'Primary navigation', exact: true }).getByRole('link', { name: 'Lost Luggage Legend — home', exact: true })
  await brand.focus()
  await expect(brand).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
})
