import { test, expect as baseExpect } from './browser-fixture.mjs'

const expect = baseExpect.configure({ timeout: 2000 })
const date = '2030-01-10'
const tabKey = (browserName, reverse = false) => `${browserName === 'webkit' ? 'Alt+' : ''}${reverse ? 'Shift+' : ''}Tab`
const links = page => page.locator('#compare-prices a[rel~="sponsored"]')
const suggestion = (page, city) => page.locator('#compare-prices').getByRole('button', { name: new RegExp(`${city}\\s*(UK|Portugal)`) })

async function keyboardTo(page, browserName, target, reverse = false) {
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press(tabKey(browserName, reverse))
    if (await target.evaluate(el => el === document.activeElement)) return
  }
  throw new Error(`Keyboard did not reach ${await target.getAttribute('id') || await target.textContent()}`)
}

// Resolve translucent/transparent backgrounds against actual ancestor surfaces.
// This deliberately measures painted colors, not class-name/token assertions.
async function paint(locator) {
  return locator.evaluate(el => {
    // Resolve any computed CSS color to [r, g, b, a]. Chromium serializes
    // transition-interpolated colors as oklab(); the legacy numeric regex would
    // read OKLab channels as RGBA and fabricate a dark background.
    const rgba = value => {
      const v = String(value).trim()
      const nums = () => (v.match(/-?[\d.]+(?:e-?\d+)?/gi) || []).map(Number)
      if (/^oklab\(/i.test(v)) {
        const n = nums(), L = n[0], A = n[1], B = n[2], alpha = v.includes('/') ? n[3] : 1
        const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
        const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
        const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
        const lin = [
          4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193795 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
        ]
        const to255 = x => Math.max(0, Math.min(255, Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055))))
        return [...lin.map(to255), alpha]
      }
      if (/^color\(srgb/i.test(v)) { const n = nums(); return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] }
      return nums()
    }
    const over = (fg, bg) => {
      const a = fg[3] ?? 1
      return fg.slice(0, 3).map((c, i) => c * a + bg[i] * (1 - a)).concat(1)
    }
    const background = node => {
      if (!node) return [255, 255, 255, 1]
      return over(rgba(getComputedStyle(node).backgroundColor), background(node.parentElement))
    }
    const luminance = c => c.slice(0, 3).map(v => {
      v /= 255
      return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4
    }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0)
    const ratio = (a, b) => {
      const x = luminance(a), y = luminance(b)
      return (Math.max(x, y) + .05) / (Math.min(x, y) + .05)
    }
    const style = getComputedStyle(el), rect = el.getBoundingClientRect()
    const bg = background(el)
    const outline = parseFloat(style.outlineWidth), offset = parseFloat(style.outlineOffset)
    const extent = outline + Math.max(0, offset)
    let unclipped = rect.left >= extent && rect.right + extent <= document.documentElement.clientWidth
    for (let p = el.parentElement; p; p = p.parentElement) {
      const ps = getComputedStyle(p), r = p.getBoundingClientRect()
      if (/(hidden|clip|auto|scroll)/.test(ps.overflowX) && (rect.left - extent < r.left || rect.right + extent > r.right)) unclipped = false
      if (/(hidden|clip|auto|scroll)/.test(ps.overflowY) && (rect.top - extent < r.top || rect.bottom + extent > r.bottom)) unclipped = false
    }
    return {
      textContrast: ratio(over(rgba(style.color), bg), bg),
      outlineContrast: ratio(rgba(style.outlineColor), background(el.parentElement)),
      outlineStyle: style.outlineStyle, outline, offset, unclipped,
      color: style.color, background: style.backgroundColor, backgroundImage: style.backgroundImage,
      outlineColor: style.outlineColor,
    }
  })
}

// Wait for an element's own CSS transitions to finish before measuring. A mode
// button paints through `transition-all`, and an in-flight frame is not the
// settled state we assert on (Chromium also serializes interpolated colors as
// oklab()). Bounded to ~2s so a stray animation can never hang the suite.
async function settle(locator) {
  await locator.evaluate(async el => {
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve))
    const snapshot = () => {
      const s = getComputedStyle(el)
      return `${s.color}|${s.backgroundColor}|${s.outlineColor}|${s.boxShadow}`
    }
    let previous = snapshot()
    for (let i = 0; i < 120; i++) {
      await frame()
      const next = snapshot()
      if (next === previous) return
      previous = next
    }
  })
}

for (const theme of ['light', 'dark']) {
  test.describe(`planning accessibility ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.clock.setFixedTime(new Date('2030-01-10T20:00:00Z'))
      await page.addInitScript(theme => localStorage.setItem('lll-theme', theme), theme)
      // No test may submit, visit a supplier, or accidentally open a new tab.
      await page.route('**/*', route => {
        const request = route.request()
        if (!['GET', 'HEAD'].includes(request.method())) return route.abort()
        if (request.isNavigationRequest() && new URL(request.url()).origin !== new URL(process.env.BROWSER_BASE_URL || 'http://localhost:3001').origin) return route.abort()
        return route.fallback()
      })
      await page.goto('/plan')
      await expect(page.locator('#flight-depart')).toHaveAttribute('min', date)
      await expect.poll(() => page.locator('html').evaluate(el => el.classList.contains('dark'))).toBe(theme === 'dark')
    })

    test('all seven fields have contrasting unclipped keyboard focus at wide and narrow widths', async ({ page, browserName }) => {
      for (const width of [1440, 320]) {
        await page.setViewportSize({ width, height: 1000 })
        for (const mode of ['Flights', 'Hotels']) {
          const modeButton = page.locator('#compare-prices').getByRole('button', { name: mode, exact: true })
          await modeButton.click()
          await modeButton.focus()
          const ids = mode === 'Flights' ? ['flight-origin', 'flight-destination', 'flight-depart', 'flight-return'] : ['hotel-destination', 'hotel-checkin', 'hotel-checkout']
          for (const id of ids) {
            const field = page.locator(`#${id}`)
            await keyboardTo(page, browserName, field)
            await expect(field).toBeFocused()
            const actual = await paint(field)
            expect.soft(actual.outlineStyle, `${width} #${id}: ${JSON.stringify(actual)}`).not.toBe('none')
            expect.soft(actual.outline, `${width} #${id}`).toBeGreaterThanOrEqual(2)
            expect.soft(actual.outlineContrast, `${width} #${id}`).toBeGreaterThanOrEqual(3)
            expect.soft(actual.unclipped, `${width} #${id}`).toBe(true)
          }
        }
      }
    })

    for (const id of ['flight-origin', 'flight-destination', 'hotel-destination']) {
      test(`${id} suggestions use theme surfaces and readable normal, hover and keyboard-focus states`, async ({ page, browserName }) => {
        if (id.startsWith('hotel')) await page.getByRole('button', { name: 'Hotels', exact: true }).click()
        await page.setViewportSize({ width: 320, height: 1000 })
        await page.locator(`#${id}`).fill('London')
        const button = suggestion(page, 'London')
        await expect(button).toBeVisible()
        for (const state of ['normal', 'hover', 'focus']) {
          if (state === 'hover') await button.hover()
          if (state === 'focus') {
            await page.mouse.move(0, 0)
            await keyboardTo(page, browserName, button)
          }
          const actual = await paint(button)
          if (theme === 'dark') expect.soft(actual.background, `${id} ${state}`).not.toBe('rgb(255, 255, 255)')
          for (const label of await button.locator('span, p').all()) {
            expect.soft((await paint(label)).textContrast, `${id} ${state} ${await label.textContent()}`).toBeGreaterThanOrEqual(4.5)
          }
          if (state === 'focus') {
            expect.soft(actual.outlineStyle).not.toBe('none')
            expect.soft(actual.outlineContrast).toBeGreaterThanOrEqual(3)
          }
        }
      })

      test(`${id} Escape, forward/reverse exit, Enter/Space, pointer and touch preserve focus lifecycle`, async ({ page, browserName }) => {
        if (id.startsWith('hotel')) await page.getByRole('button', { name: 'Hotels', exact: true }).click()
        const input = page.locator(`#${id}`)
        const button = suggestion(page, 'London')
        const wrapper = input.locator('xpath=../..')
        await input.fill('Londo')
        await input.press('n')
        await page.keyboard.press('Escape')
        await expect.soft(button).toHaveCount(0)
        await expect.soft(input).toBeFocused()
        // Typing intentionally opens again after dismissal.
        await input.fill('Londo')
        await input.press('n')
        await keyboardTo(page, browserName, button)
        await page.keyboard.press('Escape')
        await expect.soft(button).toHaveCount(0)
        await expect.soft(input).toBeFocused()
        for (const reverse of [true, false]) {
          await input.fill('Londo')
          await input.press('n')
          await expect(button).toBeVisible()
          if (!reverse) await keyboardTo(page, browserName, button)
          await page.keyboard.press(tabKey(browserName, reverse))
          expect.soft(await wrapper.evaluate(el => el.contains(document.activeElement))).toBe(false)
          await expect.soft(button).toHaveCount(0)
        }
        for (const activation of ['Enter', 'Space', 'mouse', 'touch']) {
          await input.fill('Londo')
          await input.press('n')
          await expect(button).toBeVisible()
          if (activation === 'mouse') await button.click()
          else if (activation === 'touch') {
            // Dispatch an actual touchscreen tap even for the desktop project.
            const context = await page.context().browser().newContext({ hasTouch: true, baseURL: process.env.BROWSER_BASE_URL || 'http://localhost:3001' })
            await context.addInitScript(theme => localStorage.setItem('lll-theme', theme), theme)
            const touch = await context.newPage()
            await touch.route('**/*', route => {
              const req = route.request(), host = new URL(req.url()).hostname
              const externalNavigation = req.isNavigationRequest() && new URL(req.url()).origin !== new URL(process.env.BROWSER_BASE_URL || 'http://localhost:3001').origin
              return externalNavigation || !['GET', 'HEAD'].includes(req.method()) || ['scripts.stay22.com', 'plausible.io'].includes(host) ? route.abort() : route.continue()
            })
            await touch.clock.setFixedTime(new Date('2030-01-10T20:00:00Z'))
            await touch.goto('/plan')
            // The fresh context must hydrate before fill/tap, just like beforeEach.
            await expect(touch.locator('#flight-depart')).toHaveAttribute('min', date)
            if (id.startsWith('hotel')) await touch.getByRole('button', { name: 'Hotels', exact: true }).tap()
            const touchInput = touch.locator(`#${id}`)
            await touchInput.fill('Londo')
            await suggestion(touch, 'London').tap()
            await expect.soft(touchInput).toBeFocused()
            await expect.soft(suggestion(touch, 'London')).toHaveCount(0)
            // Retaining input focus alone can conceal a completely canceled tap.
            await expect.soft(touchInput).toHaveValue(id.startsWith('hotel') ? 'London' : 'London (LHR, LGW, STN, LCY)')
            await touch.keyboard.press(tabKey(browserName))
            expect.soft(await touchInput.locator('xpath=../..').evaluate(el => el.contains(document.activeElement))).toBe(false)
            await context.close()
            continue
          } else {
            await keyboardTo(page, browserName, button)
            await page.keyboard.press(activation === 'Space' ? ' ' : activation)
          }
          await expect.soft(input).toBeFocused()
          await expect.soft(button).toHaveCount(0)
          await expect.soft(input).toHaveValue(id.startsWith('hotel') ? 'London' : 'London (LHR, LGW, STN, LCY)')
        }
        await input.fill('Londo')
        await input.press('n')
        await page.locator('#compare-prices h2').click()
        await expect(button).toHaveCount(0)
        await expect(input).not.toHaveAttribute('role', 'combobox')
      })
    }

    test('named modes expose one pressed state and ordinary cyan text/button contrast is repaired', async ({ page }) => {
      const form = page.locator('#compare-prices')
      const group = form.getByRole('group', { name: 'Search type', exact: true })
      await expect.soft(group).toHaveCount(1)
      for (const mode of ['Flights', 'Hotels']) {
        const button = form.getByRole('button', { name: mode, exact: true })
        await button.click()
        await expect.soft(button).toHaveAttribute('aria-pressed', 'true')
        await expect.soft(form.locator('button[aria-pressed="true"]')).toHaveCount(1)
        await settle(button)
        expect.soft((await paint(button)).textContrast).toBeGreaterThanOrEqual(4.5)
        const eyebrow = form.getByText(mode === 'Flights' ? 'Flight Search' : 'Hotel Search', { exact: true })
        expect.soft((await paint(eyebrow)).textContrast).toBeGreaterThanOrEqual(4.5)
      }
      await form.getByLabel('Destination', { exact: true }).fill('Lisbon')
      await suggestion(page, 'Lisbon').click()
      await page.locator('#hotel-checkin').fill(date)
      const search = form.getByRole('button', { name: 'Search Hotels', exact: true })
      await expect(search).toBeEnabled()
      const painted = await paint(search)
      // White text must meet AA at BOTH opaque gradient endpoints.
      const stops = [...painted.backgroundImage.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)].map(m => m.slice(1).map(Number))
      expect(stops.length).toBeGreaterThanOrEqual(2)
      for (const stop of stops) {
        const l = stop.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0)
        expect.soft(1.05 / (l + .05)).toBeGreaterThanOrEqual(4.5)
      }
    })

    test('always-mounted polite atomic status tracks generated links, later edits, mode and invalid dates without navigation', async ({ page }) => {
      const form = page.locator('#compare-prices'), status = form.getByRole('status')
      await expect.soft(status).toHaveCount(1)
      await expect.soft(status).toHaveAttribute('aria-live', 'polite')
      await expect.soft(status).toHaveAttribute('aria-atomic', 'true')
      await expect.soft(status).toHaveText('')
      await page.locator('#flight-origin').fill('London')
      await suggestion(page, 'London').click()
      await page.locator('#flight-destination').fill('Lisbon')
      await suggestion(page, 'Lisbon').click()
      await page.locator('#flight-depart').fill(date)
      const search = form.getByRole('button', { name: 'Search Flights', exact: true })
      await search.focus()
      await page.keyboard.press('Enter')
      await expect(links(page)).toHaveCount(3)
      await expect(search).toBeFocused()
      await expect.soft(status).toContainText(/3 flight comparison links.*London to Lisbon/i)
      await expect(links(page).first()).toHaveAttribute('href', `https://www.kayak.com/flights/LHR-LIS/${date}?sort=price_a`)
      await page.locator('#flight-depart').fill('2030-01-11')
      await expect.soft(status).toContainText('Jan 11, 2030')
      await expect(links(page).first()).toHaveAttribute('href', 'https://www.kayak.com/flights/LHR-LIS/2030-01-11?sort=price_a')
      await page.locator('#flight-return').fill(date)
      await expect(form.getByRole('alert')).toHaveText('Return cannot be before departure.')
      await expect(links(page)).toHaveCount(0)
      await expect.soft(status).not.toContainText('3 flight comparison links')
      await form.getByRole('button', { name: 'Hotels', exact: true }).click()
      await expect.soft(status).toHaveText('')
      await page.locator('#hotel-destination').fill('Lisbon')
      await suggestion(page, 'Lisbon').click()
      await page.locator('#hotel-checkin').fill(date)
      await form.getByRole('button', { name: 'Search Hotels', exact: true }).click()
      await expect(links(page)).toHaveCount(6)
      await expect.soft(status).toContainText(/6 hotel comparison links.*Lisbon/i)
      const booking = new URL(await links(page).first().getAttribute('href'))
      const deepLink = new URL(booking.searchParams.get('link'))
      expect(booking.origin + booking.pathname).toBe('https://www.stay22.com/allez/booking')
      expect(booking.searchParams.get('campaign')).toBe('lll-hotels')
      expect(deepLink.searchParams.get('ss')).toBe('Lisbon')
      expect(deepLink.searchParams.get('checkin')).toBe(date)
      expect(deepLink.searchParams.get('group_adults')).toBe('2')
      await page.locator('#hotel-checkout').fill(date)
      await expect(form.getByRole('alert')).toHaveText('Check-out must be after check-in.')
      await expect(links(page)).toHaveCount(0)
      await expect(page).toHaveURL(/\/plan$/)
    })
  })
}
