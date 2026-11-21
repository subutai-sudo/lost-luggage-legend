import { test, expect } from './browser-fixture.mjs'

// Independent monthly lead identities already frozen by the finder-media
// oracle. A static no-JS document cannot apply a client-only ?month override.
const SERVER_MONTH_LEADS = [
  ['emirates-golf-club-majlis-course', 'Emirates Golf Club – Majlis Course'],
  ['tpc-scottsdale-stadium-course', 'TPC Scottsdale – Stadium Course'],
  ['royal-cape-golf-club', 'Royal Cape Golf Club'],
  ['the-royal-melbourne-golf-club-west', 'The Royal Melbourne Golf Club (West)'],
  ['portmarnock-golf-club', 'Portmarnock Golf Club'],
  ['muirfield', 'Muirfield'],
  ['keilir-golf-club', 'Keilir Golf Club'],
  ['capilano-golf-and-country-club', 'Capilano Golf and Country Club'],
  ['bethpage-black', 'Bethpage Black'],
  ['oitavos-dunes', 'Oitavos Dunes'],
  ['steenberg-golf-club', 'Steenberg Golf Club'],
  ['new-south-wales-golf-club', 'New South Wales Golf Club'],
]

for (const fragment of ['', '#playing-notes']) test(`visuals helper leaves ${fragment || 'normal guide navigation'} alone`, async ({ page }) => {
  await page.addInitScript(() => {
    window.visualsActions = []
    for (const method of ['focus', 'scrollIntoView']) {
      const owner = method === 'focus' ? HTMLElement.prototype : Element.prototype
      const original = owner[method]
      owner[method] = function (...args) {
        if (this.id === 'course-visuals') window.visualsActions.push(method)
        return original.apply(this, args)
      }
    }
  })
  await page.goto(`/golf/oitavos-dunes${fragment}`)
  // A real hydrated control, not a sleep or a new readiness hook in the product.
  const toggle = page.getByRole('button', { name: 'Switch to dark mode' })
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
  await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))) })
  expect(await page.evaluate(() => window.visualsActions)).toEqual([])
  await expect(page.locator('#course-visuals')).not.toBeFocused()
  if (!fragment) expect(await page.evaluate(() => scrollY)).toBe(0)
  else expect(new URL(page.url()).hash).toBe(fragment)
})

test('same-page native hashchange establishes visuals focus and leaves other fragments native', async ({ page }) => {
  await page.goto('/golf/oitavos-dunes')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await page.evaluate(() => { location.hash = '#course-visuals' })
  await expect(page.locator('#course-visuals')).toBeFocused()
  await expect(page.locator('#course-visuals')).toBeInViewport()
  await page.evaluate(() => { location.hash = '#playing-notes' })
  await expect(page.locator('#playing-notes')).toBeFocused()
  await expect(page.locator('#playing-notes')).toBeInViewport()
})

test('without JavaScript the native visuals link and focusable server target remain available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.route(url => ['scripts.stay22.com', 'plausible.io'].includes(url.hostname), route => route.abort())
  try {
    await page.goto(`${process.env.BROWSER_BASE_URL || 'http://localhost:3001'}/golf?month=10`)
    const selected = page.locator('button[data-golf-month][aria-pressed="true"]')
    await expect(selected).toHaveCount(1)
    const month = Number(await selected.getAttribute('data-golf-month'))
    expect(Number.isInteger(month)).toBe(true)
    expect(month).toBeGreaterThanOrEqual(1)
    expect(month).toBeLessThanOrEqual(12)
    const [id, name] = SERVER_MONTH_LEADS[month - 1]
    const link = page.locator(`[data-golf-card="${id}"] a[href="/golf/${id}#course-visuals"]`)
    await expect(link).toHaveCount(1)
    await link.click()
    await expect(page).toHaveURL(new RegExp(`/golf/${id}#course-visuals$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name)
    await expect(page.locator('#course-visuals')).toHaveAttribute('tabindex', '-1')
    await expect(page.locator('#course-visuals')).toBeInViewport()
  } finally { await context.close() }
})
