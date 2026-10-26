import { test, expect } from './browser-fixture.mjs'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const text = readFileSync(new URL('../src/data/golfCourses.ts', import.meta.url), 'utf8')
const source = ts.createSourceFile('golfCourses.ts', text, ts.ScriptTarget.Latest, true)
const array = source.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.getText(source) === 'GOLF_COURSES').initializer
const courses = array.elements.map(e => Object.fromEntries(e.properties.map(p => [p.name.getText(source), p.initializer.text])))

test('every monthly course title, photo and primary guide link goes to its own golf guide', async ({ page }) => {
  await page.goto('/golf?month=1')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  for (let month = 1; month <= 12; month++) {
    await page.locator(`button[data-golf-month="${month}"]`).click()
    for (const card of await page.locator('[data-golf-card]').all()) {
      const id = await card.getAttribute('data-golf-card')
      await expect(card.locator('h3 a')).toHaveAttribute('href', `/golf/${id}?month=${month}`)
      await expect(card.locator('a').first()).toHaveAttribute('href', `/golf/${id}?month=${month}`)
      await expect(card.getByRole('link', { name: /Read the .*golf guide/ })).toHaveAttribute('href', `/golf/${id}?month=${month}`)
    }
  }
  await page.locator('[data-golf-card] h3 a').first().click()
  await expect(page).toHaveURL(/\/golf\/[a-z0-9-]+\?month=12$/)
  await expect(page.getByRole('heading', { name: /Visitor access/i })).toBeVisible()
})

for (const course of courses) {
  test(`${course.id}: course-specific guide, sources and metadata`, async ({ page }) => {
    const response = await page.goto(`/golf/${course.id}`)
    expect(response.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText(course.name)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://lostluggagelegend.com/golf/${course.id}`)
    await expect(page.getByRole('heading', { name: /Visitor access/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Playing|Course character/i }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /When to play/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Sources/i }).last()).toBeVisible()
    await expect(page.locator('main')).toContainText(/destination.*not.*course/i)
    expect(await page.locator('main').innerText()).not.toMatch(/top attractions|local food|where to eat/i)
    await expect(page.locator('main a[href^="https://"]').first()).toBeVisible()
    const body = await page.locator('main').innerText()
    expect(body.length).toBeGreaterThan(1200)
  })
}

for (const width of [320, 390, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`golf guide layout ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(theme => localStorage.setItem('lll-theme', theme), theme)
      await page.goto('/golf/oitavos-dunes')
      if (theme === 'dark') await expect(page.locator('html')).toHaveClass(/dark/)
      else await expect(page.locator('html')).not.toHaveClass(/dark/)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
      await expect(page.locator('h1')).toBeVisible()
      const image = page.locator('main img').first()
      await image.evaluate(img => img.decode())
      expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)
    })
  }
}

test('Bali redevelopment warning appears before seasonal advice on finder and guide', async ({ page }) => {
  await page.goto('/golf?month=6')
  const card = page.locator('[data-golf-card="bali-national-golf-club"]')
  await expect(card.locator('[data-golf-operational-notice]')).toContainText(/closed.*redevelopment/i)
  await card.locator('h3 a').click()
  await expect(page.locator('[data-golf-operational-notice]')).toContainText(/reopening is unconfirmed/i)
})

test('unknown golf course returns a real 404', async ({ page }) => {
  const response = await page.goto('/golf/not-a-real-course-regression')
  expect(response.status()).toBe(404)
})
