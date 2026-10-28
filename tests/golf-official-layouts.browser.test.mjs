import { readFileSync } from 'node:fs'
import { test, expect } from './browser-fixture.mjs'
const expected = JSON.parse(readFileSync(new URL('./fixtures/golf-official-layouts-expected.json', import.meta.url), 'utf8'))

const kindLabels = { 'routing-map':'Course routing map', 'hole-diagrams':'Hole-by-hole diagrams', 'video-tour':'Hole-flyover video guide', 'hole-tour':'Hole tour', scorecard:'Scorecard · not a routing map' }

for (const [id, resource] of Object.entries(expected.resources)) {
  test(`${id}: official layout action names the exact resource and keeps photos honest`, async ({ page }) => {
    await page.goto(`/golf/${id}`)
    const media = page.locator(`[data-golf-media="${id}"]`)
    const link = media.locator('[data-golf-layout-resource]')
    await expect(link).toHaveAttribute('href', resource.url)
    await expect(link).toContainText(resource.label)
    await expect(media.locator('[data-golf-layout-kind]')).toHaveAttribute('data-golf-layout-kind', resource.kind)
    await expect(media.locator('[data-golf-layout-kind]')).toHaveText(kindLabels[resource.kind])
    if (id === 'sentosa-golf-club-serapong') {
      await expect(media.locator('[data-golf-gallery-same-page]')).toHaveCount(1)
      await expect(media.locator('[data-golf-gallery-resource]')).toHaveCount(0)
    }
    await expect(media.locator('[data-golf-layout]')).toContainText(resource.scope)
    await expect(media.locator('[data-golf-layout]')).toContainText('remain hosted by their publisher')
    await expect(page.locator('[data-golf-guide-hero]')).toContainText('Course photograph not available')
    await expect(page.locator('[data-golf-guide-hero] [data-golf-guide-image]')).toHaveCount(0)
    // Layout links do not license copied photographs or add remote map images.
    await expect(media.locator('[data-golf-photo]')).toHaveCount(0)
    await expect(media.locator('img')).toHaveCount(id === 'steenberg-golf-club' ? 1 : 0)
    const galleryLink = media.locator('[data-golf-gallery-resource]')
    const samePage = media.locator('[data-golf-gallery-same-page]')
    expect(await galleryLink.count() + await samePage.count()).toBe(1)
    if (await galleryLink.count()) expect(await galleryLink.getAttribute('href')).not.toBe(resource.url)
  })
}

for (const width of [320, 390, 768, 1440]) {
  for (const theme of ['light','dark']) {
    test(`official map and diagram actions are readable and tappable at ${width}px ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height:900 })
      await page.addInitScript(theme => localStorage.setItem('lll-theme', theme), theme)
      for (const id of ['royal-golf-marrakech-old-course','kyt-j-golf-south-east']) {
        await page.goto(`/golf/${id}#course-visuals`)
        await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
        const link = page.locator('[data-golf-layout-resource]')
        await link.scrollIntoViewIfNeeded()
        await expect(link).toBeVisible()
        const metrics = await link.evaluate(el => {
          const box = el.getBoundingClientRect()
          return {height:box.height,x:box.x,right:box.right,font:parseFloat(getComputedStyle(el).fontSize),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}
        })
        expect(metrics.height).toBeGreaterThanOrEqual(44)
        expect(metrics.font).toBeGreaterThanOrEqual(13)
        expect(metrics.x).toBeGreaterThanOrEqual(0)
        expect(metrics.right).toBeLessThanOrEqual(width+1)
        expect(metrics.overflow).toBeLessThanOrEqual(1)
        const kind = page.locator('[data-golf-layout-kind]')
        expect(await kind.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(13)
        if (width === 390 && id === 'royal-golf-marrakech-old-course') await page.screenshot({ path:testInfo.outputPath(`official-map-${theme}.png`) })
      }
    })
  }
}

test('finder visual links lead to the corrected course resource section', async ({ page }) => {
  await page.goto('/golf?month=4')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready','true')
  const links = page.locator('a[href*="/golf/"][href$="#course-visuals"]')
  expect(await links.count()).toBeGreaterThan(0)
  const href = await links.first().getAttribute('href')
  await links.first().click()
  await expect(page).toHaveURL(new RegExp(href.split('#')[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '#course-visuals$'))
  await expect(page.locator('#course-visuals')).toBeFocused()
  await expect(page.locator('[data-golf-layout-resource]')).toHaveAttribute('href', /^https:\/\//)
})

test('official map link supports keyboard activation without third-party requests', async ({ page }) => {
  const id = 'royal-golf-marrakech-old-course'
  const resource = expected.resources[id]
  await page.goto(`/golf/${id}#course-visuals`)
  const target = page.locator('#course-visuals')
  await expect(target).toBeFocused()
  // Wait for the fragment recovery before traversal; WebKit uses Option-Tab.
  await expect.poll(() => target.evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(150)
  await page.waitForFunction(() => !document.getAnimations().some(a => a.playState === 'running'))
  await page.keyboard.press(test.info().project.name === 'iphone-webkit' ? 'Alt+Tab' : 'Tab')
  const link = page.locator('[data-golf-layout-resource]')
  await expect(link).toBeFocused()
  const bounds = await link.boundingBox()
  expect(bounds.y).toBeGreaterThanOrEqual(0)
  expect(bounds.y+bounds.height).toBeLessThanOrEqual(900)
  await page.route(resource.url, route => route.fulfill({status:200,contentType:'text/html',body:'<h1>Intercepted official-map navigation</h1>'}))
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(resource.url)
  await expect(page.getByRole('heading')).toHaveText('Intercepted official-map navigation')
})

test('unresolved Bali layout is not presented as proof the club has no map', async ({ page }) => {
  await page.goto('/golf/bali-national-golf-club')
  await expect(page.locator('[data-golf-layout-resource]')).toHaveCount(0)
  await expect(page.locator('[data-golf-layout-unavailable]')).toContainText('not linked here yet')
  await expect(page.locator('[data-golf-gallery-resource]')).toHaveAttribute('href','https://www.nelsonhaworth.com/bali-national-golf-club/')
})
