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
