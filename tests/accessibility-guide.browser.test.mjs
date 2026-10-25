import { test, expect } from './browser-fixture.mjs'

// Use real sequential keyboard navigation, including macOS WebKit's all-control
// traversal. Never activate a supplier link or submit a form in these tests.
const tabKey = browserName => browserName === 'webkit' ? 'Alt+Tab' : 'Tab'
const inputFor = page => page.getByPlaceholder('Enter city or airport code', { exact: true })
const lhrFor = page => page.getByRole('button', { name: /^LHR\s+London\s+Heathrow/ })
const changeFor = page => page.getByRole('button', { name: 'Change departure city', exact: true })
const expectedUrl = 'https://www.kayak.com/flights/LHR-LIS/?sort=price_a'

async function tabTo(page, locator, browserName, max = 40) {
  for (let i = 0; i < max; i++) {
    if (await locator.evaluateAll(nodes => nodes.some(node => node === document.activeElement))) return
    await page.keyboard.press(tabKey(browserName))
  }
  await expect(locator).toBeFocused()
}

async function openGuide(page) {
  await page.goto('/guides/lisbon')
  // Leave approved fonts enabled; settle normal font delivery before geometry.
  await page.evaluate(() => document.fonts.ready)
  await expect(inputFor(page)).toBeVisible()
}

async function enterLondon(page, browserName) {
  await tabTo(page, inputFor(page), browserName)
  await page.keyboard.type('London')
  await expect(lhrFor(page)).toBeVisible()
}

async function expectSelection(page) {
  await expect(inputFor(page)).toHaveCount(0)
  await expect(page.getByText('LHR → 2-3 hrs', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Search flights on KAYAK', exact: true })).toHaveAttribute('href', expectedUrl)
}

// The booking fragment link starts a long smooth scroll. Pressing Tab mid-scroll
// races the browser's focus scroll against the in-flight animation and can
// strand the next focus target behind the sticky nav. Wait for the fragment
// scroll to actually move, then settle, so focus is judged from a stable page.
async function waitForFragmentScroll(page) {
  await page.waitForFunction(() => new Promise(resolve => {
    let last = window.scrollY, stable = 0, moved = false
    const step = () => {
      const y = window.scrollY
      if (y !== last) { moved = true; stable = 0 } else if (moved) { stable += 1 }
      last = y
      if (moved && stable >= 6) resolve(true)
      else requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }))
}

async function expectExposedFocus(locator) {
  await expect(locator).toBeFocused()
  // Poll across smooth scrolling rather than accepting a transient focus rect.
  await expect.poll(() => locator.evaluate(el => {
    const r = el.getBoundingClientRect()
    const nav = document.querySelector('nav')
    const navBottom = nav ? nav.getBoundingClientRect().bottom : 64
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const hit = document.elementFromPoint(x, y)
    return r.top >= Math.max(64, navBottom) && r.bottom <= innerHeight &&
      r.left >= 0 && r.right <= innerWidth && !!hit && (hit === el || el.contains(hit))
  })).toBe(true)
}

for (const key of ['Enter', 'Space']) {
  test(`guide airport suggestion selects with native ${key} and preserves focus order`, async ({ page, browserName }) => {
    await openGuide(page)
    await enterLondon(page, browserName)
    await tabTo(page, lhrFor(page), browserName)
    await page.keyboard.press(key)
    await expectSelection(page)
    await expect(changeFor(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(inputFor(page)).toBeFocused()
    await expect(inputFor(page)).toHaveValue('')
    await page.keyboard.type('London')
    await tabTo(page, lhrFor(page), browserName)
    await page.keyboard.press(key)
    await expect(changeFor(page)).toBeFocused()
  })
}

test('guide airport label persists and remains associated after text is entered', async ({ page, browserName }) => {
  await openGuide(page)
  const input = inputFor(page)
  await expect(page.getByLabel('Departure city or airport', { exact: true })).toHaveAttribute('id', /.+/)
  await enterLondon(page, browserName)
  const label = page.locator('label').filter({ hasText: /^Departure city or airport$/ })
  await expect(label).toBeVisible()
  const id = await input.getAttribute('id')
  expect(id).toBeTruthy()
  await expect(label).toHaveAttribute('for', id)
  expect(await page.locator('[id]').evaluateAll((nodes, id) => nodes.filter(n => n.id === id).length, id)).toBe(1)
})

test('guide labelled clear button clears text and returns input focus by keyboard', async ({ page, browserName }) => {
  await openGuide(page)
  await enterLondon(page, browserName)
  const input = inputFor(page)
  const clear = page.getByRole('button', { name: 'Clear departure airport search', exact: true })
  await page.keyboard.press(tabKey(browserName))
  await expect(clear).toBeFocused()
  await page.keyboard.press('Space')
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('')
})

test('guide Escape dismisses suggestions without blurring the departure input', async ({ page, browserName }) => {
  await openGuide(page)
  await enterLondon(page, browserName)
  await page.keyboard.press('Escape')
  await expect(lhrFor(page)).toHaveCount(0)
  await expect(inputFor(page)).toBeFocused()
  await expect(inputFor(page)).toHaveValue('London')
})

test('guide Escape from a suggestion returns focus to the departure input', async ({ page, browserName }) => {
  await openGuide(page)
  await enterLondon(page, browserName)
  await tabTo(page, lhrFor(page), browserName)
  await page.keyboard.press('Escape')
  await expect(lhrFor(page)).toHaveCount(0)
  await expect(inputFor(page)).toBeFocused()
})

test('guide suggestions close after keyboard focus leaves the widget', async ({ page, browserName }) => {
  await openGuide(page)
  await enterLondon(page, browserName)
  const firstBookingLink = page.locator('#book a').first()
  await tabTo(page, firstBookingLink, browserName)
  await expect(firstBookingLink).toBeFocused()
  await expect(lhrFor(page)).toHaveCount(0)
})

test('guide keyboard Change focuses the remounted input independently of selection focus', async ({ page, browserName }) => {
  await openGuide(page)
  await inputFor(page).fill('London')
  await lhrFor(page).click()
  await expectSelection(page)
  await tabTo(page, changeFor(page), browserName)
  await page.keyboard.press('Enter')
  await expect(inputFor(page)).toBeFocused()
  await page.keyboard.type('London')
  await expect(lhrFor(page)).toBeVisible()
})

test('guide mouse selection matches keyboard URL and focuses the change control', async ({ page }) => {
  await openGuide(page)
  await inputFor(page).fill('London')
  await lhrFor(page).click()
  await expectSelection(page)
  await expect(changeFor(page)).toBeFocused()
  await changeFor(page).click()
  await expect(inputFor(page)).toBeFocused()
})

test.describe('guide touch airport selection', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } })
  test('guide touch selection matches keyboard URL and restores input on change', async ({ page }) => {
    await openGuide(page)
    await inputFor(page).tap()
    await page.keyboard.type('London')
    await lhrFor(page).tap()
    await expectSelection(page)
    await expect(changeFor(page)).toBeFocused()
    await changeFor(page).tap()
    await expect(inputFor(page)).toBeFocused()
  })
})

for (const width of [320, 390]) {
  test.describe(`guide booking fragment at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } })
    test('guide booking fragment then Tab never hides active focus behind navigation', async ({ page, browserName }) => {
      await openGuide(page)
      await tabTo(page, page.getByRole('link', { name: /Explore booking options/ }), browserName)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/#book$/)
      await waitForFragmentScroll(page)
      await page.keyboard.press(tabKey(browserName))
      await page.waitForTimeout(1000)
      const active = page.locator(':focus')
      await expectExposedFocus(active)
      await expect(page.locator('#book a').first()).toBeFocused()
    })

    test('guide booking fragment sets deliberate focus and next Tab is exposed below navigation', async ({ page, browserName }) => {
      await openGuide(page)
      const bookingLink = page.getByRole('link', { name: /Explore booking options/ })
      await tabTo(page, bookingLink, browserName)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/#book$/)
      await expect(page.locator('#book')).toBeFocused()
      await waitForFragmentScroll(page)
      await page.keyboard.press(tabKey(browserName))
      const firstBookingLink = page.locator('#book a').first()
      await expectExposedFocus(firstBookingLink)
      // Recheck after settled smooth scrolling; inspect only, never follow it.
      await page.waitForTimeout(1000)
      await expectExposedFocus(firstBookingLink)
      await expect(inputFor(page)).not.toBeFocused()
    })
  })
}
