import { test, expect } from './browser-fixture.mjs'
import { readFile } from 'node:fs/promises'

// Independent, approved course identity list: never inferred from client props.
const photos = {
  'bethpage-black': '01', 'chambers-bay': '01', 'crans-sur-sierre-golf-club-ballesteros': '01',
  'emirates-golf-club-majlis-course': '02', 'fontana-golf-club': '01', 'glen-abbey-golf-club': '01',
  'kennemer-golf-country-club': '01', 'marco-simone-golf-country-club': '01', 'millbrook-resort': '03',
  muirfield: '01', 'oitavos-dunes': '01', 'portmarnock-golf-club': '02', 'praia-d-el-rey': '01',
  'real-club-de-golf-el-prat': '01', 'torrey-pines-golf-course-south-course': '01', 'tpc-scottsdale-stadium-course': '01',
}
// Destination IDs frozen from the approved, unchanged media-release tree.
// A destination fallback is never an arbitrary Unsplash image or nearby club.
const fallbackPhotos = {
  'al-maaden-golf': '/photo-1597212618440-806262de4f6b',
  'bali-national-golf-club': '/photo-1537996194471-e657df975ab4',
  'brautarholt-golf-club': '/photo-1615130767419-e9ff3afa5a15',
  'bro-hof-slott-stadium': '/photo-1588653818221-2651ec1a6423',
  'capilano-golf-and-country-club': '/photo-1559511260-66a654ae982a',
  'cog-hill-no-4-dubsdread': '/photo-1494522855154-9297ac14b55f',
  'jack-s-point': '/photo-1600466403153-50193d187dde',
  'katameya-heights-golf-tennis-resort': '/photo-1572252009286-268acec5ca0a',
  'keilir-golf-club': '/photo-1615130767419-e9ff3afa5a15',
  'kyt-j-golf-south-east': '/photo-1538332576228-eb5b4c4de6f5',
  'montgomerie-maxx-royal': '/photo-1648325129746-abcc1b872380',
  'new-south-wales-golf-club': '/photo-1506973035872-a4ec16b8e8d9',
  'royal-cape-golf-club': '/photo-1580060839134-75a5edca2e99',
  'royal-golf-marrakech-old-course': '/photo-1597212618440-806262de4f6b',
  'sentosa-golf-club-serapong': '/photo-1525625293386-3f8f99389edd',
  'steenberg-golf-club': '/photo-1580060839134-75a5edca2e99',
  'thai-country-club': '/photo-1508009603885-50cf7c579365',
  'the-royal-melbourne-golf-club-west': '/photo-1514395462725-fb4566210144',
  'tpc-summerlin': '/photo-1581351721010-8cf859cb14a4',
  'walton-heath-golf-club-old': '/photo-1513635269975-59663e0ac1ad',
  'wentworth-club-west': '/photo-1513635269975-59663e0ac1ad',
}
const notes = JSON.parse(await readFile(new URL('../src/data/golfCourseNotes.json', import.meta.url), 'utf8'))
const leads = ['emirates-golf-club-majlis-course', 'tpc-scottsdale-stadium-course', 'royal-cape-golf-club', 'the-royal-melbourne-golf-club-west', 'portmarnock-golf-club', 'muirfield', 'keilir-golf-club', 'capilano-golf-and-country-club', 'bethpage-black', 'oitavos-dunes', 'steenberg-golf-club', 'new-south-wales-golf-club']
const ledger = JSON.parse(await readFile(new URL('../src/data/golfCourseMedia.json', import.meta.url), 'utf8'))
const tab = engine => engine === 'webkit' ? 'Alt+Tab' : 'Tab'
const kind = id => photos[id] ? 'Course photograph' : 'Destination photograph'
async function checkImage(image, id) {
  await image.scrollIntoViewIfNeeded()
  // A reused card can still have the previous month's currentSrc when its new
  // src/srcset props have committed. Wait for this exact asset AND native load,
  // then require source selection to settle before decode (WebKit aborts an
  // in-flight decode if a lazy source is selected during that call).
  await expect.poll(() => image.evaluate(async (img, expected) => {
    const source = img.currentSrc
    if (!source || !img.complete || !img.naturalWidth) return false
    const raw = new URL(source).searchParams.get('url')
    const matches = expected.photo ? raw === expected.photo : raw && new URL(raw).hostname === 'images.unsplash.com' && new URL(raw).pathname === expected.destination
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    return !!matches && img.complete && img.naturalWidth > 0 && img.currentSrc === source
  }, { photo: photos[id] ? `/golf-media/${id}-${photos[id]}.webp` : null, destination: fallbackPhotos[id] })).toBe(true)
  await image.evaluate(img => img.decode())
  const result = await image.evaluate(img => ({ url: img.currentSrc, width: img.naturalWidth, loading: img.loading }))
  expect(result.width).toBeGreaterThan(0)
  const url = new URL(result.url)
  expect(url.origin).toBe(new URL(process.env.BROWSER_BASE_URL || 'http://localhost:3001').origin)
  const src = url.searchParams.get('url')
  if (photos[id]) expect(src).toBe(`/golf-media/${id}-${photos[id]}.webp`)
  else {
    expect(new URL(src).origin).toBe('https://images.unsplash.com')
    expect(new URL(src).pathname).toBe(fallbackPhotos[id])
  }
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
      await checkImage(button.locator('img'), id)
      if (photos[id]) await credit(previewCredits.locator(`[data-golf-preview-credit="${month}"]`), id)
      await button.focus()
      await page.keyboard.press(month % 2 ? 'Enter' : 'Space')
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await page.keyboard.press(tab(browserName))
      if (month < 12) await expect(page.locator(`button[data-golf-month="${month + 1}"]`)).toBeFocused()
      else await expect(previewCredits.locator('summary')).toBeFocused()
      const hero = page.locator('[data-golf-hero-image]')
      await checkImage(hero, id)
      await expect(hero).toHaveAttribute('loading', 'eager')
      await expect(hero).toHaveAttribute('fetchpriority', 'high')
      await expect(page.locator('[data-golf-hero-credit]')).toContainText(kind(id))
      await credit(page.locator('[data-golf-hero-credit]'), id)
      const cards = page.locator('[data-golf-card]')
      await expect(cards).toHaveCount(6)
      for (const card of await cards.all()) {
        const cardId = await card.getAttribute('data-golf-card')
        await expect(card.locator('[data-golf-photo-kind]')).toHaveText(kind(cardId))
        await checkImage(card.locator('img'), cardId)
        await expect(card.locator('img')).toHaveAttribute('loading', 'lazy')
        await credit(card.locator('[data-golf-photo-credit]'), cardId)
        const note = notes.find(note => note.courseId === cardId && note.month === month)
        expect(note, `${cardId}/${month}: exact frozen seasonal note`).toBeTruthy()
        await expect(card.locator('[data-golf-why]')).toHaveText(note.why)
        await expect(card.locator('[data-golf-tradeoff]')).toHaveText(note.tradeoff)
        const record = ledger.find(r => r.courseId === cardId)
        const resource = card.locator(`a[href="/golf/${cardId}#course-visuals"]`)
        await expect(resource).toHaveCount(1)
        if (record.map) await expect(resource).toContainText('routing diagram')
        if (record.layout) await expect(resource).toContainText({ 'hole-tour': 'published hole tour', 'routing-map': 'published map', scorecard: 'published scorecard' }[record.layout.kind])
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
