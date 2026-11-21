import { test, expect } from './browser-fixture.mjs'

// The SVG deliberately has pointer-events:none. Its visible centre must hit
// the strip (or one of its descendants), not the higher-z-index sticky navbar.
export async function readStripGeometry(page) {
  return page.locator('[data-travel-edition-strip]').evaluate(strip => {
    const nav = strip.previousElementSibling
    const navbar = nav.querySelector('nav')
    const plane = strip.querySelector('[data-aviation-motif]')
    const label = strip.querySelector('p')
    const rect = element => element.getBoundingClientRect().toJSON()
    const hit = element => {
      const box = element.getBoundingClientRect()
      const x = box.left + box.width / 2
      const y = box.top + box.height / 2
      const target = document.elementFromPoint(x, y)
      return { x, y, unoccluded: target !== null && strip.contains(target),
        target: target && { tag: target.tagName, className: target.getAttribute('class') } }
    }
    return {
      dark: document.documentElement.classList.contains('dark'),
      colorScheme: getComputedStyle(strip.closest('[data-guide-theme]')).colorScheme,
      stripBackground: getComputedStyle(strip).backgroundColor,
      scrollY: window.scrollY,
      width: document.documentElement.clientWidth,
      height: window.innerHeight,
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      nav: rect(nav), navbar: rect(navbar), strip: rect(strip),
      plane: rect(plane), label: rect(label),
      marginBottom: getComputedStyle(nav).marginBottom,
      planeHit: hit(plane), labelHit: hit(label),
    }
  })
}

export function assertStripGeometry(g, theme) {
  const evidence = JSON.stringify(g)
  expect(g.dark, evidence).toBe(theme === 'dark')
  expect(g.colorScheme, evidence).toBe(theme)
  expect(g.stripBackground, evidence).toBe(theme === 'dark' ? 'rgb(16, 43, 59)' : 'rgb(244, 241, 232)')
  expect(g.scrollY, evidence).toBe(0)
  expect(g.strip.top, evidence).toBeGreaterThanOrEqual(g.navbar.bottom)
  expect(g.strip.top, evidence).toBeGreaterThanOrEqual(g.nav.bottom)
  expect(g.planeHit.unoccluded, evidence).toBe(true)
  expect(g.labelHit.unoccluded, evidence).toBe(true)
  expect(g.scrollWidth, evidence).toBeLessThanOrEqual(g.width + 1)
  for (const box of [g.strip, g.plane, g.label]) {
    expect(box.width, evidence).toBeGreaterThan(0)
    expect(box.height, evidence).toBeGreaterThan(0)
    expect(box.left, evidence).toBeGreaterThanOrEqual(0)
    expect(box.right, evidence).toBeLessThanOrEqual(g.width)
    expect(box.top, evidence).toBeGreaterThanOrEqual(0)
    expect(box.bottom, evidence).toBeLessThanOrEqual(g.height)
  }
  for (const box of [g.plane, g.label]) {
    expect(box.top, evidence).toBeGreaterThanOrEqual(g.strip.top)
    expect(box.bottom, evidence).toBeLessThanOrEqual(g.strip.bottom)
  }
}

for (const route of ['/guides', '/guides/maldives']) {
  for (const width of [320, 390, 1440]) {
    for (const theme of ['light', 'dark']) {
      test(`${route} ${width}px ${theme}: aviation strip clears the sticky navbar`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 1000 })
        // ThemeProvider's actual persistence key; asserting class AND applied
        // colour-scheme/background prevents a light/dark-labelled single palette.
        await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
        await page.goto(route, { waitUntil: 'domcontentloaded' })
        await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
        await page.evaluate(() => document.fonts.ready)
        const strip = page.locator('[data-travel-edition-strip]')
        await expect(strip).toHaveCount(1)
        await expect(strip).toBeVisible()
        const plane = strip.locator('[data-aviation-motif]')
        await expect(plane).toBeVisible()
        await expect(plane).toHaveAttribute('aria-hidden', 'true')
        await expect(plane).toHaveAttribute('focusable', 'false')
        await expect(strip.locator('p').first()).toHaveText('The travel edition Goldilocks Zone')
        const geometry = await readStripGeometry(page)
        await testInfo.attach('travel-strip-geometry', { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' })
        assertStripGeometry(geometry, theme)
      })
    }
  }
}
