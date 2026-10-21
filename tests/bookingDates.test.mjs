import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/lib/bookingDates.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
})
const { bookingDateError, isCalendarDate, localDateString, nextCalendarDay } =
  await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const today = '2030-01-10'

for (const [type, start, end, error] of [
  ['flights', today, '', null],
  ['flights', today, today, null],
  ['flights', today, '2030-01-11', null],
  ['flights', '2030-01-20', '2030-01-19', 'Return cannot be before departure.'],
  ['flights', '2030-01-09', '', 'Departure cannot be in the past.'],
  ['flights', today, '2030-01-09', 'Return cannot be in the past.'],
  ['hotels', today, '', null],
  ['hotels', today, '2030-01-11', null],
  ['hotels', today, today, 'Check-out must be after check-in.'],
  ['hotels', '2030-01-20', '2030-01-19', 'Check-out must be after check-in.'],
  ['hotels', '2030-01-09', '', 'Check-in cannot be in the past.'],
  ['hotels', '', '2030-01-09', 'Check-out cannot be in the past.'],
  ['flights', '2030-02-30', '', 'Enter a valid departure date.'],
  ['hotels', today, '2030-02-30', 'Enter a valid check-out date.'],
]) {
  test(`${type}: ${start} / ${end || 'optional end'} => ${error || 'valid'}`, () => {
    assert.equal(bookingDateError(type, start, end, today), error)
  })
}

test('rejects malformed dates and non-leap February 29; accepts leap day', () => {
  for (const date of ['', '2030-1-10', '2030-13-01', '2030-02-29', 'not-a-date']) assert.equal(isCalendarDate(date), false)
  assert.equal(isCalendarDate('2032-02-29'), true)
})

test('next day handles month, year and leap-day boundaries', () => {
  assert.equal(nextCalendarDay('2030-01-31'), '2030-02-01')
  assert.equal(nextCalendarDay('2030-12-31'), '2031-01-01')
  assert.equal(nextCalendarDay('2032-02-28'), '2032-02-29')
  assert.equal(nextCalendarDay('2032-02-29'), '2032-03-01')
})

test('today uses local components instead of UTC ISO day', () => {
  const previousTZ = process.env.TZ
  try {
    process.env.TZ = 'America/Vancouver'
    assert.equal(localDateString(new Date('2030-01-11T02:00:00Z')), today)
    process.env.TZ = 'Pacific/Auckland'
    assert.equal(localDateString(new Date('2030-01-10T20:00:00Z')), '2030-01-11')
  } finally {
    if (previousTZ === undefined) delete process.env.TZ
    else process.env.TZ = previousTZ
  }
})
