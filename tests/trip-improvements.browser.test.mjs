import { test, expect } from './browser-fixture.mjs'

// Independent public-behaviour oracle. Do not import application context,
// persistence, URL or seasonal-selection functions into this test.
// Baseline inspected with git show 3d4af2c:<path>: the month/readiness hooks,
// field IDs, mode/search names and native source disclosures already exist.
// Baseline has plain guide URLs, no saved region and no practical-notes hook;
// the new-feature expectations deliberately fail against that baseline.
const STORAGE_KEY = 'lll-saved-destinations-v1'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const JANUARY = [
  ['maldives', 'Maldives'], ['cape-town', 'Cape Town'], ['mexico-city', 'Mexico City'],
  ['sydney', 'Sydney'], ['bangkok', 'Bangkok'], ['queenstown', 'Queenstown'],
]
const THREE_SAVED = [{ id: 'maldives', month: 1 }, { id: 'cape-town', month: 1 }, { id: 'tokyo', month: 3 }]
const savedRegion = page => page.getByRole('region', { name: 'Saved destinations', exact: true })
const comparison = page => page.locator('section[data-destination-comparison]')
const card = (page, id) => page.locator(`[data-results] article[data-id="${id}"]`)
const namedButton = (root, name) => root.getByRole('button', { name, exact: true })
const sponsored = page => page.locator('#compare-prices a[rel~="sponsored"]')

// Only documented authoritative publishers, not an arbitrary HTTPS placeholder.
// Topic alternatives permit editorial wording, but require destination-specific
// practical substance in addition to headings, source names and check dates.
const PRACTICAL = [
  { id: 'mexico-city', title: 'Mexico City', topic: /Coyoac[aá]n|Casa Azul|Frida Kahlo|Metro|Metrob[uú]s|altitude|Chapultepec|Teotihuac[aá]n/i, hosts: ['gob.mx', 'cdmx.gob.mx', 'inah.gob.mx', 'metro.cdmx.gob.mx', 'ste.cdmx.gob.mx', 'visitmexico.com', 'museofridakahlo.org.mx'] },
  { id: 'kyoto', title: 'Kyoto', topic: /bus|subway|Gion|etiquette|luggage|reservation/i, hosts: ['kyoto.travel', 'city.kyoto.lg.jp', 'kyoto.city.lg.jp', 'japan.travel'] },
  { id: 'marrakech', title: 'Marrakech', topic: /medina|taxi|airport|rail|Ramadan|mosque/i, hosts: ['visitmorocco.com', 'oncf.ma', 'oncf-voyages.ma', 'onda.ma', 'visitmarrakech.com', 'jardinmajorelle.com', 'gov.uk'] },
  { id: 'tokyo', title: 'Tokyo', topic: /Suica|PASMO|subway|rail|train|Haneda|Narita/i, hosts: ['gotokyo.org', 'tokyometro.jp', 'jreast.co.jp', 'japan.travel', 'haneda-airport.jp', 'narita-airport.jp'] },
  { id: 'seville', title: 'Seville', topic: /Alc[aá]zar|cathedral|reservation|TUSSAM|airport|heat/i, hosts: ['visitasevilla.es', 'tussam.es', 'renfe.com', 'alcazarsevilla.org', 'catedraldesevilla.es', 'andalucia.org'] },
  { id: 'cape-town', title: 'Cape Town', topic: /Table Mountain|cableway|SANParks|Robben Island|wind|safety/i, hosts: ['capetown.travel', 'capetown.gov.za', 'sanparks.org', 'tablemountain.net', 'robben-island.org.za', 'southafrica.net'] },
  { id: 'maldives', title: 'Maldives', topic: /seaplane|transfer|ferry|speedboat|local island|immigration|declaration/i, hosts: ['visitmaldives.com', 'immigration.gov.mv', 'gov.mv', 'transmaldivian.com', 'maldivian.aero', 'mta.gov.mv'] },
]

// Capture actual uncaught application errors, including storage exceptions.
// Do not blanket-filter pageerror/console errors to hide unrelated failures.
test.beforeEach(async ({ page, baseURL }) => {
  const errors = []
  const dialogs = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('dialog', async dialog => { dialogs.push(`${dialog.type()}: ${dialog.message()}`); await dialog.dismiss() })
  page.__tripOracleErrors = errors
  page.__tripOracleDialogs = dialogs
  await page.clock.setFixedTime(new Date('2030-01-10T20:00:00Z'))
  const origin = new URL(baseURL || process.env.BROWSER_BASE_URL || 'http://localhost:3001').origin
  // The shared fixture blocks marketing collectors while leaving real images
  // and the local optimizer enabled. Additionally forbid submissions, outbound
  // document navigation and popup navigation. Never exercise a live supplier.
  await page.context().route('**/*', route => {
    const request = route.request()
    if (!['GET', 'HEAD'].includes(request.method())) return route.abort()
    if (request.isNavigationRequest() && new URL(request.url()).origin !== origin) return route.abort()
    return route.fallback()
  })
})

test.afterEach(async ({ page }) => {
  expect(page.__tripOracleErrors, 'No uncaught application errors').toEqual([])
  expect(page.__tripOracleDialogs, 'Untrusted URL/storage values must never execute').toEqual([])
})

async function home(page, month = 1) {
  await page.goto(`/?month=${month}`, { waitUntil: 'domcontentloaded' })
  await readyMonth(page, month)
}

async function readyMonth(page, month) {
  await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('button[data-month]')).toHaveCount(12)
  await expect(page.locator(`button[data-month="${month}"]`)).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-selected-month]')).toHaveText(MONTHS[month - 1])
  await expect(page.locator('[data-results] article[data-id]')).toHaveCount(6)
}

async function chooseMonth(page, month, key) {
  const button = page.locator(`button[data-month="${month}"]`)
  if (key) { await button.focus(); await button.press(key) } else await button.click()
  await readyMonth(page, month)
  await expect.poll(() => new URL(page.url()).searchParams.get('month')).toBe(String(month))
}

function contextualGuide(href, id, month, origin) {
  expect(href, `${id}: native relative guide href`).toBe(`/guides/${id}?month=${month}`)
  const url = new URL(href, origin)
  expect(url.origin).toBe(new URL(origin).origin)
  expect(url.pathname).toBe(`/guides/${id}`)
  expect([...url.searchParams]).toEqual([['month', String(month)]])
  expect(url.hash).toBe('')
}

async function canonical(page, path) {
  const link = page.locator('link[rel="canonical"]')
  await expect(link).toHaveCount(1)
  const url = new URL(await link.getAttribute('href'))
  expect(url.origin).toBe('https://lostluggagelegend.com')
  expect(url.pathname).toBe(path)
  expect(url.search).toBe('')
  expect(url.hash).toBe('')
}

async function plannerReady(page) {
  // Existing local-calendar min is set after hydration; unlike a URL check it
  // establishes that the real form effects have run before testing query state.
  await expect(page.locator('#flight-depart')).toHaveAttribute('min', '2030-01-10')
  await expect(page.locator('#flight-destination')).toBeVisible()
}

async function blankOriginDates(page) {
  for (const id of ['flight-origin', 'flight-depart', 'flight-return']) await expect(page.locator(`#${id}`)).toHaveValue('')
  await expect(sponsored(page)).toHaveCount(0)
}

async function save(page, id, title) {
  const item = card(page, id)
  await expect(item).toHaveCount(1)
  const button = namedButton(item, `Save ${title}`)
  await expect(button).toHaveCount(1)
  await expect(button).toHaveAttribute('type', 'button')
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await button.click()
  await expect(namedButton(item, `Unsave ${title}`)).toHaveAttribute('aria-pressed', 'true')
  await expect(namedButton(savedRegion(page), `Remove ${title}`)).toHaveCount(1)
}

async function storedItems(page, expected) {
  // Read back the exact storage target after every state-changing interaction.
  // Deep equality forbids source copy, arbitrary fields, dates and destinations.
  await expect.poll(() => page.evaluate(key => {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    try { return JSON.parse(raw) } catch { return raw }
  }, STORAGE_KEY)).toEqual({ version: 1, items: expected })
}

async function saveThree(page) {
  await home(page)
  await expect(savedRegion(page)).toHaveCount(1)
  await expect(savedRegion(page).getByRole('heading', { name: 'Your saved places', exact: true })).toBeVisible()
  await save(page, 'maldives', 'Maldives')
  await save(page, 'cape-town', 'Cape Town')
  await chooseMonth(page, 3)
  await save(page, 'tokyo', 'Tokyo')
  await storedItems(page, THREE_SAVED)
}

async function savedEntries(page, entries = THREE_SAVED) {
  const region = savedRegion(page)
  await expect(region).toBeVisible()
  await expect(region.getByRole('button', { name: /^Remove / })).toHaveCount(entries.length)
  for (const { id, month } of entries) {
    const title = id === 'maldives' ? 'Maldives' : id === 'cape-town' ? 'Cape Town' : 'Tokyo'
    const remove = namedButton(region, `Remove ${title}`)
    await expect(remove).toHaveCount(1)
    // Find the smallest native group with the removal control and its guide
    // anchor, without prescribing li/article/div markup. The one-link guard
    // excludes a parent region or comparison copy from masquerading as a row.
    const row = remove.locator('xpath=ancestor::*[.//a[starts-with(@href, "/guides/")]][1]')
    await expect(row).toHaveCount(1)
    await expect(row.locator('a[href^="/guides/"]')).toHaveCount(1)
    await expect(row).toContainText(title)
    await expect(row).toContainText(MONTHS[month - 1])
    const link = row.locator(`a[href^="/guides/${id}"]`)
    await expect(link).toHaveCount(1)
    contextualGuide(await link.getAttribute('href'), id, month, page.url())
  }
}

for (const batch of [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) {
  test(`month context: ${MONTHS[batch[0] - 1]}–${MONTHS[batch.at(-1) - 1]} preserves native guide paths`, async ({ page }) => {
    await home(page, batch[0])
    for (const month of batch) {
      await chooseMonth(page, month)
      for (const [index, name] of MONTHS.entries()) {
        const button = page.locator(`button[data-month="${index + 1}"]`)
        await expect(button).toHaveAccessibleName(name)
        await expect(button).toHaveAttribute('type', 'button')
      }
      const cards = await page.locator('[data-results] article[data-id]').evaluateAll(items => items.map(item => ({
        id: item.dataset.id,
        hrefs: [...item.querySelectorAll('a')].map(a => a.getAttribute('href')).filter(href => href?.startsWith('/guides/')),
      })))
      expect(new Set(cards.map(item => item.id)).size).toBe(6)
      for (const item of cards) {
        expect(item.hrefs, `${item.id}: image/title/read links`).toHaveLength(3)
        for (const href of item.hrefs) contextualGuide(href, item.id, month, page.url())
      }
      const feature = page.locator('[data-feature-link]')
      await expect(feature).toHaveCount(1)
      const featureHref = await feature.getAttribute('href')
      const featureId = new URL(featureHref, page.url()).pathname.split('/').at(-1)
      expect(cards.map(item => item.id)).toContain(featureId)
      contextualGuide(featureHref, featureId, month, page.url())
      if (month === 1) {
        expect(cards.map(item => item.id).sort()).toEqual(JANUARY.map(([id]) => id).sort())
        for (const [id, title] of JANUARY) await expect(card(page, id).getByRole('heading', { name: title, exact: true })).toBeVisible()
      }
    }
    await canonical(page, '/')
    const navigation = page.getByRole('navigation', { name: 'Primary navigation', exact: true })
    const toggle = namedButton(navigation, 'Toggle navigation')
    if (await toggle.isVisible()) await toggle.click()
    const editorialLinks = await navigation.getByRole('link').evaluateAll(links => links.filter(a => a.getAttribute('href') !== '/').filter(a => a.getBoundingClientRect().width > 0).map(a => [a.textContent.trim(), a.getAttribute('href')]))
    expect(editorialLinks).toEqual([['Guides', '/guides'], ['Golf', '/golf'], ['Newsletter', '/#newsletter']])
    await expect(navigation.getByRole('link', { name: /saved|compare saved/i })).toHaveCount(0)
  })
}

test('January → native Maldives guide → real context-aware planner → Back keeps January', async ({ page }) => {
  await home(page)
  const read = page.getByRole('link', { name: 'Read the Maldives guide', exact: true })
  await expect(read).toHaveCount(1)
  contextualGuide(await read.getAttribute('href'), 'maldives', 1, page.url())
  await read.click()
  await expect(page).toHaveURL(/\/guides\/maldives\?month=1$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Maldives', exact: true })).toBeVisible()
  await canonical(page, '/guides/maldives')
  const flights = page.locator('[data-guide-comparison]').getByRole('link', { name: /^Compare Flights\b/ })
  await expect(flights).toHaveCount(1)
  await expect(flights).toHaveAttribute('href', '/plan?destination=maldives&month=1#compare-prices')
  await expect(flights).not.toHaveAttribute('target', '_blank')
  await flights.click()
  await expect(page).toHaveURL(/\/plan\?destination=maldives&month=1#compare-prices$/)
  await plannerReady(page)
  await expect(page.locator('#flight-destination')).toHaveValue(/Maldives|Mal[eé]|\bMLE\b/i)
  await blankOriginDates(page)
  await canonical(page, '/plan')
  await namedButton(page.locator('#compare-prices'), 'Hotels').click()
  await expect(page.locator('#hotel-destination')).toHaveValue(/Maldives/i)
  for (const id of ['hotel-checkin', 'hotel-checkout']) await expect(page.locator(`#${id}`)).toHaveValue('')
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/guides\/maldives\?month=1$/)
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 1)
  await expect(page).toHaveURL(/\/\?month=1$/)
})

test('generic planner still starts blank and produces supplier links only from explicit user choices', async ({ page }) => {
  await page.goto('/plan', { waitUntil: 'domcontentloaded' })
  await plannerReady(page)
  await blankOriginDates(page)
  await expect(page.locator('#flight-destination')).toHaveValue('')
  const form = page.locator('#compare-prices')
  await expect(namedButton(form, 'Search Flights')).toBeDisabled()
  for (const [id, city, country] of [['flight-origin', 'London', 'UK'], ['flight-destination', 'Lisbon', 'Portugal']]) {
    await page.locator(`#${id}`).fill(city)
    const suggestion = form.getByRole('button', { name: new RegExp(`${city}\\s*${country}`) })
    await expect(suggestion).toHaveCount(1)
    await suggestion.click()
  }
  await page.locator('#flight-depart').fill('2030-01-11')
  await namedButton(form, 'Search Flights').click()
  await expect(sponsored(page)).toHaveCount(3)
  await expect(sponsored(page).first()).toHaveAttribute('href', 'https://www.kayak.com/flights/LHR-LIS/2030-01-11?sort=price_a')
  await expect(page).toHaveURL(/\/plan$/)
})

const BAD_QUERIES = [
  ['unknown and executable destinations', ['destination=not-a-real-place&month=1', `destination=${encodeURIComponent('javascript:alert("trip-oracle")')}&month=1`]],
  ['duplicate destination and duplicate month', ['destination=maldives&destination=tokyo&month=1', 'destination=maldives&month=1&month=3']],
  ['out-of-range and executable month', ['destination=maldives&month=13', `destination=maldives&month=${encodeURIComponent('<img src=x onerror=alert("trip-oracle")>')}`]],
]
for (const [name, queries] of BAD_QUERIES) {
  test(`untrusted planner context: ${name} is never raw rendered or used as travel dates`, async ({ page }) => {
    for (const query of queries) {
      await page.goto(`/plan?${query}&origin=JFK&depart=2030-02-01&return=2030-02-10#compare-prices`, { waitUntil: 'domcontentloaded' })
      await plannerReady(page)
      await blankOriginDates(page)
      // Invalid destination (including duplicates) must be generic. A known
      // destination with invalid month may keep ONLY that validated place;
      // month is editorial context, never a licence to invent exact dates.
      if (query.startsWith('destination=maldives&month=')) await expect(page.locator('#flight-destination')).toHaveValue(/^(?:|.*(?:Maldives|Mal[eé]|\bMLE\b).*)$/i)
      else await expect(page.locator('#flight-destination')).toHaveValue('')
      const visibleText = await page.locator('body').innerText()
      expect(visibleText).not.toMatch(/not-a-real-place|javascript:|trip-oracle|onerror=/i)
      await expect(page.locator('#compare-prices input')).not.toHaveCount(0)
      const values = await page.locator('#compare-prices input').evaluateAll(inputs => inputs.map(input => input.value))
      expect(values.join(' ')).not.toMatch(/not-a-real-place|javascript:|trip-oracle|onerror=|2030-02-/i)
      await canonical(page, '/plan')
    }
  })
}

test('native save/unsave toggles are distinct, capped at three, and fourth save never evicts', async ({ page }) => {
  await home(page)
  const region = savedRegion(page)
  await expect(namedButton(region, 'Compare saved places')).toBeDisabled()
  await save(page, 'maldives', 'Maldives')
  await storedItems(page, [{ id: 'maldives', month: 1 }])
  await expect(namedButton(region, 'Compare saved places')).toBeDisabled()
  await namedButton(card(page, 'maldives'), 'Unsave Maldives').click()
  await expect(namedButton(card(page, 'maldives'), 'Save Maldives')).toHaveAttribute('aria-pressed', 'false')
  await storedItems(page, [])
  for (const [id, title] of JANUARY.slice(0, 3)) await save(page, id, title)
  const expected = JANUARY.slice(0, 3).map(([id]) => ({ id, month: 1 }))
  await storedItems(page, expected)
  await namedButton(card(page, 'sydney'), 'Save Sydney').click()
  const limit = region.locator('[role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]').filter({ hasText: /three|3|limit/i })
  await expect(limit).toHaveCount(1)
  await expect(limit).toBeVisible()
  await expect(limit).toContainText(/three|3/i)
  await expect(limit).toContainText(/remove|maximum|up to|limit|only/i)
  await storedItems(page, expected)
  await expect(region.getByRole('button', { name: /^Remove / })).toHaveCount(3)
  await expect(namedButton(card(page, 'sydney'), 'Save Sydney')).toHaveAttribute('aria-pressed', 'false')
})

test('January saves plus March Tokyo retain original months across reload and native cross-page Back', async ({ page }) => {
  await saveThree(page)
  await savedEntries(page)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 3)
  await savedEntries(page)
  await storedItems(page, THREE_SAVED)
  const guide = savedRegion(page).locator('a[href="/guides/maldives?month=1"]')
  await expect(guide).toHaveCount(1)
  await guide.click()
  await expect(page).toHaveURL(/\/guides\/maldives\?month=1$/)
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 3)
  await savedEntries(page)
  await storedItems(page, THREE_SAVED)
})

test('inline comparison uses each saved month with cited seasonal reasons/trade-offs, not invented prices or scores', async ({ page }) => {
  await saveThree(page)
  await namedButton(savedRegion(page), 'Compare saved places').click()
  const panel = comparison(page)
  await expect(panel).toHaveCount(1)
  await expect(panel).toBeVisible()
  for (const [id, title, month] of [['maldives', 'Maldives', 1], ['cape-town', 'Cape Town', 1], ['tokyo', 'Tokyo', 3]]) {
    await expect(panel.getByRole('heading', { name: title, exact: true })).toHaveCount(1)
    const note = panel.locator(`[data-seasonal-note][data-destination="${id}"]`)
    await expect(note).toHaveCount(1)
    await expect(note).toHaveAttribute('data-seasonal-month', String(month))
    // Require an explicit visible saved-month label outside the collapsed
    // source disclosure; an aria-label alone is not a sighted-reader label.
    const entry = note.locator('xpath=ancestor::*[.//*[self::h2 or self::h3 or self::h4 or self::h5 or self::h6]][1]')
    await expect(entry.locator('[data-seasonal-note]')).toHaveCount(1)
    await expect(entry.getByRole('heading', { name: title, exact: true })).toHaveCount(1)
    const explicitMonth = await entry.evaluate(element => {
      const copy = element.cloneNode(true)
      copy.querySelectorAll('details').forEach(node => node.remove())
      return copy.textContent
    })
    expect(explicitMonth).toContain(MONTHS[month - 1])
    await expect(note.locator('[data-seasonal-why]')).toHaveText(/\S.{30,}/)
    await expect(note.locator('[data-seasonal-tradeoff]')).toHaveText(/\S.{30,}/)
    const disclosure = note.locator('summary')
    await expect(disclosure).toHaveAccessibleName(`Sources & checks for ${title} in ${MONTHS[month - 1]}`)
    await disclosure.click()
    const sources = note.locator('a[data-seasonal-source]')
    expect(await sources.count()).toBeGreaterThan(0)
    for (const source of await sources.all()) {
      await expect(source).toBeVisible()
      expect(new URL(await source.getAttribute('href')).protocol).toBe('https:')
      expect((await source.innerText()).trim().length).toBeGreaterThan(8)
    }
    await expect(note).toContainText('Source checked')
  }
  await expect(panel).toContainText('January')
  await expect(panel).toContainText('March')
  expect(await panel.innerText()).not.toMatch(/[$€£]\s*\d|\b\d+(?:\.\d+)?\s*(?:%|\/\s*10|\/\s*100)|\b(?:weather|crowd|value|destination) score\b/i)
  await storedItems(page, THREE_SAVED)
})

test('remove and clear update cards, saved storage and the active comparison without stale rows', async ({ page }) => {
  await saveThree(page)
  const region = savedRegion(page)
  await namedButton(region, 'Compare saved places').click()
  await expect(comparison(page)).toBeVisible()
  await namedButton(region, 'Remove Cape Town').click()
  await expect(namedButton(region, 'Remove Cape Town')).toHaveCount(0)
  await expect(comparison(page).getByRole('heading', { name: 'Cape Town', exact: true })).toHaveCount(0)
  await storedItems(page, [THREE_SAVED[0], THREE_SAVED[2]])
  await namedButton(region, 'Clear saved places').click()
  await expect(region.getByRole('button', { name: /^Remove / })).toHaveCount(0)
  await expect(namedButton(region, 'Compare saved places')).toBeDisabled()
  await expect(comparison(page)).not.toBeVisible()
  // Deleting the key and persisting an empty v1 envelope are both honest clear.
  const cleared = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)
  if (cleared !== null) expect(JSON.parse(cleared)).toEqual({ version: 1, items: [] })
  await chooseMonth(page, 1)
  await expect(namedButton(card(page, 'maldives'), 'Save Maldives')).toHaveAttribute('aria-pressed', 'false')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 1)
  await expect(savedRegion(page).getByRole('button', { name: /^Remove / })).toHaveCount(0)
})

test('corrupt and hostile saved data never renders arbitrary titles, URLs or executable markup', async ({ page }) => {
  await page.addInitScript(({ key, raw }) => {
    if (!sessionStorage.getItem('trip-oracle-storage-seeded')) {
      localStorage.setItem(key, raw)
      sessionStorage.setItem('trip-oracle-storage-seeded', 'true')
    }
  }, { key: STORAGE_KEY, raw: '{broken-json' })
  await home(page)
  await expect(savedRegion(page).getByRole('button', { name: /^Remove / })).toHaveCount(0)
  await save(page, 'maldives', 'Maldives')
  // Preserve unrecognized data rather than overwriting a future/invalid schema.
  // Saving remains usable in memory, with an explicit persistence warning.
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe('{broken-json')
  await expect(savedRegion(page)).toContainText('New saves stay on this page only')
  // Seed the next document directly; do not depend on the unspecified ordering
  // of multiple Playwright init scripts. Application must validate IDs/months
  // and use its own titles, never arbitrary saved presentation fields.
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: STORAGE_KEY,
    value: { version: 1, items: [
      { id: '<img src=x onerror=alert("trip-oracle")>', month: 1 },
      { id: 'javascript:alert("trip-oracle")', month: 1 },
      { id: 'not-a-real-place', month: 3 },
      { id: 'maldives', month: 99, title: 'Injected stale title', href: 'javascript:alert("trip-oracle")' },
    ] },
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 1)
  await expect(savedRegion(page).getByRole('button', { name: /^Remove / })).toHaveCount(0)
  expect(await savedRegion(page).innerText()).not.toMatch(/trip-oracle|not-a-real-place|Injected stale title|javascript:|onerror=/i)
  await expect(savedRegion(page).locator('img[onerror], a[href^="javascript:"]')).toHaveCount(0)
  await save(page, 'cape-town', 'Cape Town')
  const untouched = JSON.parse(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY))
  expect(untouched.items).toHaveLength(4)
  expect(untouched.items[0].id).toBe('<img src=x onerror=alert("trip-oracle")>')
  await expect(savedRegion(page)).toContainText('New saves stay on this page only')
  // After the visitor deliberately clears the owned key, normal persistence
  // resumes. This action is not performed automatically by the application.
  await page.evaluate(key => localStorage.removeItem(key), STORAGE_KEY)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 1)
  await save(page, 'cape-town', 'Cape Town')
  await storedItems(page, [{ id: 'cape-town', month: 1 }])
})

test('denied feature storage is honest memory-only saving, not a crash or phantom persistence', async ({ page }) => {
  await page.addInitScript(key => {
    // Deny just the owned feature key. Global localStorage denial would also
    // break the pre-existing uncaught ThemeProvider read and misdiagnose this
    // feature. Preserve every real pageerror assertion above.
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem, remove = Storage.prototype.removeItem
    Storage.prototype.getItem = function (name) { if (name === key) throw new DOMException('Storage denied', 'SecurityError'); return get.call(this, name) }
    Storage.prototype.setItem = function (name, value) { if (name === key) throw new DOMException('Storage denied', 'SecurityError'); return set.call(this, name, value) }
    Storage.prototype.removeItem = function (name) { if (name === key) throw new DOMException('Storage denied', 'SecurityError'); return remove.call(this, name) }
  }, STORAGE_KEY)
  await home(page)
  await save(page, 'maldives', 'Maldives')
  await save(page, 'cape-town', 'Cape Town')
  const region = savedRegion(page)
  const warning = region.getByText(/(?:storage|sav\w*|remember\w*).*(?:unavailable|blocked|disabled|session|reload|persist)|(?:session|reload).*(?:only|lost|sav\w*)/i)
  await expect(warning).toHaveCount(1)
  await expect(warning).toBeVisible()
  await namedButton(region, 'Compare saved places').click()
  await expect(comparison(page)).toBeVisible()
  await chooseMonth(page, 3)
  await expect(namedButton(region, 'Remove Maldives')).toHaveCount(1)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await readyMonth(page, 3)
  await expect(savedRegion(page).getByRole('button', { name: /^Remove / })).toHaveCount(0)
  await save(page, 'tokyo', 'Tokyo')
})

for (const width of [320, 390]) {
  test(`${width}px saved and compared controls remain named, 44px, keyboard-operable and overflow-free`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 })
    await saveThree(page)
    const region = savedRegion(page)
    const compare = namedButton(region, 'Compare saved places')
    await compare.focus()
    await page.keyboard.press('Enter')
    await expect(comparison(page)).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    const saveControls = page.locator('[data-results]').getByRole('button', { name: /^(?:Save|Unsave) / })
    await expect(saveControls).toHaveCount(6)
    for (const control of [compare, ...await region.getByRole('button', { name: /^(Remove |Clear saved places$)/ }).all(), ...await saveControls.all()]) {
      await expect(control).toHaveAccessibleName(/\S/)
      await expect(control).toBeVisible()
      const box = await control.boundingBox()
      expect(box).not.toBeNull()
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.x).toBeGreaterThanOrEqual(-1)
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
    }
    const overflow = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) }))
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.width + 1)
    const remove = namedButton(region, 'Remove Tokyo')
    // Act on the element itself: focus and keydown resolve against the same live
    // node, so a re-render between the two can no longer swallow the key press.
    await remove.press(' ')
    await expect(namedButton(region, 'Remove Tokyo')).toHaveCount(0)
    await expect(namedButton(card(page, 'tokyo'), 'Save Tokyo')).toHaveAttribute('aria-pressed', 'false')
    const resave = namedButton(card(page, 'tokyo'), 'Save Tokyo')
    await resave.press('Enter')
    await expect(namedButton(card(page, 'tokyo'), 'Unsave Tokyo')).toHaveAttribute('aria-pressed', 'true')
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
    await storedItems(page, THREE_SAVED)
    const finalWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth)
    expect(finalWidth).toBeLessThanOrEqual(1)
  })
}

for (const { id, title, topic, hosts } of PRACTICAL) {
  test(`${id}: substantive practical field notes have readable authoritative HTTPS sources and check dates`, async ({ page }) => {
    await page.goto(`/guides/${id}?month=1`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible()
    const notes = page.locator(`[data-practical-guide-notes][data-practical-guide-id="${id}"]`)
    await expect(notes).toHaveCount(1)
    await expect(notes.getByRole('heading', { name: 'Practical field notes', exact: true })).toBeVisible()
    const prose = notes.locator('p, li')
    const paragraphs = (await prose.allInnerTexts()).map(text => text.trim()).filter(text => text.length >= 45)
    expect(paragraphs.length, `${id}: several useful practical notes, not a heading and URL`).toBeGreaterThanOrEqual(3)
    expect(paragraphs.join(' ')).toMatch(topic)
    expect(paragraphs.join(' ').length).toBeGreaterThan(250)
    const disclosure = notes.locator('summary')
    await expect(disclosure).toHaveCount(1)
    await disclosure.click()
    await expect(notes.locator('details')).toHaveAttribute('open', '')
    const sources = notes.locator('a[href]')
    expect(await sources.count()).toBeGreaterThanOrEqual(2)
    let official = 0
    for (const source of await sources.all()) {
      await source.scrollIntoViewIfNeeded()
      await expect(source).toBeVisible()
      const href = await source.getAttribute('href')
      const url = new URL(href)
      expect(url.protocol).toBe('https:')
      expect(url.username + url.password).toBe('')
      expect(url.hostname).not.toMatch(/(?:^|\.)(?:example\.(?:com|org|net)|localhost|invalid)$/i)
      if (hosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) official++
      const label = (await source.innerText()).trim()
      expect(label.length).toBeGreaterThan(8)
      expect(label).not.toMatch(/^https?:|^(?:source|here|link|read more|\d+)\s*[↗→]?$/i)
      const readable = await source.evaluate(element => ({ fontSize: parseFloat(getComputedStyle(element).fontSize), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
      expect(readable.fontSize).toBeGreaterThanOrEqual(13)
      expect(readable.width).toBeGreaterThan(0)
      expect(readable.height).toBeGreaterThan(0)
    }
    expect(official, `${id}: known tourism, government or transport-operator publishers`).toBeGreaterThanOrEqual(2)
    await expect(notes).toContainText(/(?:source )?checked|reviewed/i)
    const dates = notes.locator('time[datetime]')
    expect(await dates.count()).toBeGreaterThan(0)
    for (const date of await dates.all()) {
      const iso = await date.getAttribute('datetime')
      expect(iso).toMatch(/^20\d{2}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(iso))).toBe(false)
      await expect(date).toHaveText(/\S/)
    }
    const articleText = await page.locator('[data-guide-article]').innerText()
    // Independently frozen misleading ranges from the baseline source, not
    // values imported from the replacement editorial data.
    if (id === 'mexico-city') expect(articleText).not.toMatch(/\b30\s*[–-]\s*60\s*%/)
    if (id === 'marrakech') expect(articleText).not.toMatch(/\b(?:30\s*[–-]\s*40|40\s*[–-]\s*60)\s*%/)
    expect(articleText).not.toMatch(/\b\d+(?:\s*[–-]\s*\d+)?\s*%\s*(?:off|cheaper|less|discount|lower)|(?:prices?|rates?|hotels?)\s+(?:drop|fall|are\s+(?:up\s+to\s+)?)\s*\d+(?:\s*[–-]\s*\d+)?\s*%/i)
    if (id === 'marrakech') {
      expect(await page.locator('body').innerText()).not.toMatch(/Kechmich/i)
      const geography = page.locator('[data-guide-hero]')
      await expect(geography).toContainText(/Morocco|Marrakesh.Safi/i)
    }
    await canonical(page, `/guides/${id}`)
  })
}
