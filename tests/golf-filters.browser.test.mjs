import { test, expect } from './browser-fixture.mjs'
const cards = page => page.locator('[data-golf-card]')
const ids = page => cards(page).evaluateAll(items => items.map(c => c.dataset.golfCard))

test('search, style and photograph filters narrow only the six monthly picks', async ({ page }) => {
  await page.goto('/golf?month=6')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  const search = page.getByRole('searchbox', { name: 'Course or location' })
  await expect(cards(page)).toHaveCount(6)
  await search.fill('Gullane')
  await expect.poll(() => ids(page)).toEqual(['muirfield'])
  await expect(page.locator('[data-golf-result-count]')).toHaveText('Showing 1 of 6 June picks.')
  await search.fill('')
  await page.getByRole('combobox', { name: 'Course character', exact: true }).selectOption('links')
  expect(await ids(page)).toEqual(['muirfield', 'portmarnock-golf-club'])
  await page.getByLabel('On-page course photographs only').check()
  expect(await ids(page)).toEqual(['muirfield', 'portmarnock-golf-club'])
  await expect(page).toHaveURL(/month=6.*style=links.*photos=1/)
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await expect(cards(page)).toHaveCount(6)
  await expect(page.getByRole('button', { name: 'Clear filters', exact: true })).toBeDisabled()
})

test('zero results explain the scope and recover without losing the month', async ({ page }) => {
  await page.goto('/golf?month=10&q=not-a-real-course&style=mountain&photos=1')
  await expect(page.locator('[data-golf-empty]')).toBeVisible()
  await expect(page.locator('[data-golf-empty]')).toContainText('six October picks')
  await expect(cards(page)).toHaveCount(0)
  const reset = page.getByRole('button', { name: 'Show all six October picks' })
  await reset.scrollIntoViewIfNeeded()
  await reset.focus()
  await page.keyboard.press('Enter')
  await expect(cards(page)).toHaveCount(6)
  await expect(page).toHaveURL(/\?month=10$/)
  await expect(page.getByRole('searchbox')).toBeFocused()
  await expect(page.getByRole('searchbox')).toBeInViewport()
  const box = await page.getByRole('searchbox').boundingBox()
  expect(box.y).toBeGreaterThanOrEqual(64)
})

test('shared URL restores state and month navigation supports Back', async ({ page }) => {
  await page.goto('/golf?month=6&q=muirfield&style=links&photos=1')
  await expect(page.getByRole('searchbox')).toHaveValue('muirfield')
  expect(await ids(page)).toEqual(['muirfield'])
  await page.getByRole('button', { name: 'July', exact: true }).click()
  await expect(page).toHaveURL(/month=7/)
  await expect(page.getByRole('searchbox')).toHaveValue('muirfield')
  await page.goBack()
  await expect(page.getByRole('button', { name: 'June', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page).toHaveURL(/month=6/)
  await page.reload()
  expect(await ids(page)).toEqual(['muirfield'])
})

test('finder links preserve month for both course articles and visuals', async ({ page }) => {
  await page.goto('/golf?month=6')
  const card = page.locator('[data-golf-card="muirfield"]')
  await expect(card.locator('h3 a')).toHaveAttribute('href', '/golf/muirfield?month=6')
  await expect(card.locator('a[href$="#course-visuals"]')).toHaveAttribute('href', '/golf/muirfield?month=6#course-visuals')
})

test('rapid edits coalesce URL writes and reload the final filters without WebKit quota errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    window.golfUrlWrites = 0
    const original = history.replaceState.bind(history)
    history.replaceState = (...args) => { window.golfUrlWrites++; return original(...args) }
  })
  await page.goto('/golf?month=6')
  const search = page.getByRole('searchbox')
  await search.focus()
  await page.keyboard.type('x'.repeat(80), { delay: 40 })
  for (let n = 0; n < 40; n++) await page.keyboard.press('Backspace', { delay: 40 })
  await search.fill('Muirfield')
  await expect(page).toHaveURL(/q=Muirfield/)
  await expect(cards(page)).toHaveCount(1)
  expect(await page.evaluate(() => window.golfUrlWrites)).toBeLessThan(20)
  expect(errors).toEqual([])
  await page.reload()
  await expect(search).toHaveValue('Muirfield')
  await expect.poll(() => ids(page)).toEqual(['muirfield'])
  // A month change must flush/cancel the old month's pending write.
  await search.fill('Portmarnock')
  await page.getByRole('button', { name: 'July', exact: true }).click()
  await expect(page).toHaveURL(/month=7.*q=Portmarnock/)
  await page.waitForTimeout(500)
  await expect(page).toHaveURL(/month=7.*q=Portmarnock/)
})

test('course breadcrumb and footer retain the finder month', async ({ page }) => {
  await page.goto('/golf/muirfield?month=6')
  const breadcrumb = page.getByRole('navigation', {name: 'Breadcrumb', exact: true}).getByRole('link', {name: 'Golf month finder', exact: true})
  await expect(breadcrumb).toHaveAttribute('href', '/golf?month=6#golf-results')
  await breadcrumb.click()
  await expect(page.getByRole('button', {name: 'June', exact: true})).toHaveAttribute('aria-pressed', 'true')
  await expect(page).toHaveURL(/month=6#golf-results$/)
})

for (const theme of ['light', 'dark']) for (const width of [320, 390, 1440]) {
  test(`filters fit and remain keyboard-readable at ${width}px ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
    await page.goto('/golf?month=6')
    if (theme === 'dark') await expect(page.locator('html')).toHaveClass(/dark/)
    else await expect(page.locator('html')).not.toHaveClass(/dark/)
    const search = page.getByRole('searchbox')
    await search.scrollIntoViewIfNeeded()
    await search.focus()
    await page.keyboard.type('Muirfield')
    await expect(cards(page)).toHaveCount(1)
    const styles = await search.evaluate(el => ({ outline: getComputedStyle(el).outlineStyle, height: el.getBoundingClientRect().height, font: parseFloat(getComputedStyle(el).fontSize) }))
    expect(styles.outline).not.toBe('none')
    expect(styles.height).toBeGreaterThanOrEqual(44)
    expect(styles.font).toBeGreaterThanOrEqual(16)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
    expect(overflow).toBe(false)
    for (const control of await page.locator('[data-golf-filters] input, [data-golf-filters] select, [data-golf-filters] button').all()) {
      const r = await control.boundingBox()
      expect(r.x).toBeGreaterThanOrEqual(0)
      expect(r.x + r.width).toBeLessThanOrEqual(width + 1)
    }
  })
}
