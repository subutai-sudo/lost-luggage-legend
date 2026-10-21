import { test, expect } from '@playwright/test'

async function expectImageLoaded(image) {
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0), {
    timeout: 20_000,
    message: 'Image must load real bytes, not merely have an img tag',
  }).toBe(true)
}

test('homepage hero images load successfully', async ({ page }) => {
  await page.goto('/')
  const images = page.locator('img')
  await expect(images).toHaveCount(3)
  for (const image of await images.all()) await expectImageLoaded(image)
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
  await page.goto('/')
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
