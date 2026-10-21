export type BookingSearchType = 'flights' | 'hotels'

/** Date inputs use the visitor's calendar day, not UTC's (which can be tomorrow). */
export function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function nextCalendarDay(value: string): string {
  const date = new Date(`${value}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

/** Empty return/checkout is supported; a supplied hotel checkout must be later. */
export function bookingDateError(
  type: BookingSearchType,
  start: string,
  end: string,
  today: string,
): string | null {
  const startLabel = type === 'flights' ? 'Departure' : 'Check-in'
  const endLabel = type === 'flights' ? 'Return' : 'Check-out'
  if (start && !isCalendarDate(start)) return `Enter a valid ${startLabel.toLowerCase()} date.`
  if (end && !isCalendarDate(end)) return `Enter a valid ${endLabel.toLowerCase()} date.`
  if (start && today && start < today) return `${startLabel} cannot be in the past.`
  if (end && today && end < today) return `${endLabel} cannot be in the past.`
  if (start && end) {
    if (type === 'hotels' && end <= start) return 'Check-out must be after check-in.'
    if (type === 'flights' && end < start) return 'Return cannot be before departure.'
  }
  return null
}
