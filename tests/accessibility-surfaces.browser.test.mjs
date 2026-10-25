import { test, expect } from './browser-fixture.mjs'

// Resolve transparent/alpha ancestor backgrounds rather than assuming the body
// paints the surface. Photo surfaces are tested as two-tone indicators below;
// this helper deliberately refuses to certify image/gradient contrast.
async function colors(locator) {
  return locator.evaluate(element => {
    const rgba = value => value.match(/[\d.]+/g).map(Number)
    const layers = []
    const images = []
    for (let node = element; node; node = node.parentElement) {
      const style = getComputedStyle(node)
      layers.push(rgba(style.backgroundColor))
      if (style.backgroundImage !== 'none') images.push(style.backgroundImage)
    }
    const background = layers.reverse().reduce((under, over) => {
      const alpha = over[3] ?? 1
      return over.slice(0, 3).map((channel, i) => channel * alpha + under[i] * (1 - alpha))
    }, [255, 255, 255])
    const style = getComputedStyle(element)
    return { foreground: rgba(style.color).slice(0, 3), background, images,
      outline: rgba(style.outlineColor).slice(0, 3), outlineStyle: style.outlineStyle,
      outlineWidth: parseFloat(style.outlineWidth), outlineOffset: parseFloat(style.outlineOffset),
      shadow: style.boxShadow, focusVisible: element.matches(':focus-visible') }
  })
}

function contrast(a, b) {
  const luminance = rgb => rgb.map(c => c / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0)
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

async function readable(locator, label) {
  const actual = await colors(locator)
  console.log(label, JSON.stringify({ ...actual, ratio: contrast(actual.foreground, actual.background) }))
  expect.soft(actual.images, `${label}: solid painted surface`).toEqual([])
  expect.soft(contrast(actual.foreground, actual.background), `${label}: ordinary text contrast`).toBeGreaterThanOrEqual(4.5)
}

async function settleTheme(page, theme) {
  await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /\bdark\b/ : /^(?!.*\bdark\b)/)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {})))
  })
}

async function home(page, theme) {
  await page.goto('/?month=10')
  await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')
  await settleTheme(page, theme)
}

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} surface accessibility`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(value => localStorage.setItem('lll-theme', value), theme)
    })

    test('source disclosures keep visible words in their contextual accessible name', async ({ page, browserName }) => {
      await home(page, theme)
      const summaries = page.locator('[data-seasonal-note] summary')
      await expect(summaries).toHaveCount(6)
      for (const summary of await summaries.all()) {
        await expect(summary).toHaveText('Sources & checks +')
        const label = await summary.getAttribute('aria-label')
        expect.soft(label).toMatch(/^Sources & checks for .+ in October$/)
        expect(await summary.evaluate(el => el.parentElement.tagName)).toBe('DETAILS')
        // Playwright's simplified tree omits the native summary role/name in
        // both engines. Chromium CDP supplies the native AX name; WebKit has no
        // CDP AX API, so retain the explicit author-name contract there.
        if (browserName === 'chromium') {
          const session = await page.context().newCDPSession(page)
          const { nodes } = await session.send('Accessibility.getFullAXTree')
          const native = nodes.filter(node => node.role?.value === 'DisclosureTriangle')
          expect(native.length).toBe(6)
          for (const node of native) expect.soft(node.name?.value).toMatch(/^Sources & checks for .+ in October$/)
          await session.detach()
          break
        }
      }
    })

    test('native source disclosure supports Enter and Space without following source links', async ({ page, browserName }) => {
      await home(page, theme)
      const note = page.locator('[data-seasonal-note]').first()
      const summary = note.locator('summary')
      const details = note.locator('details')
      const initialURL = page.url()
      await summary.focus()
      await page.keyboard.press('Enter')
      await expect(details).toHaveAttribute('open', '')
      await expect(note.locator('[data-seasonal-source]').first()).toBeVisible()
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
      await expect(note.locator('[data-seasonal-source]').first()).toBeFocused()
      await summary.focus()
      await page.keyboard.press('Space')
      await expect(details).not.toHaveAttribute('open', '')
      expect(page.url()).toBe(initialURL)
    })

    test('shortlist eyebrow and ordinary title focus contrast use the actual paper surface', async ({ page }) => {
      await home(page, theme)
      await readable(page.getByText('Your seasonal shortlist', { exact: true }), 'shortlist eyebrow')
      const title = page.locator('#seasonal-results h3 a').first()
      await page.keyboard.press('Tab')
      await title.focus()
      const actual = await colors(title)
      console.log('shortlist focus', JSON.stringify({ ...actual, ratio: contrast(actual.outline, actual.background) }))
      expect(actual.focusVisible).toBe(true)
      expect(actual.outlineStyle).toBe('solid')
      expect(actual.outlineWidth).toBe(3)
      expect(actual.outlineOffset).toBe(5)
      expect(contrast(actual.outline, actual.background)).toBeGreaterThanOrEqual(3)
    })

    test('calendar keeps a contrasting focus ring on its dark band', async ({ page }) => {
      await home(page, theme)
      const month = page.locator('button[data-month="10"]')
      await page.keyboard.press('Tab')
      await month.focus()
      const actual = await colors(month)
      // The offset outline is painted on the containing band, not the photo
      // or selected button fill. Keep this measurement separate from text.
      const band = await colors(page.locator('button[data-month="10"]').locator('xpath=ancestor::section[1]'))
      expect(actual.focusVisible).toBe(true)
      expect(actual.outlineStyle).toBe('solid')
      expect(actual.outlineWidth).toBe(3)
      expect(contrast(actual.outline, band.background)).toBeGreaterThanOrEqual(3)
    })

    test('photo-scene focus uses a contrasting two-tone indicator without changing geometry', async ({ page }) => {
      await home(page, theme)
      const link = page.getByRole('link', { name: 'Choose your month' })
      const before = await link.boundingBox()
      await page.keyboard.press('Tab')
      await link.focus()
      const actual = await colors(link)
      const after = await link.boundingBox()
      const shadow = actual.shadow.match(/rgba?\(([^)]+)\)\s+0px\s+0px\s+0px\s+([\d.]+)px/)
      console.log('photo focus', JSON.stringify(actual))
      expect(actual.focusVisible).toBe(true)
      expect(actual.outlineStyle).toBe('solid')
      expect(actual.outlineWidth).toBe(3)
      expect(shadow, 'solid backing must surround both sides of the offset outline').not.toBeNull()
      if (shadow) {
        const backing = shadow[1].split(',').map(Number).slice(0, 3)
        expect(Number(shadow[2])).toBeGreaterThan(actual.outlineOffset + actual.outlineWidth)
        expect(contrast(actual.outline, backing)).toBeGreaterThanOrEqual(3)
      }
      expect(after.width).toBe(before.width)
      expect(after.height).toBe(before.height)
    })

    test('plan introduction ordinary copy and links meet text contrast in each theme', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 844 })
      await page.goto('/plan')
      await settleTheme(page, theme)
      await readable(page.getByText('Your next chapter', { exact: true }), 'plan eyebrow')
      const nav = page.getByRole('navigation', { name: 'Trip planning links' })
      for (const link of await nav.getByRole('link').all()) {
        const rect = await link.boundingBox()
        expect(rect.width, 'standalone introduction link target width').toBeGreaterThanOrEqual(24)
        expect(rect.height, 'standalone introduction link target height').toBeGreaterThanOrEqual(24)
        await readable(link, await link.innerText())
      }
      // The sticky navigation's logo sits above these links. At a particular
      // scroll position the gap measured 23.6px, just under the 24px minimum
      // spacing that axe-core uses for AA 2.5.8, and a partially scrolled link
      // was then reported as an undersized target. That gap is NOT a static
      // invariant: once the page scrolls and the nav pins, the same pair
      // measures about -46px (the link is above the pinned nav), so asserting a
      // rest-state threshold would pass with or without the rule, and asserting
      // the scrolled threshold would be meaningless. What is verifiable here is
      // the declaration that removes the shortfall, plus the settled-state sweep
      // (after-fonts/matrix-summary.json) that first reported it.
      const introNav = page.getByRole('navigation', { name: 'Trip planning links' })
      const inset = async () => introNav.evaluate(el => parseFloat(getComputedStyle(el).paddingTop))
      expect(await inset(), 'intro navigation carries the inset that clears the 24px spacing minimum').toBeGreaterThanOrEqual(2)
      // Sensitivity proof, so this guard cannot pass vacuously: suppressing the
      // inset must fail the same measurement.
      await page.addStyleTag({ content: 'nav[class*="introAccent"]{padding-top:0 !important}' })
      expect(await inset(), 'the guard detects removal of the inset').toBeLessThan(2)
    })

    test('internal Compare Flights is readable without recoloring supplier marks or changing URLs', async ({ page }) => {
      await page.goto('/guides/lisbon')
      await settleTheme(page, theme)
      const comparison = page.locator('[data-guide-comparison]')
      const action = comparison.getByRole('link', { name: /Compare Flights/ })
      await expect(action).toHaveAttribute('href', '/plan#compare-prices')
      await readable(action.getByText('Compare Flights', { exact: true }), 'ordinary Compare Flights action')
      for (const [supplier, color] of [['GetYourGuide', 'rgb(255, 90, 95)'], ['Tripadvisor', 'rgb(52, 224, 161)']]) {
        const mark = comparison.getByText(supplier, { exact: true })
        await expect(mark).toHaveCSS('color', color)
        await expect(comparison.getByRole('link', { name: new RegExp(supplier) })).toHaveAttribute('href', /^https:\/\/www\.stay22\.com\/allez\//)
      }
    })
  })
}
