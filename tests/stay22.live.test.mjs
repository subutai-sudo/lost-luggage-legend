import { test, expect } from '@playwright/test'

test('real Stay22 script retains Nova opt-out and LinkSwap during same-tab navigation', async ({ page, context, baseURL, isMobile }) => {
  test.skip(process.env.RUN_STAY22_LIVE !== '1', 'Requires explicit opt-in for the real third-party script')
  const origin = new URL(baseURL).origin
  expect(['localhost', '127.0.0.1', '[::1]']).toContain(new URL(baseURL).hostname)

  const offsiteAttempts = []
  const popups = []
  context.on('page', popup => { if (popup !== page) popups.push(popup) })
  await context.route('**/*', async route => {
    const request = route.request()
    const url = new URL(request.url())
    if (request.isNavigationRequest() && url.origin !== origin) {
      offsiteAttempts.push({ host: url.hostname, path: url.pathname })
      return route.abort('blockedbyclient')
    }
    if (!['GET', 'HEAD'].includes(request.method()) || url.hostname === 'plausible.io') {
      return route.abort('blockedbyclient')
    }
    return route.continue()
  })

  const vendorResponse = page.waitForResponse(response =>
    response.url() === 'https://scripts.stay22.com/letmeallez.js'
  )
  await page.goto('/guides/lisbon')
  expect((await vendorResponse).status()).toBe(200)
  // This property is added by the real vendor normalizer, not our initializer.
  // Check it before asserting the retained settings, otherwise the test could
  // pass before the external script executes at all.
  await page.waitForFunction(() =>
    typeof window.Stay22?.params?.nova?.suppressUnsafeCategories === 'boolean'
  )
  const runtime = await page.evaluate(() => ({
    disabledMethods: window.Stay22.params.nova.disabledMethods,
    disabledMediums: window.Stay22.params.nova.disabledMediums,
    force: window.Stay22.params.nova.force,
    disableLinkSwap: window.Stay22.params.disableLinkSwap,
  }))
  expect(runtime).toEqual({
    disabledMethods: ['ahref', 'whitespace'],
    disabledMediums: ['undertab', 'underpop', 'overpop'],
    force: false,
    disableLinkSwap: false,
  })

  const explicitLink = page.getByRole('link', { name: /Compare All Sites/ })
  const affiliateUrl = new URL(await explicitLink.getAttribute('href'))
  expect(affiliateUrl.hostname).toBe('www.stay22.com')
  expect(affiliateUrl.pathname).toMatch(/^\/allez\//)
  expect(affiliateUrl.searchParams.get('aid')).toBeTruthy()

  // Browser-only canary: ask the real LinkSwap observer to convert a supported
  // supplier URL. Never click it or contact the supplier/complete a booking.
  await page.evaluate(() => {
    const link = document.createElement('a')
    link.id = 'stay22-linkswap-canary'
    link.href = 'https://www.booking.com/searchresults.html?ss=Lisbon'
    link.textContent = 'LinkSwap verification link'
    document.body.appendChild(link)
  })
  await expect.poll(() => page.locator('#stay22-linkswap-canary').getAttribute('href')).toContain('stay22.com/allez/')
  const swappedUrl = new URL(await page.locator('#stay22-linkswap-canary').getAttribute('href'))
  expect(swappedUrl.searchParams.get('aid')).toBeTruthy()
  await page.locator('#stay22-linkswap-canary').evaluate(link => link.remove())

  await page.getByRole('heading', { level: 1 }).click()
  // Detail pages use an editorial header, not the shared interactive Navbar.
  // Exercise its visible home link, then the shared controls on the guide index.
  await page.locator('nav a[href="/"]').first().click()
  await expect(page).toHaveURL(`${origin}/`)
  const nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true })
  if (isMobile) await nav.getByRole('button', { name: 'Toggle navigation' }).click()
  await nav.getByRole('link', { name: 'Guides', exact: true }).click()
  await expect(page).toHaveURL(`${origin}/guides`)
  await page.getByRole('heading', { level: 1 }).click()
  await nav.getByRole('button', { name: /Switch to .* mode/ }).click()
  if (isMobile) await nav.getByRole('button', { name: 'Toggle navigation' }).click()
  await nav.getByRole('link', { name: 'Newsletter', exact: true }).click()
  await expect(page).toHaveURL(`${origin}/#newsletter`)
  await expect(page.locator('#newsletter')).toBeInViewport()
  expect(context.pages()).toHaveLength(1)
  expect(popups).toHaveLength(0)
  expect(offsiteAttempts).toEqual([])

  // This verifies real configuration acceptance and these local interactions.
  // It is NOT an eligible-vs-disabled baseline, real-device test or evidence of
  // supplier acceptance / commission attribution. No eligibility is forced.
})
