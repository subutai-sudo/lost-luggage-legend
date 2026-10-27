import { test, expect } from './browser-fixture.mjs'

import { headers } from './helpers/golf-guide-approved-headers.mjs'

test('course guides expose real course media and an honestly labelled layout resource', async ({ page }) => {
  await page.goto('/golf/oitavos-dunes')
  const media = page.locator('[data-golf-media="oitavos-dunes"]')
  await expect(media).toBeVisible()
  await expect(media.getByRole('heading', { name: 'Course layout', exact: true })).toBeVisible()
  await expect(media.locator('[data-golf-layout-resource]')).toHaveAttribute('href', /^https:\/\//)
  // A gallery is either its own publisher page, or the same page as the layout
  // resource — in which case that is stated rather than duplicated as a second CTA.
  const samePage = await media.locator('[data-golf-gallery-same-page]').count()
  if (samePage) {
    await expect(media.locator('[data-golf-gallery-resource]')).toHaveCount(0)
    await expect(media.locator('[data-golf-layout-resource]')).toHaveAttribute('href', /^https:\/\//)
  } else {
    await expect(media.locator('[data-golf-gallery-resource]')).toHaveAttribute('href', /^https:\/\//)
  }
  // Internal research commentary must never reach the reader.
  // Broadened after a review found the old pattern missed the sentence that was
  // actually on every page: 'Our review confirmed a genuine golf course scene...'
  await expect(media).not.toContainText(/\b(?:our|the)?\s*(?:review|verification|research|audit)\b|\breviewed\b|\bverified\b|\bretrieved\b|\bscreenshot\b|\bevidence\b|HTTP \d{3}|do not infer|placeholder/i)
  // A source link is not a substitute for a photograph, and a scorecard is not a map.
  await expect(media.getByRole('heading', { name: 'Course photographs', exact: true })).toBeVisible()
  // The independently frozen approval includes Oitavos's exact-course photograph.
  const header = headers.find(record => record.id === 'oitavos-dunes')
  const hero = page.locator('[data-golf-guide-hero]')
  const image = hero.locator('[data-golf-guide-image]')
  await expect(image).toHaveCount(1)
  await expect(image).toHaveAttribute('alt', header.photo.alt)
  await expect.poll(() => image.evaluate(img => decodeURIComponent(img.currentSrc || img.src))).toContain(header.photo.src)
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0)).toBe(true)
  await image.evaluate(img => img.decode())
  expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)
  await expect(hero).toContainText(`Course photograph: ${header.photo.caption} Photo ${header.photo.author}, ${header.photo.license}`)
  await expect(hero).not.toContainText('Destination photograph')
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

test('the gallery states whose page it is, and never sells one page as two resources', async ({ page }) => {
  // A photographed course: the gallery scope is shown alongside the photographs.
  await page.goto('/golf/muirfield')
  const media = page.locator('[data-golf-media="muirfield"]')
  await expect(media.locator('[data-golf-gallery-scope]')).toBeVisible()
  await expect(media.locator('[data-golf-gallery-scope]')).toContainText(/Published by/)
  // Ownership is named, not assumed to be the club's.
  await expect(media.locator('[data-golf-gallery-scope]')).not.toContainText(/club or operator's own/i)
  // Where the layout resource and the gallery are the same page, that is stated
  // rather than presented as two separate club resources.
  const both = media.locator('[data-golf-gallery-resource], [data-golf-gallery-same-page]')
  await expect(both).toHaveCount(1)
})

test('a lone photograph declares the full width it actually occupies', async ({ page }) => {
  await page.goto('/golf/bethpage-black')
  const media = page.locator('[data-golf-media="bethpage-black"]')
  const sizes = await media.locator('[data-golf-photo] img').first().evaluate(img => img.getAttribute('sizes'))
  expect(sizes).toBe('92vw')
  // The photograph spans the content column, not half of it, at every width.
  const [figure, gallery] = await Promise.all([
    media.locator('[data-golf-photo]').first().evaluate(node => node.getBoundingClientRect().width),
    media.locator('[data-golf-photo-gallery]').evaluate(node => node.getBoundingClientRect().width),
  ])
  expect(figure).toBeGreaterThan(gallery * 0.95)
})
