import { test, expect } from './browser-fixture.mjs'

async function expectImageLoaded(image) {
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0), {
    timeout: 20_000,
    message: 'Image must load real bytes, not merely have an img tag',
  }).toBe(true)
  await image.evaluate(img => img.decode())
}

test('cinematic homepage month photos and hero decode through the real image optimizer', async ({ page }) => {
  await page.goto('/')
  const months = page.locator('button[data-month]')
  await expect(months).toHaveCount(12)
  expect(new Set(await months.evaluateAll(buttons => buttons.map(button => button.dataset.month))).size).toBe(12)
  for (const month of await months.all()) {
    const photo = month.locator('img')
    await expect(photo).toHaveCount(1)
    await expectImageLoaded(photo)
    expect(await photo.evaluate(img => img.currentSrc)).toContain('/_next/image?')
  }
  const hero = page.locator('img[data-hero-image]')
  await expect(hero).toHaveCount(1)
  await expectImageLoaded(hero)
  expect(await hero.evaluate(img => img.currentSrc)).toContain('/_next/image?')
  await expect(page.locator('[data-results] article[data-id]')).toHaveCount(6)
  await expect(page.locator('[data-selected-month]')).toHaveText(/^(January|February|March|April|May|June|July|August|September|October|November|December)$/)
  const matchingGuides = Number(await page.locator('[data-count]').textContent())
  expect(matchingGuides).toBeGreaterThanOrEqual(6)
  expect(matchingGuides).toBeLessThanOrEqual(100)
  await expect(page.locator('[data-feature-title]')).not.toBeEmpty()
})

test('guide thumbnails and guide hero load through the real image optimizer', async ({ page }) => {
  await page.goto('/guides')
  const thumbnails = page.locator('img')
  await expect.poll(() => thumbnails.count()).toBeGreaterThan(0)
  for (const image of (await thumbnails.all()).slice(0, 5)) {
    await expectImageLoaded(image)
    expect(await image.evaluate(img => img.currentSrc)).toContain('/_next/image?')
  }
  await page.goto('/guides/lisbon')
  const hero = page.locator('img').first()
  await expectImageLoaded(hero)
  expect(await hero.evaluate(img => img.currentSrc)).toContain('/_next/image?')
})

test('upgraded map renders geography, all 100 destinations and keyboard navigation', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto('/explore')
  const map = page.locator('#goldilock')
  await map.scrollIntoViewIfNeeded()
  await expect.poll(() => map.locator('path.rsm-geography').count()).toBeGreaterThan(100)
  await map.getByRole('button', { name: 'All (100)', exact: true }).click()
  await expect(map.locator('[role="button"][aria-label^="Open the "]')).toHaveCount(100)
  const lisbon = map.getByRole('button', { name: 'Open the Lisbon travel guide', exact: true })
  await lisbon.focus()
  await lisbon.press('Enter')
  await expect(page).toHaveURL(/\/guides\/lisbon$/)
  expect(pageErrors).toEqual([])
})
