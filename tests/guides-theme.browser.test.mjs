import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { test, expect } from './browser-fixture.mjs'

function literal(n) {
  if (ts.isStringLiteral(n)) return n.text
  if (ts.isNumericLiteral(n)) return Number(n.text)
  if (n.kind === ts.SyntaxKind.TrueKeyword) return true
  if (n.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(n)) return n.elements.map(literal)
  if (ts.isObjectLiteralExpression(n)) return Object.fromEntries(n.properties.map(p => [p.name.text, literal(p.initializer)]))
  throw new Error('Nonliteral destination oracle')
}
const source = ts.createSourceFile('guides.ts', await readFile(new URL('../src/data/destinationGuides.ts', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
const declaration = source.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.text === 'DESTINATION_GUIDES')
const guides = literal(declaration.initializer)

async function expectNoOverflow(page) {
  const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, viewport: innerWidth }))
  expect(widths.doc).toBeLessThanOrEqual(widths.viewport + 1)
}

test('guide directory uses the photographic theme and preserves the entire source inventory', async ({ page }) => {
  await page.goto('/guides')
  await expect(page.locator('[data-guide-theme]')).toHaveCount(1)
  await expect(page.locator('header[data-guide-hero] img[data-guide-hero-image]')).toHaveCount(1)
  const cards = page.locator('[data-guide-directory] [data-guide-card]')
  await expect(cards).toHaveCount(guides.length)
  const actual = await cards.evaluateAll(cards => cards.map(card => ({ id: card.dataset.guideCard, href: card.getAttribute('href') })))
  const expected = [...guides].sort((a, b) => a.title.localeCompare(b.title)).map(g => ({ id: g.id, href: `/guides/${g.slug}` }))
  expect(actual).toEqual(expected)
  expect(new Set(actual.map(card => card.href)).size).toBe(guides.length)
  await expect(page.locator('[data-guide-directory]')).not.toContainText(/traveler rating|\d\.\d\s*\/\s*5/i)
  await page.locator('[data-guide-hero-image]').evaluate(img => img.decode())
  const palette = await page.locator('[data-guide-theme]').evaluate(el => getComputedStyle(el).getPropertyValue('--guide-forest').trim())
  expect(palette).toBe('#0c211a')
})

test('alphabet targets are usable and land below the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/guides')
  const alphabet = page.getByRole('navigation', { name: 'Browse guides by letter' })
  for (const link of await alphabet.getByRole('link').all()) {
    const box = await link.boundingBox()
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(box.width).toBeGreaterThanOrEqual(44)
  }
  await alphabet.getByRole('link', { name: 'L', exact: true }).click()
  await expect(page.locator('#letter-L')).toBeInViewport()
  const top = await page.locator('#letter-L').evaluate(el => el.getBoundingClientRect().top)
  expect(top).toBeGreaterThanOrEqual(64)
})

for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 768, 1280]) {
    test(`${width}px ${theme}: directory and long-name guide stay readable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(t => localStorage.setItem('lll-theme', t), theme)
      for (const route of ['/guides', '/guides/ho-chi-minh', '/guides/kuala-lumpur']) {
        await page.goto(route)
        await expect(page.locator('[data-guide-theme]')).toHaveCount(1)
        await expect(page.locator('h1')).toHaveCount(1)
        const hero = page.locator('header[data-guide-hero]')
        const h1 = hero.locator('h1')
        await expect(h1).toBeVisible()
        const geometry = await hero.evaluate(hero => {
          const h1 = hero.querySelector('h1')
          const r = h1.getBoundingClientRect()
          const h = hero.getBoundingClientRect()
          return { heading: r.toJSON(), hero: h.toJSON(), clipped: h1.scrollWidth > h1.clientWidth + 1, colour: getComputedStyle(h1).color }
        })
        expect(geometry.heading.left).toBeGreaterThanOrEqual(0)
        expect(geometry.heading.right).toBeLessThanOrEqual(width + 1)
        expect(geometry.heading.top).toBeGreaterThanOrEqual(geometry.hero.top + 64)
        expect(geometry.heading.bottom).toBeLessThanOrEqual(geometry.hero.bottom + 1)
        expect(geometry.clipped).toBe(false)
        expect(geometry.colour).not.toBe('rgb(29, 36, 31)')
        await expectNoOverflow(page)
      }
    })
  }
}

test('article preserves guide discovery, real hero and downstream booking targets', async ({ page }) => {
  await page.goto('/guides/lisbon')
  await expect(page.locator('main[data-guide-article]')).toHaveAttribute('id', 'guide-main')
  await expect(page.locator('main')).toContainText('Why Lisbon Feels Different')
  await expect(page.locator('header img')).toHaveCount(1)
  await page.locator('[data-guide-hero-image]').evaluate(img => img.decode())
  await expect(page.locator('#book[data-guide-booking]')).toHaveCount(1)
  await expect(page.locator('[data-guide-comparison]')).toHaveCount(1)
  await expect(page.locator('[data-guide-related] a[href^="/guides/"]')).toHaveCount(3)
  const flightLink = page.getByRole('link', { name: /Compare Flights/ })
  await expect(flightLink).toHaveAttribute('href', '/plan#compare-prices')
  await flightLink.click()
  await expect(page.locator('#compare-prices')).toBeInViewport()
})

for (const route of ['/guides', '/guides/lisbon']) {
  test(`${route}: keyboard skip link reaches readable content`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(route)
    const skip = page.getByRole('link', { name: 'Skip to guide content' })
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.locator('#guide-main')).toBeInViewport()
    const top = await page.locator('#guide-main').evaluate(el => el.getBoundingClientRect().top)
    expect(top).toBeGreaterThanOrEqual(64)
  })
}

test('article contents and booking fragments land below the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/guides/lisbon')
  const contents = page.locator('[aria-label="In this guide"]')
  for (const id of ['#guide-section-2', '#book']) {
    await contents.locator(`a[href="${id}"]`).click()
    await expect(page.locator(id)).toBeInViewport()
    expect(await page.locator(id).evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(64)
  }
})

test('cinematic booking panel fits a narrow phone and preserves affiliate routing without clicking out', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/guides/maldives')
  const booking = page.locator('[data-guide-comparison]')
  await expect(booking).toHaveCount(1)
  await booking.scrollIntoViewIfNeeded()
  const anchorData = await booking.locator('a').evaluateAll(links => links.map(a => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel'), ...a.getBoundingClientRect().toJSON() })))
  for (const link of anchorData) {
    expect(link.left).toBeGreaterThanOrEqual(0)
    expect(link.right).toBeLessThanOrEqual(321)
    expect(link.height).toBeGreaterThanOrEqual(44)
    if (link.href.startsWith('https://www.stay22.com/')) {
      const url = new URL(link.href)
      expect(url.searchParams.get('aid')).toBeTruthy()
      expect(url.searchParams.get('campaign')).toBe('lll-guide')
      expect(link.target).toBe('_blank')
      expect(link.rel).toContain('noopener')
      expect(link.rel).toContain('sponsored')
    }
  }
  await expectNoOverflow(page)
})
