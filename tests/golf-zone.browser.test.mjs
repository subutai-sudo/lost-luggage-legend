import { test, expect } from './browser-fixture.mjs'

// Real production build, real images and real navigation; only marketing hosts
// are blocked by the shared fixture. Every claim asserted here is one the
// section makes to a visitor: a month changes the six picks, every pick carries
// a reason, a trade-off and a reachable source, and each card links to a
// course-specific golf guide that actually exists.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const tabKey = browserName => (browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
const BASE = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:3050'

const monthCards = page => page.locator('[data-golf-zone] article[data-golf-card]')
async function decodeSettledImage(image) {
  // Native lazy/source selection can still be in flight after scrolling in
  // WebKit. Wait for a stable loaded source, not a decode of the prior source.
  await expect.poll(() => image.evaluate(async img => {
    const source = img.currentSrc
    if (!source || !img.complete || !img.naturalWidth) return false
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    return img.complete && img.naturalWidth > 0 && img.currentSrc === source
  })).toBe(true)
  await image.evaluate(img => img.decode())
}

test('golf zone renders the calendar and a sourced six-course shortlist', async ({ page }) => {
  const response = await page.goto('/golf?month=10')
  expect(response.status()).toBe(200)

  await expect(page.locator('h1')).toHaveText(/right course, at the right time/i)
  await expect(page.getByText('Golf Goldilocks Zone', { exact: true }).first()).toBeVisible()

  const months = page.locator('button[data-golf-month]')
  await expect(months).toHaveCount(12)
  for (let month = 1; month <= 12; month++) {
    await expect(page.locator(`button[data-golf-month="${month}"]`)).toHaveAttribute('aria-label', MONTHS[month - 1])
  }
  await expect(page.locator('button[data-golf-month][aria-pressed="true"]')).toHaveCount(1)
  await expect(page.locator('button[data-golf-month="10"]')).toHaveAttribute('aria-pressed', 'true')

  const cards = await monthCards(page)
  await expect(cards).toHaveCount(6)

  for (let index = 0; index < 6; index++) {
    const card = cards.nth(index)
    // Every course states why it suits this month, its cost, and its checks.
    await expect(card.locator('[data-golf-why]')).not.toBeEmpty()
    await expect(card.locator('[data-golf-tradeoff]')).not.toBeEmpty()
    const summary = card.locator('details summary')
    await expect(summary).toHaveText(/Sources & checks/)
    await summary.click()
    const sources = card.locator('[data-golf-source]')
    expect(await sources.count()).toBeGreaterThanOrEqual(1)
    const href = await sources.first().getAttribute('href')
    expect(href).toMatch(/^https:\/\//)
    await expect(card.locator('time').first()).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/)
  }
})

test('a different month swaps the picks and the URL, with unique months', async ({ page }) => {
  await page.goto('/golf?month=10')
  const first = await (await monthCards(page)).first().getAttribute('data-golf-card')
  await page.locator('button[data-golf-month="7"]').click()
  await expect(page).toHaveURL(/month=7/)
  await expect(page.locator('button[data-golf-month="7"]')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('button[data-golf-month][aria-pressed="true"]')).toHaveCount(1)
  const second = await (await monthCards(page)).first().getAttribute('data-golf-card')
  expect(second).not.toBe(first)
  await expect(monthCards(page)).toHaveCount(6)
  // Reaching a month by keyboard must work the same way.
  const target = page.locator('button[data-golf-month="3"]')
  await target.focus()
  await page.keyboard.press('Enter')
  await expect(target).toHaveAttribute('aria-pressed', 'true')
  await expect(page).toHaveURL(/month=3/)
})

test('all twelve months render their approved lead, six unique picks and exact-month reasons', async ({ page }) => {
  // Independent approved lead inventory, not read from the mutable selector.
  const leads = ['emirates-golf-club-majlis-course', 'tpc-scottsdale-stadium-course', 'royal-cape-golf-club', 'the-royal-melbourne-golf-club-west', 'portmarnock-golf-club', 'muirfield', 'keilir-golf-club', 'capilano-golf-and-country-club', 'bethpage-black', 'oitavos-dunes', 'steenberg-golf-club', 'new-south-wales-golf-club']
  await page.goto('/golf?month=1')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  for (let month = 1; month <= 12; month++) {
    await page.locator(`button[data-golf-month="${month}"]`).click()
    await expect(monthCards(page).first()).toHaveAttribute('data-golf-card', leads[month - 1])
    const ids = await monthCards(page).evaluateAll(cards => cards.map(c => c.dataset.golfCard))
    expect(ids).toHaveLength(6); expect(new Set(ids).size).toBe(6)
    await expect(page.locator(`[data-golf-reason][data-golf-month="${month}"]`)).toHaveCount(6)
    await expect(page.locator('[data-golf-pending]')).toHaveCount(0)
    await expect(page.getByRole('status')).toContainText(MONTHS[month - 1])
    if (month === 7) expect(ids).not.toContain('millbrook-resort')
    if (month === 9) expect(ids).not.toContain('emirates-golf-club-majlis-course')
  }
})

test('each pick links to a course-specific golf guide that really exists', async ({ page }) => {
  await page.goto('/golf?month=6')
  const cards = await monthCards(page)
  const hrefs = []
  for (let index = 0; index < 6; index++) {
    const link = cards.nth(index).getByRole('link').filter({ hasText: /guide/i }).first()
    const href = await link.getAttribute('href')
    expect(href).toMatch(/^\/golf\/[a-z0-9-]+$/)
    hrefs.push(href)
  }
  expect(new Set(hrefs).size).toBe(hrefs.length)
  // Spot-check two guides for real reachability without leaving the section.
  for (const href of hrefs.slice(0, 2)) {
    const response = await page.request.get(new URL(href, BASE).href)
    expect(response.status(), href).toBe(200)
  }
})

test('seasonal copy is presented as editorial guidance, not a ranking or a price', async ({ page }) => {
  await page.goto('/golf?month=10')
  const body = await page.locator('[data-golf-zone]').innerText()
  expect(body).toMatch(/not a ranking/i)
  expect(body).toMatch(/editorial/i)
  expect(body).toMatch(/not live conditions/i)
  // No invented price or ranking claims anywhere in the section.
  expect(body).not.toMatch(/£\d|\$\d|\d+\s*(?:st|nd|rd|th)\s+(?:best|ranked)/i)
})

test('the month band and cards use decoded approved course or destination photographs', async ({ page }) => {
  await page.goto('/golf?month=10')
  const hero = page.locator('[data-golf-hero-image]')
  await expect(hero).toHaveCount(1)
  await expect(hero).toHaveAttribute('loading', 'eager')
  await expect(hero).toHaveAttribute('fetchpriority', 'high')
  await decodeSettledImage(hero)
  expect(await hero.evaluate(element => element.naturalWidth)).toBeGreaterThan(0)

  const painter = page.locator('button[data-golf-month="10"] img')
  await painter.scrollIntoViewIfNeeded()
  await decodeSettledImage(painter)
  expect(await painter.evaluate(element => element.naturalWidth)).toBeGreaterThan(0)

  const card = (await monthCards(page)).first().locator('img')
  await card.scrollIntoViewIfNeeded()
  await decodeSettledImage(card)
  expect(await card.evaluate(element => element.naturalWidth)).toBeGreaterThan(0)
  // Photography stays first-party (the optimizer) and every optimized image
  // resolves back to the approved source host; no new image source appeared.
  const sources = await page.locator('[data-golf-zone] img').evaluateAll(elements => elements.map(element => element.currentSrc || element.src))
  expect(sources.length).toBeGreaterThan(12)
  for (const source of sources) {
    expect(new URL(source).origin, source).toBe(new URL(BASE).origin)
  }
  const optimized = sources.filter(source => source.includes('/_next/image?'))
  expect(optimized.length).toBeGreaterThanOrEqual(19) // 12 month tiles + hero + 6 cards
  const approvedLocal = new Set([
    '/golf-media/emirates-golf-club-majlis-course-02.webp', '/golf-media/tpc-scottsdale-stadium-course-01.webp',
    '/golf-media/portmarnock-golf-club-02.webp', '/golf-media/muirfield-01.webp',
    '/golf-media/bethpage-black-01.webp', '/golf-media/oitavos-dunes-01.webp',
    '/golf-media/marco-simone-golf-country-club-01.webp',
  ])
  for (const source of optimized) {
    const original = new URL(source).searchParams.get('url')
    if (!original.startsWith('https://images.unsplash.com/')) expect(approvedLocal.has(original), original).toBe(true)
  }
})

test('the shortlist is announced politely and the skip link reaches the month picker', async ({ page, browserName }) => {
  await page.goto('/golf?month=2')
  const status = page.locator('[data-golf-zone] [role="status"]')
  await expect(status).toHaveCount(1)
  await expect(status).toHaveAttribute('aria-live', 'polite')
  await expect(status).toHaveAttribute('aria-atomic', 'true')
  await expect(status).toContainText('February')

  await page.locator('a[href="#month-picker"]').first().focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#month-picker')).toBeInViewport()
  await page.keyboard.press(tabKey(browserName))
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-golf-month'))
  expect(focused).not.toBeNull()
})

test('paper-surface labels keep readable contrast and hero action uses bright ink', async ({ page }) => {
  await page.goto('/golf?month=10')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  const measurements = await page.evaluate(() => {
    // Canvas parses computed CSS colours instead of mistaking oklab channels for RGB.
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const rgb = value => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = value; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3) }
    const lum = color => rgb(color).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
    const root = document.querySelector('[data-golf-zone]')
    const background = lum(getComputedStyle(root).backgroundColor)
    const labels = [...root.querySelectorAll('[class*="resultsHead"] p')].map(el => {
      const foreground = lum(getComputedStyle(el).color)
      return { text: el.textContent, ratio: (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05) }
    })
    const action = root.querySelector('[data-golf-hero] a[href="#month-picker"]')
    const nav = root.querySelector('nav[aria-label="Primary navigation"]')
    return {
      labels, heroAction: rgb(getComputedStyle(action).color),
      navBackground: rgb(getComputedStyle(nav).backgroundColor),
      navWordmark: rgb(getComputedStyle(nav.querySelector('[data-brand-name]')).color),
      navDescriptor: rgb(getComputedStyle(nav.querySelector('[data-brand-descriptor]')).color),
    }
  })
  expect(measurements.labels).toHaveLength(3)
  for (const label of measurements.labels) expect(label.ratio, label.text).toBeGreaterThanOrEqual(4.5)
  expect(measurements.heroAction).toEqual([224, 242, 155])
  // Bright cinematic branding must never inherit the shared light-mode nav paper.
  expect(measurements.navBackground).toEqual([12, 33, 26])
  expect(measurements.navWordmark).toEqual([243, 241, 233])
  expect(measurements.navDescriptor).toEqual([210, 222, 196])
})

for (const width of [320, 390, 639, 640, 959, 960, 1440, 1920]) {
  test(`golf image hints match measured painted widths at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/golf?month=10')
    await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
    const measurements = await page.evaluate(() => {
      const measure = (selector, scale) => {
        const img = document.querySelector(selector)
        const parts = img.sizes.split(',').map(p => p.trim())
        const selected = parts.find(part => {
          const match = part.match(/^(\((?:max|min)-width:[^)]+\))\s+(.+)$/)
          return !match || matchMedia(match[1]).matches
        })
        const cssWidth = selected.replace(/^\((?:max|min)-width:[^)]+\)\s+/, '')
        const probe = document.createElement('div'); probe.style.width = cssWidth
        document.body.append(probe)
        const hint = probe.getBoundingClientRect().width; probe.remove()
        return { hint, painted: img.parentElement.getBoundingClientRect().width * scale, sizes: img.sizes }
      }
      return [measure('button[data-golf-month] img', 1), measure('[data-golf-card] img', 1.03)]
    })
    for (const item of measurements) {
      expect(item.hint, item.sizes).toBeGreaterThanOrEqual(item.painted - 1)
      expect(item.hint, item.sizes).toBeLessThanOrEqual(item.painted + 2)
    }
  })
}

test('nothing overflows horizontally and the band keeps its targets usable', async ({ page }) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/golf?month=10')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `width ${width}`).toBeLessThanOrEqual(1)
    const months = page.locator('button[data-golf-month]')
    await expect(months).toHaveCount(12)
    for (let month = 1; month <= 12; month++) {
      const box = await page.locator(`button[data-golf-month="${month}"]`).boundingBox()
      expect(box.width, `month ${month} at ${width}`).toBeGreaterThanOrEqual(24)
      expect(box.height, `month ${month} at ${width}`).toBeGreaterThanOrEqual(24)
    }
  }
})
