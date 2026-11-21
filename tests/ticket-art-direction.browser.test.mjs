import { test, expect } from './browser-fixture.mjs'

for (const width of [320, 390, 1440]) {
  test(`${width}px: destination ticket has real month context, native controls and separate photo/calendar`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/?month=1', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
    const ticket = page.locator('[data-travel-ticket]')
    await expect(ticket.locator('[data-ticket-month]')).toHaveText('January')
    const assertMonthFits = async () => {
      const text = await ticket.locator('[data-ticket-month]').evaluate(e => {
        const range = document.createRange(); range.selectNodeContents(e)
        const lines = [...range.getClientRects()]
        const parent = e.parentElement, style = getComputedStyle(parent)
        return { lines: lines.length, textRight: lines[0].right, boxRight: parent.getBoundingClientRect().right, textWidth: e.offsetWidth, available: parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), font: parseFloat(getComputedStyle(e).fontSize) }
      })
      expect(text.lines, 'month must never split across printed-stub lines').toBe(1)
      expect(text.textRight).toBeLessThanOrEqual(text.boxRight + 1)
      expect(text.textWidth).toBeLessThanOrEqual(text.available + 1)
      expect(text.font).toBeGreaterThanOrEqual(13)
    }
    await assertMonthFits()
    await expect(ticket.locator('[data-ticket-edition]')).toContainText('Destination edition')
    await expect(ticket.locator('[data-ticket-tearoff]')).toContainText('Not a booking')
    await expect(page.locator('button[data-month]')).toHaveCount(12)
    await expect(page.locator('[data-results] > article')).toHaveCount(6)
    await expect(page.locator('[data-hero-image]')).toBeVisible()
    for (const month of [3, 11]) {
      await page.locator(`button[data-month="${month}"]`).click()
      await expect(page.locator(`button[data-month="${month}"]`)).toHaveAttribute('aria-pressed', 'true')
      await expect(ticket.locator('[data-ticket-month]')).toHaveText(month === 3 ? 'March' : 'November')
      await assertMonthFits()
      const target = new URL(await page.locator('[data-feature-link]').getAttribute('href'), page.url())
      expect(target.searchParams.get('month')).toBe(String(month))
      expect(target.pathname.startsWith('/guides/')).toBe(true)
    }
    const geometry = await page.evaluate(() => {
      const hero = document.querySelector('[data-hero-scene]').getBoundingClientRect()
      const calendar = document.querySelector('[data-calendar-band]').getBoundingClientRect()
      const ticket = document.querySelector('[data-travel-ticket]').getBoundingClientRect()
      return { width: innerWidth, scroll: document.documentElement.scrollWidth, heroBottom: hero.bottom, calendarTop: calendar.top, ticketLeft: ticket.left, ticketRight: ticket.right }
    })
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 1)
    expect(geometry.calendarTop).toBeGreaterThanOrEqual(geometry.heroBottom - 1)
    expect(geometry.ticketLeft).toBeGreaterThanOrEqual(0)
    expect(geometry.ticketRight).toBeLessThanOrEqual(geometry.width)
  })
}
