import { test, expect } from './browser-fixture.mjs'

const cases = [
  { id: 'al-maaden-golf', count: 2, author: 'Didierlefort', cropped: false },
  { id: 'keilir-golf-club', count: 1, author: 'Eysteinn Guðni Guðnason', cropped: false },
  { id: 'new-south-wales-golf-club', count: 1, author: 'Eddy23', cropped: true },
  { id: 'wentworth-club-west', count: 1, author: 'Alan Hunt', cropped: false },
]
for (const course of cases) {
  test(`${course.id}: published photo credits preserve creator and actual modifications`, async ({ page }) => {
    await page.goto(`/golf/${course.id}`)
    const hero = page.locator('[data-golf-guide-hero]')
    await expect(hero).toContainText(course.author)
    await expect(hero).toContainText(/WebP/i)
    const photos = page.locator(`[data-golf-media="${course.id}"] [data-golf-photo]`)
    await expect(photos).toHaveCount(course.count)
    for (const photo of await photos.all()) {
      const caption = photo.locator('figcaption')
      await expect(caption).toContainText(course.author)
      await expect(caption).toContainText(/WebP/i)
      if (course.cropped) await expect(caption).toContainText(/left.*crop|crop.*left/i)
    }
  })
}

test('finder hero, card and collapsed-credit ledger retain crop and modification notices', async ({ page }) => {
  await page.goto('/golf?month=12')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('button[data-golf-month="12"]')).toHaveAttribute('aria-pressed', 'true')
  const credit = page.locator('[data-golf-hero-credit]')
  await expect(credit).toContainText('Eddy23')
  await expect(credit).toContainText(/WebP/i)
  await expect(credit).toContainText(/left.*crop|crop.*left/i)
  const card = page.locator('[data-golf-card="new-south-wales-golf-club"]')
  await expect(card).toContainText(/WebP/i)
  await expect(card).toContainText(/left.*crop|crop.*left/i)
  const disclosure = page.locator('[data-golf-preview-credits]')
  await disclosure.locator('summary').click()
  const december = page.locator('[data-golf-preview-credit="12"]')
  await expect(december).toContainText('Eddy23')
  await expect(december).toContainText(/left.*crop|crop.*left/i)
})
