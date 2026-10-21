import { test, expect } from './browser-fixture.mjs'

const today = '2030-01-10'

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2030-01-10T20:00:00Z'))
  await page.goto('/')
  await expect(page.locator('#flight-depart')).toHaveAttribute('min', today)
})

async function flightForm(page) {
  const form = page.locator('#compare-prices')
  await form.getByLabel('From (City or Airport)', { exact: true }).fill('New York')
  await form.getByRole('button', { name: /New York\s*USA/ }).click()
  await form.getByLabel('To (City or Airport)', { exact: true }).fill('London')
  await form.getByRole('button', { name: /London\s*UK/ }).click()
  return form
}

async function hotelForm(page) {
  const form = page.locator('#compare-prices')
  await form.getByRole('button', { name: 'Hotels', exact: true }).click()
  await form.getByLabel('Destination', { exact: true }).fill('Lisbon')
  await form.getByLabel('Check-in', { exact: true }).click()
  return form
}

function supplierLinks(form) {
  return form.locator('a[rel~="sponsored"]')
}

test('one-way and same-day return flights produce valid links', async ({ page }) => {
  const form = await flightForm(page)
  await form.getByLabel('Depart', { exact: true }).fill(today)
  await form.getByRole('button', { name: 'Search Flights', exact: true }).click()
  await expect(supplierLinks(form)).toHaveCount(3)
  await expect(supplierLinks(form).first()).toHaveAttribute('href', `https://www.kayak.com/flights/JFK-LHR/${today}?sort=price_a`)
  await form.getByLabel('Return (Optional)', { exact: true }).fill(today)
  await expect(form.getByRole('button', { name: 'Search Flights', exact: true })).toBeEnabled()
  await expect(supplierLinks(form).first()).toHaveAttribute('href', `https://www.kayak.com/flights/JFK-LHR/${today}/${today}?sort=price_a`)
  await expect(form.getByRole('alert')).toHaveCount(0)
})

test('changing departure after a successful search blocks reversed links', async ({ page }) => {
  const form = await flightForm(page)
  await form.getByLabel('Depart', { exact: true }).fill('2030-01-11')
  await form.getByLabel('Return (Optional)', { exact: true }).fill('2030-01-15')
  await form.getByRole('button', { name: 'Search Flights', exact: true }).click()
  await expect(supplierLinks(form)).toHaveCount(3)
  await form.getByLabel('Depart', { exact: true }).fill('2030-01-20')
  await expect(form.getByRole('alert')).toHaveText('Return cannot be before departure.')
  await expect(form.getByRole('button', { name: 'Search Flights', exact: true })).toBeDisabled()
  await expect(supplierLinks(form)).toHaveCount(0)
  await expect(form.getByLabel('Return (Optional)', { exact: true })).toHaveAttribute('aria-describedby', 'booking-date-error')
  // Correcting the date restores only valid links, not the reversed pair.
  await form.getByLabel('Return (Optional)', { exact: true }).fill('2030-01-22')
  await expect(form.getByRole('alert')).toHaveCount(0)
  await expect(supplierLinks(form).first()).toHaveAttribute('href', /2030-01-20\/2030-01-22/)
})

test('manually entered past departure cannot be searched', async ({ page }) => {
  const form = await flightForm(page)
  await form.getByLabel('Depart', { exact: true }).fill('2030-01-09')
  await expect(form.getByRole('alert')).toHaveText('Departure cannot be in the past.')
  await expect(form.getByRole('button', { name: 'Search Flights', exact: true })).toBeDisabled()
  await expect(supplierLinks(form)).toHaveCount(0)
})

test('hotel checkout must follow checkin, including after a previous search', async ({ page }) => {
  const form = await hotelForm(page)
  await form.getByLabel('Check-in', { exact: true }).fill('2030-01-11')
  await expect(form.getByLabel('Check-out (Optional)', { exact: true })).toHaveAttribute('min', '2030-01-12')
  await form.getByLabel('Check-out (Optional)', { exact: true }).fill('2030-01-11')
  await expect(form.getByRole('alert')).toHaveText('Check-out must be after check-in.')
  await expect(form.getByRole('button', { name: 'Search Hotels', exact: true })).toBeDisabled()
  await form.getByLabel('Check-out (Optional)', { exact: true }).fill('2030-01-15')
  await form.getByRole('button', { name: 'Search Hotels', exact: true }).click()
  await expect(supplierLinks(form)).toHaveCount(6)
  const booking = new URL(await supplierLinks(form).first().getAttribute('href'))
  const deepLink = new URL(booking.searchParams.get('link'))
  expect(deepLink.searchParams.get('checkin')).toBe('2030-01-11')
  expect(deepLink.searchParams.get('checkout')).toBe('2030-01-15')
  await form.getByLabel('Check-in', { exact: true }).fill('2030-01-20')
  await expect(form.getByRole('alert')).toHaveText('Check-out must be after check-in.')
  await expect(supplierLinks(form)).toHaveCount(0)
})

test('hotel checkout remains optional and search-type changes clear prior results', async ({ page }) => {
  const form = await hotelForm(page)
  await form.getByLabel('Check-in', { exact: true }).fill(today)
  await form.getByRole('button', { name: 'Search Hotels', exact: true }).click()
  await expect(supplierLinks(form)).toHaveCount(6)
  const deepLink = new URL(new URL(await supplierLinks(form).first().getAttribute('href')).searchParams.get('link'))
  expect(deepLink.searchParams.has('checkout')).toBe(false)
  await form.getByRole('button', { name: 'Flights', exact: true }).click()
  await expect(form.getByLabel('Depart', { exact: true })).toHaveValue('')
  await expect(supplierLinks(form)).toHaveCount(0)
  await expect(form.getByRole('button', { name: 'Search Flights', exact: true })).toBeDisabled()
})

test('local calendar day remains selectable when UTC is already tomorrow', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2030-01-11T02:00:00Z'))
  await page.reload()
  await expect(page.locator('#flight-depart')).toHaveAttribute('min', today)
  const form = await flightForm(page)
  await form.getByLabel('Depart', { exact: true }).fill(today)
  await expect(form.getByRole('button', { name: 'Search Flights', exact: true })).toBeEnabled()
})

test('guide flight CTA uses the real date-entry form, not invented expired dates', async ({ page }) => {
  await page.goto('/guides/lisbon')
  const cta = page.getByRole('link', { name: /Compare Flights/ })
  await expect(cta).toHaveAttribute('href', '/#compare-prices')
  await expect(cta).not.toHaveAttribute('target', '_blank')
  await expect(page.locator('a[href*="2026-06-01"]')).toHaveCount(0)
  await cta.click()
  await expect(page).toHaveURL(/\/#compare-prices$/)
  await expect(page.locator('#compare-prices')).toBeInViewport()
})
