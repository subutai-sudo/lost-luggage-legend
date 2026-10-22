import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { test, expect } from './browser-fixture.mjs'

// Independent oracle: read only source literals, never import/transpile the
// discovery helper or reuse its filtering, ordering, photo or URL functions.
// Fail closed if the data stops being literal instead of silently losing cases.
async function exportedInitializer(path, name) {
  const source = ts.createSourceFile(path, await readFile(new URL(path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
  assert.equal(source.parseDiagnostics.length, 0, `${path} must parse`)
  const declarations = source.statements
    .filter(statement => ts.isVariableStatement(statement) && statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword))
    .flatMap(statement => [...statement.declarationList.declarations])
    .filter(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === name)
  assert.equal(declarations.length, 1, `one exported ${name}`)
  assert.ok(declarations[0].initializer, `${name} must have an initializer`)
  return declarations[0].initializer
}

function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) {
    const result = Object.create(null)
    for (const property of node.properties) {
      assert.ok(ts.isPropertyAssignment(property), 'oracle requires ordinary literal properties')
      const name = property.name
      assert.ok(ts.isIdentifier(name) || ts.isStringLiteral(name), 'oracle requires static property names')
      assert.ok(!Object.hasOwn(result, name.text), `duplicate literal key ${name.text}`)
      result[name.text] = literal(property.initializer)
    }
    return result
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  throw new Error(`Unsupported source literal: ${ts.SyntaxKind[node.kind]}`)
}

const guides = literal(await exportedInitializer('../src/data/destinationGuides.ts', 'DESTINATION_GUIDES'))
const bestMonths = literal(await exportedInitializer('../src/lib/seasonalHelpers.ts', 'BEST_MONTHS'))
const guideById = new Map(guides.map(guide => [guide.id, guide]))
assert.equal(guideById.size, guides.length, 'source guide IDs must be unique')
assert.ok(guides.length >= 12, 'source oracle must not be an empty/partial fixture')
for (const guide of guides) {
  for (const key of ['id', 'slug', 'title', 'heroImage']) assert.equal(typeof guide[key], 'string', `${guide.id}.${key}`)
  assert.ok(Array.isArray(bestMonths[guide.id]), `${guide.id} must have editorial month windows`)
  assert.ok(bestMonths[guide.id].every(month => Number.isInteger(month) && month >= 1 && month <= 12))
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// Approved cinematic prototype: sketches/002-cinematic-calendar/index.html.
// These are editorial choices, not a reimplementation of production ranking.
const monthlyLead = ['maldives', 'cape-town', 'kyoto', 'marrakech', 'amalfi-coast', 'santorini', 'bali', 'maasai-mara', 'iceland', 'lisbon', 'mexico-city', 'sydney']
const approvedPhotoOverrides = {
  lisbon: 'https://images.unsplash.com/photo-1754151630904-da4334bddfbf',
  'amalfi-coast': 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e',
}
const eligibleFor = month => guides.filter(guide => bestMonths[guide.id].includes(month))
const expectedPhoto = guide => approvedPhotoOverrides[guide.id] ?? guide.heroImage

function photoIdentity(src, baseURL) {
  assert.ok(src, 'photo must have a nonempty source')
  let url = new URL(src, baseURL)
  // Accept both native images and Next's optimizer without prescribing sizes,
  // quality or request ordering. Identity is the actual approved photograph.
  for (let depth = 0; depth < 3 && url.pathname === '/_next/image'; depth++) {
    assert.ok(url.searchParams.get('url'), 'optimized image must reference a source')
    url = new URL(url.searchParams.get('url'), baseURL)
  }
  return url.origin + url.pathname
}

function expectGuideURL(href, guide, baseURL) {
  expect(href, `${guide.id}: nonempty guide link`).toBeTruthy()
  const url = new URL(href, baseURL)
  expect([new URL(baseURL).origin, 'https://lostluggagelegend.com']).toContain(url.origin)
  expect(url.pathname).toBe(`/guides/${guide.slug}`)
  expect(url.search).toBe('')
  expect(url.hash).toBe('')
}

async function openHome(page, suffix = '?month=10') {
  // Do not make semantic assertions wait on third-party fonts/photos. Real
  // photo decoding is covered separately, with the shared fixture unmodified.
  await page.goto(`/${suffix}`, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('button[data-month]')).toHaveCount(12)
  // The client exposes this readiness flag after URL/local-month hydration.
  // Waiting for it avoids clicks on server HTML before React owns the buttons.
  await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
}

async function expectMonth(page, month) {
  const name = months[month - 1]
  const eligible = eligibleFor(month)
  const featured = guideById.get(monthlyLead[month - 1])
  assert.ok(featured && bestMonths[featured.id].includes(month), `${name}: approved lead must be eligible`)
  await expect(page.locator('[data-selected-month]')).toHaveText(name)
  await expect(page.locator('[data-count]')).toHaveText(String(eligible.length))
  await expect(page.locator('[data-feature-title]')).toHaveText(featured.title)
  await expect(page.locator('[data-results] article[data-id]')).toHaveCount(6)
  await expect(page.locator('button[data-month][aria-pressed="true"]')).toHaveCount(1)
  await expect(page.locator(`button[data-month="${month}"]`)).toHaveAttribute('aria-pressed', 'true')

  const state = await page.evaluate(() => ({
    buttons: [...document.querySelectorAll('button[data-month]')].map(button => ({
      month: Number(button.dataset.month), pressed: button.getAttribute('aria-pressed'),
    })),
    cards: [...document.querySelectorAll('[data-results] article[data-id]')].map(card => ({
      id: card.dataset.id,
      text: card.textContent,
      // Published source citations are checked against their exact catalog in
      // seasonal-reasons.browser.test.mjs; every other card anchor stays a guide link.
      links: [...card.querySelectorAll('a:not([data-seasonal-source])')].map(link => link.getAttribute('href')),
    })),
    hero: document.querySelector('img[data-hero-image]')?.getAttribute('src'),
    featureLink: document.querySelector('[data-feature-title]')?.closest('a')?.getAttribute('href'),
  }))
  expect(state.buttons.map(button => button.month).sort((a, b) => a - b)).toEqual(months.map((_, index) => index + 1))
  for (const button of state.buttons) expect(button.pressed).toBe(String(button.month === month))
  const ids = state.cards.map(card => card.id)
  expect(new Set(ids).size, `${name}: six unique cards`).toBe(6)
  expect(ids, `${name}: featured destination belongs to the shortlist`).toContain(featured.id)
  const eligibleIDs = new Set(eligible.map(guide => guide.id))
  for (const card of state.cards) {
    expect(eligibleIDs.has(card.id), `${name}: ${card.id} must be independently in season`).toBe(true)
    const guide = guideById.get(card.id)
    expect(card.text).toContain(guide.title)
    expect(card.links.length, `${card.id}: image, title and read-guide links`).toBe(3)
    for (const href of card.links) expectGuideURL(href, guide, page.url())
  }
  expectGuideURL(state.featureLink, featured, page.url())
  await expect(page.locator('img[data-hero-image]')).toHaveCount(1)
  expect(await page.locator('img[data-hero-image]').getAttribute('alt')).toContain(featured.title)
  const selectedThumb = page.locator(`button[data-month="${month}"] img`)
  await expect(selectedThumb).toHaveCount(1)
  const thumb = photoIdentity(await selectedThumb.getAttribute('src'), page.url())
  expect(thumb).toBe(photoIdentity(expectedPhoto(featured), page.url()))
  expect(photoIdentity(state.hero, page.url()), `${name}: thumbnail and featured scene must agree`).toBe(thumb)
}

test('twelve native month buttons expose full names and the approved destination photographs', async ({ page }) => {
  await openHome(page)
  await expect(page.locator('[data-month]')).toHaveCount(12)
  for (const [index, name] of months.entries()) {
    const month = index + 1
    const guide = guideById.get(monthlyLead[index])
    const button = page.locator(`button[data-month="${month}"]`)
    await expect(button).toHaveAccessibleName(name)
    await expect(button).toBeEnabled()
    await expect(button).toHaveAttribute('type', 'button')
    await expect(button).toHaveAttribute('data-preview-id', guide.id)
    const image = button.locator('img')
    await expect(image).toHaveCount(1)
    expect(photoIdentity(await image.getAttribute('src'), page.url()), `${name}: approved frame`).toBe(photoIdentity(expectedPhoto(guide), page.url()))
  }
})

// Four selections per test keep mobile actionability and assertion costs out of
// one shared 45-second twelve-month stress test. No image-decoding loop here.
for (const batch of [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) {
  test(`${months[batch[0] - 1]}–${months[batch.at(-1) - 1]}: six unique eligible guides, full totals, links and matching feature`, async ({ page }) => {
    await openHome(page, `?month=${batch[0] === 1 ? 12 : 1}`)
    for (const month of batch) {
      await page.locator(`button[data-month="${month}"]`).click()
      await expectMonth(page, month)
      await expect.poll(() => new URL(page.url()).searchParams.get('month')).toBe(String(month))
    }
  })
}

async function expectDecoded(images) {
  // Only the supplied initial-screen assets, never the complete guide catalog.
  for (const image of images) await image.scrollIntoViewIfNeeded()
  await expect.poll(async () => Promise.all(images.map(image => image.evaluate(img => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0))), {
    timeout: 20_000,
    message: 'Every requested photograph must load real image bytes',
  }).toEqual(images.map(() => true))
  for (const image of images) {
    expect(await image.evaluate(async img => {
      try { await img.decode(); return img.naturalWidth > 0 && img.naturalHeight > 0 } catch { return false }
    }), 'Native image decoding must succeed').toBe(true)
  }
}

for (const batch of [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]]) {
  test(`real month thumbnails decode: ${months[batch[0] - 1]}–${months[batch.at(-1) - 1]}`, async ({ page }) => {
    await openHome(page)
    const images = batch.map(month => page.locator(`button[data-month="${month}"] img`))
    for (const image of images) await expect(image).toHaveCount(1)
    await expectDecoded(images)
  })
}

test('initial hero and six visible shortlist photographs decode, not all 100 guides', async ({ page }) => {
  await openHome(page)
  await expectMonth(page, 10)
  const hero = page.locator('img[data-hero-image]')
  await expect(hero).toHaveCount(1)
  const cards = page.locator('[data-results] article[data-id] img')
  await expect(cards).toHaveCount(6)
  await expectDecoded([hero, ...await cards.all()])
})

test('explicit month survives reload and browser back; selections replace rather than grow history', async ({ page }) => {
  await openHome(page, '?month=1&ref=calendar-regression')
  await expectMonth(page, 1)
  const initialLength = await page.evaluate(() => history.length)
  for (const month of [5, 12]) {
    await page.locator(`button[data-month="${month}"]`).click()
    await expectMonth(page, month)
    await expect.poll(() => new URL(page.url()).searchParams.get('month')).toBe(String(month))
    expect(new URL(page.url()).searchParams.get('ref')).toBe('calendar-regression')
    expect(await page.evaluate(() => history.length)).toBe(initialLength)
  }
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expectMonth(page, 12)
  await page.goto('/guides', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/guides\/?$/)
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await expect.poll(() => new URL(page.url()).searchParams.get('month')).toBe('12')
  await expectMonth(page, 12)
})

for (const [timezoneId, localMonth] of [['Pacific/Honolulu', 2], ['Pacific/Kiritimati', 3]]) {
  test.describe(`visitor timezone ${timezoneId}`, () => {
    test.use({ timezoneId })
    test('no query hydrates to the visitor-local month, while a valid query wins', async ({ page }) => {
      // Fixed Date only: timers, RAF, hydration and image decoding keep running.
      // One instant lies in different months in these two visitor timezones.
      await page.clock.setFixedTime(new Date('2030-03-01T00:30:00Z'))
      await openHome(page, '')
      expect(await page.evaluate(() => new Date().getMonth() + 1)).toBe(localMonth)
      await expectMonth(page, localMonth)
      await openHome(page, '?month=11')
      await expectMonth(page, 11)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await expectMonth(page, 11)
    })
  })
}

for (const invalid of ['0', '13', '2.5', 'not-a-month']) {
  test(`invalid month=${invalid} falls back to the local current month`, async ({ page }) => {
    await page.clock.setFixedTime(new Date('2030-07-15T12:00:00Z'))
    await openHome(page, `?month=${encodeURIComponent(invalid)}`)
    await expectMonth(page, 7)
  })
}

test('native month keyboard activation and modal Escape/close restore focus', async ({ page }) => {
  await openHome(page, '?month=1')
  await expectMonth(page, 1)
  for (const [month, key] of [[5, 'Enter'], [6, 'Space']]) {
    const button = page.locator(`button[data-month="${month}"]`)
    await button.focus()
    await page.keyboard.press(key)
    await expectMonth(page, month)
    await expect(button).toBeFocused()
  }
  const trigger = page.locator('button[data-method]')
  const dialog = page.locator('dialog')
  await expect(trigger).toHaveCount(1)
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAccessibleName(/\S/)
  expect(await dialog.evaluate(element => element.open && element.matches(':modal'))).toBe(true)
  await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  // Native dialogs may hand Tab focus to browser chrome. Test their required
  // modal semantics and restoration, not an unsupported DOM-only focus trap.
  const close = dialog.locator('button[data-close]')
  await expect(close).toHaveAccessibleName(/close/i)
  const closeBounds = await close.boundingBox()
  expect(closeBounds.width).toBeGreaterThanOrEqual(44)
  expect(closeBounds.height).toBeGreaterThanOrEqual(44)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Space')
  await expect(dialog).toBeVisible()
  await close.focus()
  await page.keyboard.press('Enter')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('home is discovery only: no embedded booking inputs or map; downstream links remain downstream', async ({ page }) => {
  await openHome(page)
  await expect(page.locator('#compare-prices, #flight-origin, #flight-destination, #flight-depart, #flight-return, #hotel-destination, #hotel-checkin, #hotel-checkout')).toHaveCount(0)
  await expect(page.locator('input[type="date"], .rsm-svg, .rsm-geography, .rsm-marker')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Open the .+ travel guide$/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^(Search|Compare) (flights|hotels)$/i })).toHaveCount(0)
  // Secondary planning/map links are optional; if present they must not point
  // to the removed homepage sections or to unrelated destinations.
  const secondary = await page.locator('a').evaluateAll(links => links
    .map(link => ({ href: link.getAttribute('href'), text: link.textContent || '' }))
    .filter(link => /compare-prices|^\/plan(?:[?#]|$)|^\/explore(?:[?#]|$)/.test(link.href || '') || /\b(plan a trip|compare prices|explore (?:the )?map|world map)\b/i.test(link.text)))
  for (const link of secondary) {
    const url = new URL(link.href, page.url())
    expect(url.origin).toBe(new URL(page.url()).origin)
    expect(['/plan', '/explore']).toContain(url.pathname)
    if (url.pathname === '/plan') {
      expect(['', '#compare-prices']).toContain(url.hash)
      if (/compare prices/i.test(link.text) || /compare-prices/.test(link.href)) expect(url.hash).toBe('#compare-prices')
    } else expect(url.hash).toBe('')
  }
})

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} layout`, () => {
    test.use({ colorScheme: theme })
    for (const width of [320, 390, 768, 1440]) {
      test(`${width}px: no horizontal overflow, unclipped month labels and 44px calendar controls`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        // ThemeProvider deliberately defaults to light rather than following
        // OS preference. Seed its actual preference, not an artificial class.
        await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
        await openHome(page)
        await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark')
        await page.evaluate(() => document.fonts.ready)
        const layout = await page.evaluate(names => {
          const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
          const controls = [...document.querySelectorAll('button[data-month], button[data-method]')].map(button => {
            const bounds = button.getBoundingClientRect()
            const name = names[Number(button.dataset.month) - 1]
            const labels = []
            if (name) {
              const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT)
              while (walker.nextNode()) {
                const node = walker.currentNode
                if (node.textContent.trim() !== name) continue
                const range = document.createRange()
                range.selectNodeContents(node)
                const rects = [...range.getClientRects()]
                let clipped = rects.length === 0 || rects.some(rect => rect.width === 0 || rect.height === 0 || rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1)
                for (let ancestor = node.parentElement; ancestor && ancestor !== document.body && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
                  const style = getComputedStyle(ancestor)
                  const box = ancestor.getBoundingClientRect()
                  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) clipped = true
                  for (const rect of rects) {
                    if (style.overflowX !== 'visible' && (rect.left < box.left - 1 || rect.right > box.right + 1)) clipped = true
                    if (style.overflowY !== 'visible' && (rect.top < box.top - 1 || rect.bottom > box.bottom + 1)) clipped = true
                  }
                }
                labels.push({ text: node.textContent.trim(), clipped })
              }
            }
            return { name: name || 'method trigger', bounds: bounds.toJSON(), labels }
          })
          return { overflow, viewport: document.documentElement.clientWidth, controls }
        }, months)
        expect(layout.overflow).toBeLessThanOrEqual(layout.viewport + 1)
        expect(layout.controls).toHaveLength(13)
        for (const control of layout.controls) {
          expect(control.bounds.left, `${control.name}: left edge`).toBeGreaterThanOrEqual(-1)
          expect(control.bounds.right, `${control.name}: right edge`).toBeLessThanOrEqual(layout.viewport + 1)
          expect(control.bounds.width, `${control.name}: touch width`).toBeGreaterThanOrEqual(44)
          expect(control.bounds.height, `${control.name}: touch height`).toBeGreaterThanOrEqual(44)
          if (control.name !== 'method trigger') {
            expect(control.labels, `${control.name}: full visible month label`).toHaveLength(1)
            expect(control.labels[0].clipped, `${control.name}: label must not be clipped/ellipsized/hidden`).toBe(false)
          }
        }
      })
    }
  })
}

test('old homepage booking bookmarks reach the downstream date-entry form', async ({ page }) => {
  await page.goto('/#compare-prices')
  await expect(page).toHaveURL(/\/plan#compare-prices$/)
  await expect(page.locator('#compare-prices')).toBeInViewport()
  await expect(page.getByLabel('Depart', { exact: true })).toBeVisible()
})

test.describe('server-rendered fallback', () => {
  test.use({ javaScriptEnabled: false })
  test('guide discovery and a fallback index link work without hydration', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('button[data-month]')).toHaveCount(12)
    await expect(page.locator('[data-results] article[data-id]')).toHaveCount(6)
    const fallback = page.getByRole('link', { name: 'Browse all destination guides instead' })
    await expect(fallback).toBeVisible()
    await expect(fallback).toHaveAttribute('href', '/guides')
    await fallback.click()
    await expect(page).toHaveURL(/\/guides\/?$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Destination guides.')
    await expect(page.locator('[data-guide-card]')).toHaveCount(guides.length)
  })
})

test.describe('reduced motion preference', () => {
  test.use({ reducedMotion: 'reduce' })
  test('calendar interactions do not produce sustained CSS motion', async ({ page }) => {
    await openHome(page, '?month=1')
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
    await page.locator('button[data-month="10"]').click()
    await expectMonth(page, 10)
    const motion = await page.evaluate(() => {
      const seconds = value => value.split(',').map(part => part.trim().endsWith('ms') ? parseFloat(part) / 1000 : parseFloat(part))
      const violations = []
      for (const element of document.querySelectorAll('body *')) {
        for (const pseudo of [null, '::before', '::after']) {
          const style = getComputedStyle(element, pseudo)
          const transition = Math.max(...seconds(style.transitionDuration))
          const animation = style.animationName.split(',').some(name => name.trim() !== 'none') ? Math.max(...seconds(style.animationDuration)) : 0
          // A near-zero accessibility reset is valid; no class names,
          // animation names, transforms or exact CSS implementation required.
          if (transition > 0.01 || animation > 0.01) violations.push({ tag: element.tagName, pseudo, transition, animation })
        }
      }
      return { violations, scroll: getComputedStyle(document.documentElement).scrollBehavior }
    })
    expect(motion.violations).toEqual([])
    expect(motion.scroll).not.toBe('smooth')
  })
})
