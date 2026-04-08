// Pure seasonal helper functions — usable in both server and client components
// No React hooks, no 'use client' dependency

// Best months for each destination (1=Jan … 12=Dec)
export const BEST_MONTHS: Record<string, number[]> = {
  maldives: [11, 12, 1, 2, 3, 4],      // Nov–Apr dry season
  santorini: [5, 6, 9, 10],             // May–Jun, Sep–Oct
  queenstown: [12, 1, 2, 3],            // Dec–Mar NZ summer
  tokyo: [3, 4, 5, 10, 11],             // Mar–May, Oct–Nov
  'amalfi-coast': [5, 6, 9, 10],        // May–Jun, Sep–Oct
  kyoto: [3, 4, 5, 10, 11],             // Mar–May, Oct–Nov
  'maasai-mara': [7, 8, 9],             // Jul–Sep great migration
  patagonia: [12, 1, 2, 3],             // Nov–Mar Patagonia summer
  iceland: [6, 7, 8, 9],                // Jun–Sep
  bali: [4, 5, 6, 7, 8, 9, 10],        // Apr–Oct dry season
  singapore: [2, 3, 4],                 // Feb–Apr least rain
  lisbon: [5, 6, 9, 10],                // May–Jun, Sep–Oct
  dubai: [11, 12, 1, 2, 3],             // Nov–Mar
  barcelona: [4, 5, 6, 9, 10],          // Apr–Jun, Sep–Oct
  bangkok: [11, 12, 1, 2, 3],           // Nov–Mar
  amsterdam: [5, 6, 7, 8, 9],           // May–Sep
  'mexico-city': [11, 12, 1, 2, 3, 4], // Nov–Apr
  marrakech: [3, 4, 5, 10, 11],         // Mar–May, Oct–Nov
  helsinki: [6, 7, 8],                  // Jun–Aug
  'cape-town': [11, 12, 1, 2, 3],       // Nov–Mar
  london: [5, 6, 7, 8, 9], paris: [5, 6, 7, 8, 9], vienna: [5, 6, 7, 8, 9], berlin: [5, 6, 7, 8, 9], prague: [5, 6, 7, 8, 9], warsaw: [5, 6, 7, 8, 9], krakow: [5, 6, 7, 8, 9], budapest: [4, 5, 6, 7, 8, 9], bucharest: [4, 5, 6, 7, 8, 9, 10], rome: [4, 5, 6, 9, 10], florence: [4, 5, 6, 7, 8, 9, 10], milan: [4, 5, 6, 7, 8, 9, 10], venice: [4, 5, 6, 7, 8, 9, 10], nice: [4, 5, 6, 7, 8, 9, 10], lyon: [5, 6, 7, 8, 9], bordeaux: [5, 6, 7, 8, 9], zurich: [6, 7, 8, 9], geneva: [6, 7, 8, 9], stockholm: [6, 7, 8], copenhagen: [5, 6, 7, 8, 9], reykjavik: [6, 7, 8, 9], edinburgh: [5, 6, 7, 8, 9], manchester: [5, 6, 7, 8, 9], dublin: [5, 6, 7, 8, 9], madrid: [4, 5, 6, 9, 10], seville: [3, 4, 5, 10, 11], munich: [5, 6, 7, 8, 9], brussels: [5, 6, 7, 8, 9], athens: [4, 5, 6, 7, 8, 9, 10], 'st-petersburg': [6, 7, 8], istanbul: [4, 5, 6, 9, 10], antalya: [4, 5, 6, 9, 10], cairo: [10, 11, 12, 1, 2, 3], 'hong-kong': [10, 11, 12, 1, 2, 3], shanghai: [3, 4, 5, 10, 11], beijing: [4, 5, 6, 9, 10], shenzhen: [10, 11, 12, 1, 2, 3], guangzhou: [10, 11, 12, 1, 2, 3], taipei: [3, 4, 5, 10, 11], seoul: [4, 5, 6, 9, 10], osaka: [3, 4, 5, 10, 11], 'kuala-lumpur': [2, 3, 4], phuket: [11, 12, 1, 2, 3, 4], pattaya: [11, 12, 1, 2, 3, 4], 'ho-chi-minh': [12, 1, 2, 3, 4], mumbai: [10, 11, 12, 1, 2, 3], delhi: [10, 11, 12, 1, 2, 3], bangalore: [10, 11, 12, 1, 2, 3, 4], macau: [10, 11, 12, 1, 2, 3], sydney: [12, 1, 2, 3], melbourne: [12, 1, 2, 3], 'new-york': [4, 5, 6, 9, 10], 'los-angeles': [3, 4, 5, 6, 7, 8, 9, 10], 'san-francisco': [7, 8, 9, 10], chicago: [6, 7, 8, 9], boston: [6, 7, 8, 9], seattle: [6, 7, 8, 9], miami: [12, 1, 2, 3, 4], 'las-vegas': [3, 4, 5, 10, 11], orlando: [3, 4, 5, 10, 11], cancun: [12, 1, 2, 3, 4], toronto: [6, 7, 8], vancouver: [6, 7, 8, 9], 'washington-dc': [4, 5, 6, 7, 8, 9, 10], philadelphia: [5, 6, 7, 8, 9], nashville: [4, 5, 6, 9, 10], 'new-orleans': [2, 3, 4, 5, 10, 11], austin: [3, 4, 5, 10, 11], portland: [6, 7, 8, 9], 'san-diego': [3, 4, 5, 6, 7, 8, 9, 10], tampa: [11, 12, 1, 2, 3, 4], phoenix: [3, 4, 5, 10, 11], denver: [6, 7, 8], bogota: [12, 1, 2, 3, 4], 'buenos-aires': [12, 1, 2, 3], lima: [12, 1, 2, 3, 4], 'sao-paulo': [4, 5, 6, 7, 8, 9, 10], casablanca: [4, 5, 6, 7, 8, 9, 10], nairobi: [6, 7, 8, 9], johannesburg: [5, 6, 7, 8, 9, 10]
}

// Seasonal status for editorial priority:
// 'in_season'     — currently in the Goldilock Zone (best months)
// 'coming_soon'   — enters Goldilock Zone within the next 2 months
// 'out_of_season' — not in season and not coming within 2 months
export type SeasonalStatus = 'in_season' | 'coming_soon' | 'out_of_season'

export function getSeasonalStatus(guideId: string, month: number): SeasonalStatus {
  const bestMonths = BEST_MONTHS[guideId] ?? []
  if (bestMonths.includes(month)) return 'in_season'

  // Check next 2 months for "coming into season" editorial window
  for (let offset = 1; offset <= 2; offset++) {
    const checkMonth = ((month - 1 + offset) % 12) + 1
    if (bestMonths.includes(checkMonth)) return 'coming_soon'
  }
  return 'out_of_season'
}

// Returns the month number (1-12) when this destination enters its next Goldilock window
export function getNextGoldilockMonth(guideId: string, fromMonth: number): number | null {
  const bestMonths = BEST_MONTHS[guideId] ?? []
  if (bestMonths.length === 0) return null
  // Search 12 months ahead
  for (let offset = 1; offset <= 12; offset++) {
    const checkMonth = ((fromMonth - 1 + offset) % 12) + 1
    if (bestMonths.includes(checkMonth)) return checkMonth
  }
  return null
}

// Returns human-readable short month name from number (1-12)
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function monthName(monthNum: number): string {
  return MONTH_SHORT[(monthNum - 1) % 12] ?? '??'
}

// Returns best months as a formatted string, e.g. "Nov–Apr"
export function getGoldilockMonthsLabel(guideId: string): string {
  const months = BEST_MONTHS[guideId] ?? []
  if (months.length === 0) return 'Year-round'
  const sorted = [...months].sort((a, b) => a - b)
  // Find contiguous groups
  const groups: string[] = []
  let groupStart = sorted[0]
  let groupPrev = sorted[0]
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i] !== groupPrev + 1) {
      // End of a group
      groups.push(groupStart === groupPrev ? `${MONTH_SHORT[groupStart - 1]}` : `${MONTH_SHORT[groupStart - 1]}–${MONTH_SHORT[groupPrev - 1]}`)
      if (i < sorted.length) {
        groupStart = sorted[i]
        groupPrev = sorted[i]
      }
    } else {
      groupPrev = sorted[i]
    }
  }
  return groups.join(', ')
}

// ─── Date range helpers ───────────────────────────────────────────────────────

export interface YearMonth {
  month: number // 1-12
  year: number
}

/** Returns all {month, year} pairs between fromDate and toDate (inclusive). */
export function getMonthsInRange(
  fromDate: string, // YYYY-MM-DD
  toDate: string    // YYYY-MM-DD
): YearMonth[] {
  const from = new Date(fromDate + 'T00:00:00')
  const to   = new Date(toDate   + 'T00:00:00')
  const result: YearMonth[] = []
  const cur = new Date(from)
  while (cur <= to) {
    result.push({ month: cur.getMonth() + 1, year: cur.getFullYear() })
    cur.setMonth(cur.getMonth() + 1)
  }
  return result
}

/** True if at least one month in the date range is within the guide's Goldilock window. */
export function isInGoldilockZoneForRange(
  guideId: string,
  fromDate: string,
  toDate: string
): boolean {
  const range = getMonthsInRange(fromDate, toDate)
  const bestMonths = BEST_MONTHS[guideId] ?? []
  return range.some(({ month }) => bestMonths.includes(month))
}

/** True if the destination enters its Goldilock window within the next `offset` months from `fromDate`. */
export function isComingIntoSeason(
  guideId: string,
  fromDate: string,
  offset: number = 2
): boolean {
  const bestMonths = BEST_MONTHS[guideId] ?? []
  if (bestMonths.length === 0) return false
  const range = getMonthsInRange(fromDate, toEndOfMonth(fromDate))
  // Check months beyond the range
  const lastInRange = range[range.length - 1]
  if (!lastInRange) return false
  for (let i = 1; i <= offset; i++) {
    const d = new Date(lastInRange.year, lastInRange.month - 1 + i, 1)
    if (bestMonths.includes(d.getMonth() + 1)) return true
  }
  return false
}

/** Returns the first in-season {month, year} in the given date range, or null. */
export function getFirstInSeasonMonth(
  guideId: string,
  fromDate: string,
  toDate: string
): YearMonth | null {
  const range = getMonthsInRange(fromDate, toDate)
  const bestMonths = BEST_MONTHS[guideId] ?? []
  return range.find(({ month }) => bestMonths.includes(month)) ?? null
}

/** Returns the last day of the month for a YYYY-MM-DD string. */
export function toEndOfMonth(date: string): string {
  const d = new Date(date + 'T00:00:00')
  d.setMonth(d.getMonth() + 1)
  d.setDate(0) // last day of previous month
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Formats a YYYY-MM-DD date as human-readable "Apr 1 – May 30, 2026". */
const MONTH_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
export function formatDateRange(fromDate: string, toDate: string): string {
  const from = new Date(fromDate + 'T00:00:00')
  const to   = new Date(toDate   + 'T00:00:00')
  const sameYear = from.getFullYear() === to.getFullYear()
  const sameMonth = sameYear && from.getMonth() === to.getMonth()

  const fromStr = `${MONTH_FULL[from.getMonth()]} ${from.getDate()}`
  const toStr  = `${MONTH_FULL[to.getMonth()]} ${to.getDate()}${sameYear ? ', ' + to.getFullYear() : ''}`
  return sameMonth
    ? `${MONTH_FULL[from.getMonth()]} ${from.getDate()}–${to.getDate()}, ${to.getFullYear()}`
    : `${fromStr} – ${toStr}`
}

/** Adds `months` calendar months to a YYYY-MM-DD date, returns new YYYY-MM-DD. */
export function addMonths(date: string, months: number): string {
  const d = new Date(date + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
