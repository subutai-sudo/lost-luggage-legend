import { test, expect } from './browser-fixture.mjs'

test('course guides expose real course media and an honestly labelled layout resource', async ({ page }) => {
  await page.goto('/golf/oitavos-dunes')
  const media = page.locator('[data-golf-media="oitavos-dunes"]')
  await expect(media).toBeVisible()
  await expect(media.getByRole('heading', { name: 'Course layout', exact: true })).toBeVisible()
  await expect(media.locator('[data-golf-layout-resource]')).toHaveAttribute('href', /^https:\/\//)
  await expect(media.locator('[data-golf-gallery-resource]')).toHaveAttribute('href', /^https:\/\//)
  // Internal research commentary must never reach the reader.
  await expect(media).not.toContainText(/HTTP \d{3}|do not infer|research|evidence|placeholder/i)
  // A source link is not a substitute for a photograph, and a scorecard is not a map.
  await expect(media.getByRole('heading', { name: 'Course photographs', exact: true })).toBeVisible()
  // The hero must be internally consistent with the approved photo set: a course
  // photograph when one is approved, the explicit destination disclosure otherwise.
  const hero = page.locator('[data-golf-guide-hero]')
  const approvedPhotos = await media.locator('[data-golf-photo-gallery]').count()
  if (approvedPhotos > 0) await expect(hero).toContainText(/Course photograph:/)
  else await expect(hero).toContainText('Destination photograph')
  await expect(hero).toContainText('Oitavos Dunes')
})

test('the mapped routing diagram is a real decoded image, not a broken asset', async ({ page }) => {
  await page.goto('/golf/chambers-bay')
  const media = page.locator('[data-golf-media="chambers-bay"]')
  await expect(media).toBeVisible()
  await expect(media.getByRole('heading', { name: 'Course layout', exact: true })).toBeVisible()
  const map = media.locator('[data-golf-routing-map] img')
  await expect(map).toBeVisible()
  await map.evaluate(img => img.decode())
  expect(await map.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)
  expect(await map.evaluate(img => img.naturalHeight)).toBeGreaterThan(0)
  await expect(media.locator('[data-golf-routing-map]')).toContainText(/OpenStreetMap contributors/)
  await expect(media.locator('[data-golf-routing-map]')).toContainText(/not a yardage|not a navigation aid/i)
  expect(await map.evaluate(img => img.getAttribute('src'))).toMatch(/^\/golf-media\/chambers-bay-[a-z0-9-]+\.svg$/)
})

test('a course with no usable geometry offers the club resource instead of a fake map', async ({ page }) => {
  await page.goto('/golf/oitavos-dunes')
  const media = page.locator('[data-golf-media="oitavos-dunes"]')
  await expect(media.locator('[data-golf-routing-map]')).toHaveCount(0)
  await expect(media.locator('[data-golf-layout]')).not.toContainText(/OpenStreetMap/)
})

test('an approved course photograph is a real decoded image and credits its source', async ({ page }) => {
  await page.goto('/golf/muirfield')
  const media = page.locator('[data-golf-media="muirfield"]')
  await expect(media).toBeVisible()
  const figure = media.locator('[data-golf-photo]').first()
  // Native lazy loading only starts once the figure is on screen, so scroll it
  // into view first; asserting decode on an unloaded lazy image waits forever.
  await figure.scrollIntoViewIfNeeded()
  await expect(figure).toBeVisible()
  const image = figure.locator('img')
  await image.evaluate(async img => { if (!img.complete) await new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }) }); await img.decode() })
  expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)
  // next/image rewrites the source through the optimizer; the encoded URL must
  // still resolve to the course-scoped asset rather than any other course's file.
  const rendered = await image.evaluate(img => decodeURIComponent(img.currentSrc || img.src))
  expect(rendered).toContain('/golf-media/muirfield-01.webp')
  // Attribution and licence must accompany the image, and the hero must use it.
  await expect(figure).toContainText(/Wikimedia Commons|Original & attribution/)
  await expect(figure).toContainText(/CC BY|CC0|Public domain/)
  await expect(page.locator('[data-golf-guide-hero]')).toContainText('Course photograph:')
  await expect(page.locator('[data-golf-guide-hero]')).not.toContainText('Destination photograph')
})
