import { test, expect } from './browser-fixture.mjs'
import { readFile } from 'node:fs/promises'

// Independent, approved course identity list: never inferred from client props.
const photos = {
  'bethpage-black': '01', 'chambers-bay': '01', 'crans-sur-sierre-golf-club-ballesteros': '01',
  'emirates-golf-club-majlis-course': '02', 'fontana-golf-club': '01', 'glen-abbey-golf-club': '01',
  'kennemer-golf-country-club': '01', 'marco-simone-golf-country-club': '01', 'millbrook-resort': '03',
  muirfield: '01', 'oitavos-dunes': '01', 'portmarnock-golf-club': '02', 'praia-d-el-rey': '01',
  'real-club-de-golf-el-prat': '01', 'torrey-pines-golf-course-south-course': '01', 'tpc-scottsdale-stadium-course': '01',
  'capilano-golf-and-country-club': '01', 'the-royal-melbourne-golf-club-west': '01',
  'al-maaden-golf': '01', 'keilir-golf-club': '01',
  'new-south-wales-golf-club': '01', 'wentworth-club-west': '01',
}
// A course without approved photography must render NO image at all: no
// destination scenery, no beach or skyline, and no generic golf stock.
const notes = JSON.parse(await readFile(new URL('../src/data/golfCourseNotes.json', import.meta.url), 'utf8'))
const leads = ['emirates-golf-club-majlis-course', 'tpc-scottsdale-stadium-course', 'royal-cape-golf-club', 'the-royal-melbourne-golf-club-west', 'portmarnock-golf-club', 'muirfield', 'keilir-golf-club', 'capilano-golf-and-country-club', 'bethpage-black', 'oitavos-dunes', 'steenberg-golf-club', 'new-south-wales-golf-club']
const ledger = JSON.parse(await readFile(new URL('../src/data/golfCourseMedia.json', import.meta.url), 'utf8'))
// Independently frozen expected names for the twelve monthly leads, so a wrong
// or generic heading cannot validate itself against the rendered text.
const LEAD_CHARACTER = [
  'Uphill approaches, water carries and sloping greens',
  'The par-three 16th becomes a tournament Coliseum',
  'Flat, tree-lined fairways and contoured greens',
  'Sandbelt doglegs, bold bunkers and approach angles',
  '27 holes across a narrow sandy peninsula',
  'Two opposing loops through East Lothian links',
  'Lava on the front nine; peninsula on the back',
  'Thompson bunkers through rainforest fairways',
  'Climbing approaches and imposing cross bunkers',
  'Atlantic-facing dunes and umbrella pines',
  'Cross bunkers and a stream-divided finish',
  'Rugged La Perouse cliffs above Botany Bay',
]
const LEAD_NAMES = [
  'Emirates Golf Club – Majlis Course', 'TPC Scottsdale – Stadium Course', 'Royal Cape Golf Club',
  'The Royal Melbourne Golf Club (West)', 'Portmarnock Golf Club', 'Muirfield', 'Keilir Golf Club',
  'Capilano Golf and Country Club', 'Bethpage Black', 'Oitavos Dunes', 'Steenberg Golf Club',
  'New South Wales Golf Club',
]
const tab = engine => engine === 'webkit' ? 'Alt+Tab' : 'Tab'
const kind = id => photos[id] ? 'Course photograph' : 'Course photo unavailable'
const tileKind = id => photos[id] ? 'Course photo' : 'Photo unavailable'
async function expectNoImagery(scope) {
  await expect(scope.locator('img')).toHaveCount(0)
}
function imagePath(id) {
  return photos[id] ? `/golf-media/${id}-${photos[id]}.webp` : null
}
async function checkImage(image, id) {
  await image.scrollIntoViewIfNeeded()
  // A reused card can still have the previous month's currentSrc when its new
  // src/srcset props have committed. Wait for this exact asset AND native load,
  // then require source selection to settle before decode (WebKit aborts an
  // in-flight decode if a lazy source is selected during that call).
  let priorReadySource = null
  await expect.poll(async () => {
    const state = await image.evaluate(img => ({ source: img.currentSrc, complete: img.complete, width: img.naturalWidth }))
    const ready = !!state.source && state.complete && state.width > 0 && new URL(state.source).searchParams.get('url') === imagePath(id)
    if (!ready) { priorReadySource = null; return false }
    const stable = state.source === priorReadySource
    priorReadySource = state.source
    return stable
  }).toBe(true)
  await image.evaluate(img => img.decode())
  const result = await image.evaluate(img => ({ url: img.currentSrc, width: img.naturalWidth, loading: img.loading }))
  expect(result.width).toBeGreaterThan(0)
  const url = new URL(result.url)
  expect(url.origin).toBe(new URL(process.env.BROWSER_BASE_URL || 'http://localhost:3001').origin)
  expect(url.searchParams.get('url')).toBe(imagePath(id))
  return result
}
async function credit(scope, id) {
  const photo = ledger.find(r => r.courseId === id).photos[0]
  if (!photo) return
  await expect(scope).toContainText(photo.author)
  await expect(scope.locator(`a[href="${photo.sourcePage}"]`)).toHaveCount(1)
  await expect(scope.locator(`a[href="${photo.licenseUrl}"]`)).toHaveText(photo.license)
  const readability = await scope.evaluate(el => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const rgba = value => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = value; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data] }
    const lum = color => color.slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
    let surface = el
    while (surface && rgba(getComputedStyle(surface).backgroundColor)[3] !== 255) surface = surface.parentElement
    if (!surface) throw new Error('Credit requires an opaque, readable surface')
    const fg = lum(rgba(getComputedStyle(el).color)), bg = lum(rgba(getComputedStyle(surface).backgroundColor))
    return { ratio: (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05), font: parseFloat(getComputedStyle(el).fontSize) }
  })
  expect(readability.ratio).toBeGreaterThanOrEqual(4.5)
  expect(readability.font).toBeGreaterThanOrEqual(13)
  for (const link of await scope.locator('a').all()) {
    expect(await link.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(13)
    expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(24)
  }
}

test('finder exposes the approved October course photograph', async ({ page }) => {
  await page.goto('/golf?month=10')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  const hero = page.locator('[data-golf-hero-image]')
  await expect(hero).toHaveAttribute('src', /oitavos-dunes-01/)
  await checkImage(hero, 'oitavos-dunes')
})

test('finder cards have a direct, truthfully named course-visuals link', async ({ page }) => {
  await page.goto('/golf?month=7')
  const card = page.locator('[data-golf-card="keilir-golf-club"]')
  await expect(card.locator('a[href="/golf/keilir-golf-club#course-visuals"]')).toHaveText(/hole tour.*gallery/i)
})

for (const width of [320, 390, 1440]) for (const theme of ['light', 'dark']) {
  test(`all month photo identities, credits and native controls at ${width}px ${theme}`, async ({ page, browserName }) => {
    test.setTimeout(180_000)
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
    const bytes = { optimizedResponses: 0, responseBodyBytes: 0 }
    const pending = []
    page.on('response', response => {
      if (response.url().includes('/_next/image?') && response.status() === 200) {
        pending.push(response.body().then(body => { bytes.optimizedResponses++; bytes.responseBodyBytes += body.length }).catch(() => {}))
      }
    })
    await page.goto('/golf?month=1')
    await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
    const previewCredits = page.locator('[data-golf-preview-credits]')
    await previewCredits.locator('summary').click()
    for (let month = 1; month <= 12; month++) {
      const id = leads[month - 1]
      const button = page.locator(`button[data-golf-month="${month}"]`)
      await expect(button).toHaveAttribute('aria-description', new RegExp(`${kind(id)}`))
      await expect(button.locator('[data-golf-preview-kind]')).toHaveText(tileKind(id))
      await expect(button.locator('[data-golf-preview-course]')).toHaveText(LEAD_NAMES[month - 1])
      if (photos[id]) await checkImage(button.locator('img'), id)
      else await expectNoImagery(button)
      if (photos[id]) await credit(previewCredits.locator(`[data-golf-preview-credit="${month}"]`), id)
      await button.focus()
      await page.keyboard.press(month % 2 ? 'Enter' : 'Space')
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await page.keyboard.press(tab(browserName))
      if (month < 12) await expect(page.locator(`button[data-golf-month="${month + 1}"]`)).toBeFocused()
      else await expect(previewCredits.locator('summary')).toBeFocused()
      const featured = ledger.find(r => r.courseId === id)
      await expect(page.locator('h1')).toHaveText(LEAD_NAMES[month - 1])
      await expect(page.locator('[data-golf-hero-character]')).toHaveText(LEAD_CHARACTER[month - 1])
      if (photos[id]) {
        const hero = page.locator('[data-golf-hero-image]')
        await checkImage(hero, id)
        await expect(hero).toHaveAttribute('loading', 'eager')
        await expect(hero).toHaveAttribute('fetchpriority', 'high')
        await expect(page.locator('[data-golf-hero-credit]')).toContainText(kind(id))
        await credit(page.locator('[data-golf-hero-credit]'), id)
      } else {
        // The hero section also contains the navigation brand mark, so assert the
        // hero photograph element itself is absent rather than counting all images.
        await expect(page.locator('[data-golf-hero-image]')).toHaveCount(0)
        await expect(page.locator('[data-golf-hero-credit]')).toContainText(kind(id))
      }
      expect(featured, `${id}: media ledger record`).toBeTruthy()
      const cards = page.locator('[data-golf-card]')
      await expect(cards).toHaveCount(6)
      for (const card of await cards.all()) {
        const cardId = await card.getAttribute('data-golf-card')
        await expect(card.locator('[data-golf-photo-kind]')).toHaveText(kind(cardId))
        await expect(card.locator('[data-golf-figure-title]')).toHaveText(await card.locator('h3').innerText())
        // The overlay carries a specific, sourced line — never a bare photo label
        // and never generic travel marketing.
        const phrase = await card.locator('[data-golf-figure-phrase]').innerText()
        expect(phrase.length).toBeGreaterThan(20)
        expect(phrase).not.toMatch(/unforgettable|world-?class|must-?play|paradise|stunning|iconic|hidden gem|breathtaking/i)
        if (cardId === id) await expect(card.locator('[data-golf-figure-phrase]')).toHaveText(LEAD_CHARACTER[month - 1])
        if (photos[cardId]) {
          await checkImage(card.locator('img'), cardId)
          await expect(card.locator('img')).toHaveAttribute('loading', 'lazy')
          await credit(card.locator('[data-golf-photo-credit]'), cardId)
        } else {
          await expectNoImagery(card)
        }
        const note = notes.find(note => note.courseId === cardId && note.month === month)
        expect(note, `${cardId}/${month}: exact frozen seasonal note`).toBeTruthy()
        await expect(card.locator('[data-golf-why]')).toHaveText(note.why)
        await expect(card.locator('[data-golf-tradeoff]')).toHaveText(note.tradeoff)
        const record = ledger.find(r => r.courseId === cardId)
        const resource = card.locator(`a[href="/golf/${cardId}#course-visuals"]`)
        await expect(resource).toHaveCount(1)
        if (record.map) await expect(resource).toContainText('routing diagram')
        if (record.layout) await expect(resource).toContainText({ 'hole-tour': 'published hole tour', 'routing-map': 'published map', 'hole-diagrams': 'published hole diagrams', 'video-tour': 'published video tour', scorecard: 'published scorecard' }[record.layout.kind])
        await expect(card.getByRole('link', { name: `Read the ${await card.locator('h3').innerText()} golf guide`, exact: true })).toHaveCount(1)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
      if ([7, 10].includes(month)) await page.screenshot({ path: `${test.info().outputDir}/${month}-${width}-${theme}.png`, fullPage: true })
    }
    await Promise.all(pending)
    await test.info().attach('actual-journey-image-bytes', { body: JSON.stringify(bytes), contentType: 'application/json' })
  })
}

for (const width of [320, 390, 1440]) test(`direct visuals fragment establishes visible sequential focus at ${width}px`, async ({ page, browserName }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/golf?month=10')
  const link = page.locator('[data-golf-card="oitavos-dunes"] a[href="/golf/oitavos-dunes#course-visuals"]')
  await link.focus(); await page.keyboard.press('Enter')
  const target = page.locator('#course-visuals')
  await expect(target).toBeInViewport()
  await expect(target).toHaveAttribute('tabindex', '-1')
  await page.evaluate(async () => {
    let prior = -1, stable = 0
    for (let i = 0; i < 150 && stable < 8; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve))
      stable = Math.abs(scrollY - prior) < .5 ? stable + 1 : 0; prior = scrollY
    }
  })
  await expect(target).toBeFocused()
  await page.keyboard.press(tab(browserName))
  const next = page.locator(':focus')
  await expect(next).toHaveAttribute('href', /^https:\/\//)
  await expect(next).toBeInViewport()
  const geometry = await next.evaluate(el => ({ top: el.getBoundingClientRect().top, nav: document.querySelector('nav')?.getBoundingClientRect().bottom ?? 0 }))
  expect(geometry.top).toBeGreaterThanOrEqual(Math.max(0, geometry.nav))
})

for (const width of [320, 390, 1440]) for (const theme of ['light', 'dark']) test(`collapsed month previews visibly identify every photo at ${width}px ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
  await page.goto('/golf?month=10')
  await expect(page.locator('[data-golf-zone]')).toHaveAttribute('data-ready', 'true')
  if (theme === 'dark') await expect(page.locator('html')).toHaveClass(/dark/)
  else await expect(page.locator('html')).not.toHaveClass(/dark/)
  const credits = page.locator('[data-golf-preview-credits]')
  await expect(credits).not.toHaveAttribute('open')
  for (let month = 1; month <= 12; month++) {
    const id = leads[month - 1]
    const button = page.locator(`button[data-golf-month="${month}"]`)
    const label = button.locator('[data-golf-preview-kind]')
    await expect(button).toHaveAccessibleName(new Date(2026, month - 1).toLocaleString('en', { month: 'long' }))
    await expect(label).toHaveText(tileKind(id))
    await expect(button.locator('[data-golf-preview-course]')).toBeVisible()
    await label.scrollIntoViewIfNeeded()
    await expect(label).toBeVisible()
    await expect(label).toBeInViewport()
    const geometry = await label.evaluate(el => {
      const label = el.getBoundingClientRect(), button = el.closest('button').getBoundingClientRect()
      const style = getComputedStyle(el)
      return { inside: label.top >= button.top && label.bottom <= button.bottom && label.left >= button.left && label.right <= button.right, font: parseFloat(style.fontSize), color: style.color, background: style.backgroundColor }
    })
    expect(geometry.inside).toBe(true)
    expect(geometry.font).toBeGreaterThanOrEqual(13)
    expect(geometry.color).toBe('rgb(243, 241, 233)')
    expect(geometry.background).toBe('rgb(12, 33, 26)')
    if (photos[id]) await checkImage(button.locator('img'), id)
    else await expectNoImagery(button)
  }
  await expect(credits).not.toHaveAttribute('open')
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
  await page.locator('[data-golf-month="1"]').scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${test.info().outputDir}/collapsed-month-preview-labels-${width}-${theme}.png`, fullPage: true })
})
