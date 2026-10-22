import { readFile } from 'node:fs/promises'
import { test, expect } from './browser-fixture.mjs'

const catalog = async () => JSON.parse(await readFile(new URL('../src/data/seasonalReasons.json', import.meta.url), 'utf8'))
const cards = page => page.locator('[data-results] article[data-id]')

test('six cards expose a reason, a caveat and source controls instead of unsourced seasonal claims', async ({ page }) => {
  await page.goto('/?month=10')
  await expect(page.locator('[data-seasonal-note]')).toHaveCount(6)
  await expect(page.locator('[data-seasonal-pending]')).toHaveCount(0)
  await expect(page.locator('[data-seasonal-why]')).toHaveCount(6)
  await expect(page.locator('[data-seasonal-tradeoff]')).toHaveCount(6)
  await expect(page.locator('[data-seasonal-note] summary')).toHaveCount(6)
})

for (const months of [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) {
  test(`months ${months.join(', ')} use their exact catalog reasons and source links`, async ({ page }) => {
    const data = await catalog()
    await page.goto('/?month=10')
    await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
    for (const month of months) {
      await page.locator(`button[data-month="${month}"]`).click()
      await expect(cards(page)).toHaveCount(6)
      await expect(page.locator('[data-seasonal-note]')).toHaveCount(6)
      await expect(page.locator('[data-seasonal-pending]')).toHaveCount(0)
      for (const card of await cards(page).all()) {
        const id = await card.getAttribute('data-id')
        const expected = data.notes.find(note => note.destinationId === id && note.month === month)
        expect(expected, `source oracle missing ${id}/${month}`).toBeTruthy()
        const note = card.locator('[data-seasonal-note]')
        await expect(note).toHaveAttribute('data-seasonal-month', String(month))
        await expect(note).toHaveAttribute('data-destination', id)
        await expect(note.locator('[data-seasonal-why]')).toHaveText(expected.why)
        await expect(note.locator('[data-seasonal-tradeoff]')).toHaveText(expected.tradeoff)
        const expectedSources = expected.sourceIds.map(id => data.sources.find(source => source.id === id))
        expect(await note.locator('[data-seasonal-source]').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expectedSources.map(s => s.url))
        expect(await note.locator('time').evaluateAll(times => times.map(time => time.dateTime))).toEqual(expectedSources.map(s => s.checkedAt))
      }
    }
  })
}

test('source disclosure supports native keyboard use and resets when the same city changes month', async ({ page }) => {
  await page.goto('/?month=5')
  await expect(page.locator('[data-selected-month]')).toHaveText('May')
  const lisbon = page.locator('[data-seasonal-note][data-destination="lisbon"]')
  const details = lisbon.locator('details')
  const summary = lisbon.locator('summary')
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(details).toHaveAttribute('open', '')
  await expect(lisbon.locator('[data-seasonal-source]').first()).toBeVisible()
  await expect(lisbon).toContainText('not a forecast')
  await page.keyboard.press('Space')
  await expect(details).not.toHaveAttribute('open', '')
  await summary.click()
  await expect(details).toHaveAttribute('open', '')
  await page.locator('button[data-month="6"]').click()
  await expect(lisbon).toHaveAttribute('data-seasonal-month', '6')
  await expect(lisbon.locator('details')).not.toHaveAttribute('open', '')
})

for (const theme of ['light', 'dark']) {
  for (const width of [320, 1280]) {
    test(`${width}px ${theme}: seasonal notes and expanded sources fit without truncation`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
      await page.goto('/?month=10')
      await expect(page.locator('[data-seasonal-note]')).toHaveCount(6)
      for (const note of await page.locator('[data-seasonal-note]').all()) {
        const summary = note.locator('summary')
        await summary.scrollIntoViewIfNeeded()
        const button = await summary.boundingBox()
        expect(button.height).toBeGreaterThanOrEqual(44)
        expect(button.width).toBeGreaterThanOrEqual(44)
        await summary.click()
        await expect(note.locator('[data-seasonal-source]').first()).toBeVisible()
        const bounds = await note.evaluate(element => ({ ...element.getBoundingClientRect().toJSON(), overflowing: [...element.querySelectorAll('p, a')].some(child => child.scrollWidth > child.clientWidth + 1), docWidth: document.documentElement.scrollWidth, width: innerWidth }))
        expect(bounds.left).toBeGreaterThanOrEqual(0)
        expect(bounds.right).toBeLessThanOrEqual(width + 1)
        expect(bounds.overflowing).toBe(false)
        expect(bounds.docWidth).toBeLessThanOrEqual(bounds.width + 1)
        await summary.click()
      }
    })
  }
}

test.describe('seasonal source disclosure without hydration', () => {
  test.use({ javaScriptEnabled: false })
  test('server content and native source disclosure remain useful without JavaScript', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-seasonal-note]')).toHaveCount(6)
    const note = page.locator('[data-seasonal-note]').first()
    await note.locator('summary').click()
    await expect(note.locator('details')).toHaveAttribute('open', '')
    await expect(note.locator('[data-seasonal-source]').first()).toBeVisible()
  })
})
