import { test, expect } from './browser-fixture.mjs'

const guidePath = '/golf/oitavos-dunes'
const supportedMonths = [[1, 'January'], [3, 'March'], [10, 'October']]
const returnLinks = page => page.locator('[data-golf-finder-return]')

async function expectReturns(page, href) {
  await expect(returnLinks(page)).toHaveCount(2)
  const breadcrumb = page.getByRole('navigation', {name: 'Breadcrumb', exact: true}).getByRole('link', {name: 'Golf month finder', exact: true})
  await expect(breadcrumb).toHaveAttribute('href', href)
  await expect(page.getByRole('navigation', {name: 'Course guide footer', exact: true}).getByRole('link', {name: 'Golf month finder', exact: true})).toHaveAttribute('href', href)
  for (const link of await returnLinks(page).all()) await expect(link).toHaveAttribute('href', href)
}

// Pin an independently inspected course rather than reading expected links from
// the same implementation under test. Oitavos has no December editorial note.
test('contents precede the long visual section and link to every supported monthly note', async ({ page }) => {
  await page.goto(guidePath)
  const contents = page.getByRole('navigation', { name: 'In this course guide', exact: true })
  await expect(contents).toBeVisible()
  expect(await contents.evaluate(nav => Boolean(nav.compareDocumentPosition(document.querySelector('#course-visuals')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true)
  for (const [label, fragment] of [
    ['Course layout & photographs', '#course-visuals'],
    ['Playing notes', '#playing-notes'],
    ['Visitor access & tee times', '#visitor-access'],
    ['When to play', '#when-to-play'],
    ['Sources & checks', '#sources'],
  ]) await expect(contents.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', fragment)

  await expect(contents.locator('a[href^="#golf-month-"]')).toHaveCount(supportedMonths.length)
  for (const [month, name] of supportedMonths) {
    await expect(contents.getByRole('link', { name, exact: true })).toHaveAttribute('href', `#golf-month-${month}`)
    const target = page.locator(`#golf-month-${month}`)
    await expect(target).toHaveCount(1)
    expect(await target.evaluate(node => node.tagName)).toBe('SECTION')
    await expect(target).toHaveAttribute('tabindex', '-1')
    await expect(target.getByRole('heading', { name, exact: true })).toHaveCount(1)
  }
  const october = contents.getByRole('link', { name: 'October', exact: true })
  await october.focus()
  await page.keyboard.press('Enter')
  const target = page.locator('#golf-month-10')
  await expect(target).toBeFocused()
  await expect.poll(() => target.evaluate(node => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(64)
  await expect(target.getByRole('heading', { name: 'October', exact: true })).toBeInViewport()
  // Reduced motion makes fragment focus traversal deterministic, not an
  // assertion made during a still-running smooth scroll.
  await page.keyboard.press(test.info().project.name.includes('webkit') ? 'Alt+Tab' : 'Tab')
  await expect(target.locator('summary')).toBeFocused()
  await expect(target.locator('summary')).toBeInViewport()
})

for (const month of [1, 10, 12]) {
  test(`month ${month} is retained in both finder returns without inventing seasonal notes`, async ({ page }) => {
    await page.goto(`${guidePath}?month=${month}#course-visuals`)
    await expectReturns(page, `/golf?month=${month}#golf-results`)
    await expect(page.locator('[data-golf-reason]')).toHaveCount(supportedMonths.length)
    await expect(page.locator('#golf-month-12')).toHaveCount(0)
    if (month === 10) {
      await returnLinks(page).last().click()
      await expect(page).toHaveURL(/\/golf\?month=10#golf-results$/)
    }
  })
}

test('missing, malformed, duplicate and redirect-like context cannot change the native finder destination', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lll-theme', 'light'))
  for (const query of ['', '?month=0', '?month=13', '?month=1.5', '?month=01', '?month=-1', '?month=NaN', '?month=', '?month=1&month=10', '?month=https%3A%2F%2Fevil.example&returnTo=https%3A%2F%2Fevil.example']) {
    await page.goto(`${guidePath}${query}`)
    // Prove hydration has happened before accepting the fallback hrefs.
    await page.getByRole('button', { name: 'Switch to dark mode' }).click()
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
    await expectReturns(page, '/golf')
  }
  await page.goto(`${guidePath}?month=3&returnTo=https%3A%2F%2Fevil.example`)
  await expectReturns(page, '/golf?month=3#golf-results')
})

for (const theme of ['light', 'dark']) {
  test(`phone contents, focus and provenance remain readable in ${theme} theme`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.addInitScript(theme => localStorage.setItem('lll-theme', theme), theme)
    await page.goto(`${guidePath}?month=10`)
    if (theme === 'dark') await expect(page.locator('html')).toHaveClass(/dark/)
    else {
      await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
      await expect(page.locator('html')).not.toHaveClass(/dark/)
    }
    const credit = page.locator('[data-golf-hero-credit]')
    await expect(credit.getByRole('link', { name: 'Original & attribution', exact: true })).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:Oitavos_Dunes._05-18.jpg')
    await expect(credit.getByRole('link', { name: 'CC BY-SA 4.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/')
    const text = page.locator('[data-golf-hero-credit], [data-golf-guide-note], [data-golf-guide-sources] p, [data-golf-reason] details, [data-golf-reason] details li > span')
    expect(await text.count()).toBeGreaterThan(5)
    for (const size of await text.evaluateAll(nodes => nodes.map(node => parseFloat(getComputedStyle(node).fontSize)))) expect(size).toBeGreaterThanOrEqual(13)
    const contents = page.getByRole('navigation', { name: 'In this course guide', exact: true })
    for (const link of await contents.getByRole('link').all()) {
      const box = await link.boundingBox()
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(321)
      expect(box.height).toBeGreaterThanOrEqual(24)
    }
    await contents.getByRole('link', { name: 'Playing notes', exact: true }).focus()
    expect(await contents.getByRole('link', { name: 'Playing notes', exact: true }).evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none')
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
  })
}

test('without JavaScript the full guide, monthly anchors and fixed finder fallback are server rendered', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.route(url => ['scripts.stay22.com', 'plausible.io'].includes(url.hostname), route => route.abort())
  try {
    await page.goto(`${process.env.BROWSER_BASE_URL || 'http://localhost:3001'}${guidePath}?month=10`)
    await expectReturns(page, '/golf')
    await expect(page.locator('[data-golf-playing-notes]')).toBeVisible()
    await expect(page.locator('[data-golf-visitor-access]')).not.toBeEmpty()
    const october = page.getByRole('navigation', { name: 'In this course guide', exact: true }).getByRole('link', { name: 'October', exact: true })
    await october.click()
    await expect(page).toHaveURL(/\?month=10#golf-month-10$/)
    await expect(page.locator('#golf-month-10')).toHaveAttribute('tabindex', '-1')
    await expect(page.locator('#golf-month-10 h3')).toBeInViewport()
  } finally { await context.close() }
})

test.use({ reducedMotion: 'reduce' })
