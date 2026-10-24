import { readFile } from 'node:fs/promises'
import { test, expect } from './browser-fixture.mjs'

// Do not derive approved membership from the selector, DOM, popularity ranking
// or seasonal notes. The separately reviewed manifest is the selection oracle.
const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const LEADS = ['maldives', 'cape-town', 'kyoto', 'marrakech', 'amalfi-coast', 'santorini', 'bali', 'maasai-mara', 'iceland', 'lisbon', 'mexico-city', 'sydney']
const cards = page => page.locator('[data-results] article[data-id]')
const sorted = values => [...values].sort()
const mobileMonths = new Set([1, 7, 10])

for (let month = 1; month <= 12; month++) {
  test(`${MONTHS[month - 1]}: approved six picks, exact month evidence, real decoded photos${mobileMonths.has(month) ? ', 320px source bounds' : ''}`, async ({ page }) => {
    test.setTimeout(45_000)
    // Read inside each case: an absent review is a real test failure, not a
    // collection error or a silently skipped browser suite.
    const review = await readJson('../src/data/seasonalShortlistReview.json')
    const catalog = await readJson('../src/data/seasonalReasons.json')
    expect(review.schemaVersion).toBe(1)
    expect(review.baselineCommit).toBe('289fed62aff6a5b3d503f2c5d630dcd34b0c1f7b')
    expect(review.records).toHaveLength(72)
    const approved = review.records.filter(record => record.month === month)
    expect(approved).toHaveLength(6)
    expect(new Set(approved.map(record => record.finalDestinationId)).size).toBe(6)
    if (mobileMonths.has(month)) await page.setViewportSize({ width: 320, height: 900 })

    // Enter on a different month to catch stale evidence on client transitions,
    // including destinations retained in both months. No image requests mocked:
    // shared browser-fixture.mjs isolates marketing/affiliate scripts only.
    const previousMonth = month === 1 ? 12 : month - 1
    await page.goto(`/?month=${previousMonth}`)
    await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
    await expect(page.locator('[data-selected-month]')).toHaveText(MONTHS[previousMonth - 1])
    await page.locator(`button[data-month="${month}"]`).click()
    await expect(page.locator('[data-selected-month]')).toHaveText(MONTHS[month - 1])
    await expect(page.locator(`button[data-month="${month}"]`)).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(new RegExp(`[?&]month=${month}(?:&|$)`))
    await expect(cards(page)).toHaveCount(6)
    const actualIds = await cards(page).evaluateAll(elements => elements.map(element => element.getAttribute('data-id')))
    expect(new Set(actualIds).size).toBe(6)
    expect(sorted(actualIds)).toEqual(sorted(approved.map(record => record.finalDestinationId)))
    expect(actualIds[0]).toBe(LEADS[month - 1])
    await expect(page.locator('[data-seasonal-pending]')).toHaveCount(0)
    await expect(page.locator('[data-seasonal-note]')).toHaveCount(6)

    for (const id of actualIds) {
      const card = cards(page).filter({ has: page.locator(`[data-seasonal-note][data-destination="${id}"]`) })
      await expect(card).toHaveCount(1)
      const approvedRecord = approved.find(record => record.finalDestinationId === id)
      const matchingNotes = catalog.notes.filter(note => note.destinationId === id && note.month === month)
      expect(matchingNotes, `${id}/${month}: exact destination/month note`).toHaveLength(1)
      const expected = matchingNotes[0]
      expect(expected.why).toBe(approvedRecord.why)
      expect(expected.tradeoff).toBe(approvedRecord.tradeoff)
      expect(expected.sourceIds).toEqual(approvedRecord.sourceIds)
      expect(expected.sourceIds.length).toBeGreaterThan(0)
      const note = card.locator('[data-seasonal-note]')
      await expect(note).toHaveAttribute('data-seasonal-month', String(month))
      await expect(note).toHaveAttribute('data-destination', id)
      await expect(note.locator('[data-seasonal-why]')).toBeVisible()
      await expect(note.locator('[data-seasonal-why]')).toHaveText(approvedRecord.why)
      await expect(note.locator('[data-seasonal-tradeoff]')).toBeVisible()
      await expect(note.locator('[data-seasonal-tradeoff]')).toHaveText(approvedRecord.tradeoff)
      const expectedSources = expected.sourceIds.map(sourceId => {
        const sources = catalog.sources.filter(source => source.id === sourceId)
        expect(sources, `${id}/${month}: source ${sourceId}`).toHaveLength(1)
        return sources[0]
      })
      expect(await note.locator('[data-seasonal-source]').evaluateAll(links => links.map(link => link.getAttribute('href'))))
        .toEqual(expectedSources.map(source => source.url))
      expect(await note.locator('time').evaluateAll(times => times.map(time => time.dateTime)))
        .toEqual(expectedSources.map(source => source.checkedAt))

      const summary = note.locator('summary')
      await summary.scrollIntoViewIfNeeded()
      await summary.click()
      await expect(note.locator('details')).toHaveAttribute('open', '')
      for (const link of await note.locator('[data-seasonal-source]').all()) await expect(link).toBeVisible()
      if (mobileMonths.has(month)) {
        const bounds = await note.evaluate(element => ({
          left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right,
          overflowing: [...element.querySelectorAll('p, a')].some(child => child.scrollWidth > child.clientWidth + 1),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
        }))
        expect(bounds.left).toBeGreaterThanOrEqual(0)
        expect(bounds.right).toBeLessThanOrEqual(321)
        expect(bounds.overflowing).toBe(false)
        expect(bounds.documentWidth).toBeLessThanOrEqual(bounds.viewportWidth + 1)
      }
      await summary.click()
      // Trigger real lazy loading without changing URLs, replacing responses,
      // swallowing decode errors, or retrying away upstream image failures.
      await card.locator('img').scrollIntoViewIfNeeded()
    }

    // Decode all six real card images in parallel with a single bounded wait.
    // Native image.decode rejects broken images; report each id and URL.
    await expect(cards(page).locator('img')).toHaveCount(6)
    const photos = await cards(page).locator('img').evaluateAll(async images => {
      let timer
      try {
        return await Promise.race([
          Promise.all(images.map(async image => {
            await image.decode()
            return {
              id: image.closest('article').getAttribute('data-id'),
              src: image.currentSrc,
              complete: image.complete,
              width: image.naturalWidth,
              height: image.naturalHeight,
            }
          })),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Real shortlist image decode exceeded 20 seconds')), 20_000) }),
        ])
      } finally { clearTimeout(timer) }
    })
    expect(photos).toHaveLength(6)
    for (const photo of photos) {
      expect(photo.complete, `${photo.id}: ${photo.src}`).toBe(true)
      expect(photo.src, `${photo.id}: real image URL`).toBeTruthy()
      expect(photo.width, `${photo.id}: ${photo.src}`).toBeGreaterThan(0)
      expect(photo.height, `${photo.id}: ${photo.src}`).toBeGreaterThan(0)
    }
  })
}
