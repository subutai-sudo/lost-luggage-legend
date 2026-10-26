import { test, expect } from './browser-fixture.mjs'

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
    // Static finder HTML shows its build-time month before hydration. Exercise
    // that actual rendered shortlist rather than pretending ?month= is server-read.
    const month = await page.locator('button[data-golf-month][aria-pressed="true"]').getAttribute('data-golf-month')
    const link = page.locator('[data-golf-card] a[href$="#course-visuals"]').first()
    const href = await link.getAttribute('href')
    const targetUrl = new URL(href, page.url())
    expect(targetUrl.pathname).toMatch(/^\/golf\/[a-z0-9-]+$/)
    expect(targetUrl.searchParams.get('month')).toBe(month)
    expect(targetUrl.hash).toBe('#course-visuals')
    await link.click()
    expect(new URL(page.url()).pathname + new URL(page.url()).search + new URL(page.url()).hash).toBe(href)
    await expect(page.locator('#course-visuals')).toHaveAttribute('tabindex', '-1')
    await expect(page.locator('#course-visuals')).toBeInViewport()
  } finally { await context.close() }
})
