// Deliberately slim catalog projection: no photographs, guide prose or affiliate
// data in client bundles. trip-context.test.mjs checks exact source-catalog parity.
export interface TripDestination { readonly slug: string; readonly title: string }
export const TRIP_DESTINATIONS: readonly TripDestination[] = [
  { slug: 'maldives', title: 'Maldives' },
  { slug: 'santorini', title: 'Santorini' },
  { slug: 'queenstown', title: 'Queenstown' },
  { slug: 'tokyo', title: 'Tokyo' },
  { slug: 'amalfi-coast', title: 'Amalfi Coast' },
  { slug: 'kyoto', title: 'Kyoto' },
  { slug: 'maasai-mara', title: 'Maasai Mara' },
  { slug: 'patagonia', title: 'Patagonia' },
  { slug: 'iceland', title: 'Iceland' },
  { slug: 'bali', title: 'Bali' },
  { slug: 'singapore', title: 'Singapore' },
  { slug: 'lisbon', title: 'Lisbon' },
  { slug: 'dubai', title: 'Dubai' },
  { slug: 'barcelona', title: 'Barcelona' },
  { slug: 'bangkok', title: 'Bangkok' },
  { slug: 'amsterdam', title: 'Amsterdam' },
  { slug: 'mexico-city', title: 'Mexico City' },
  { slug: 'marrakech', title: 'Marrakech' },
  { slug: 'helsinki', title: 'Helsinki' },
  { slug: 'cape-town', title: 'Cape Town' },
  { slug: 'london', title: 'London' },
  { slug: 'paris', title: 'Paris' },
  { slug: 'vienna', title: 'Vienna' },
  { slug: 'berlin', title: 'Berlin' },
  { slug: 'prague', title: 'Prague' },
  { slug: 'warsaw', title: 'Warsaw' },
  { slug: 'krakow', title: 'Krakow' },
  { slug: 'budapest', title: 'Budapest' },
  { slug: 'bucharest', title: 'Bucharest' },
  { slug: 'rome', title: 'Rome' },
  { slug: 'florence', title: 'Florence' },
  { slug: 'milan', title: 'Milan' },
  { slug: 'venice', title: 'Venice' },
  { slug: 'nice', title: 'Nice' },
  { slug: 'lyon', title: 'Lyon' },
  { slug: 'bordeaux', title: 'Bordeaux' },
  { slug: 'zurich', title: 'Zurich' },
  { slug: 'geneva', title: 'Geneva' },
  { slug: 'stockholm', title: 'Stockholm' },
  { slug: 'copenhagen', title: 'Copenhagen' },
  { slug: 'reykjavik', title: 'Reykjavik' },
  { slug: 'edinburgh', title: 'Edinburgh' },
  { slug: 'manchester', title: 'Manchester' },
  { slug: 'dublin', title: 'Dublin' },
  { slug: 'madrid', title: 'Madrid' },
  { slug: 'seville', title: 'Seville' },
  { slug: 'munich', title: 'Munich' },
  { slug: 'brussels', title: 'Brussels' },
  { slug: 'athens', title: 'Athens' },
  { slug: 'st-petersburg', title: 'St. Petersburg' },
  { slug: 'istanbul', title: 'Istanbul' },
  { slug: 'antalya', title: 'Antalya' },
  { slug: 'cairo', title: 'Cairo' },
  { slug: 'hong-kong', title: 'Hong Kong' },
  { slug: 'shanghai', title: 'Shanghai' },
  { slug: 'beijing', title: 'Beijing' },
  { slug: 'shenzhen', title: 'Shenzhen' },
  { slug: 'guangzhou', title: 'Guangzhou' },
  { slug: 'taipei', title: 'Taipei' },
  { slug: 'seoul', title: 'Seoul' },
  { slug: 'osaka', title: 'Osaka' },
  { slug: 'kuala-lumpur', title: 'Kuala Lumpur' },
  { slug: 'phuket', title: 'Phuket' },
  { slug: 'pattaya', title: 'Pattaya' },
  { slug: 'ho-chi-minh', title: 'Ho Chi Minh City' },
  { slug: 'mumbai', title: 'Mumbai' },
  { slug: 'delhi', title: 'Delhi' },
  { slug: 'bangalore', title: 'Bangalore' },
  { slug: 'macau', title: 'Macau' },
  { slug: 'sydney', title: 'Sydney' },
  { slug: 'melbourne', title: 'Melbourne' },
  { slug: 'new-york', title: 'New York' },
  { slug: 'los-angeles', title: 'Los Angeles' },
  { slug: 'san-francisco', title: 'San Francisco' },
  { slug: 'chicago', title: 'Chicago' },
  { slug: 'boston', title: 'Boston' },
  { slug: 'seattle', title: 'Seattle' },
  { slug: 'miami', title: 'Miami' },
  { slug: 'las-vegas', title: 'Las Vegas' },
  { slug: 'orlando', title: 'Orlando' },
  { slug: 'cancun', title: 'Cancun' },
  { slug: 'toronto', title: 'Toronto' },
  { slug: 'vancouver', title: 'Vancouver' },
  { slug: 'washington-dc', title: 'Washington D.C.' },
  { slug: 'philadelphia', title: 'Philadelphia' },
  { slug: 'nashville', title: 'Nashville' },
  { slug: 'new-orleans', title: 'New Orleans' },
  { slug: 'austin', title: 'Austin' },
  { slug: 'portland', title: 'Portland' },
  { slug: 'san-diego', title: 'San Diego' },
  { slug: 'tampa', title: 'Tampa' },
  { slug: 'phoenix', title: 'Phoenix' },
  { slug: 'denver', title: 'Denver' },
  { slug: 'bogota', title: 'Bogota' },
  { slug: 'buenos-aires', title: 'Buenos Aires' },
  { slug: 'lima', title: 'Lima' },
  { slug: 'sao-paulo', title: 'Sao Paulo' },
  { slug: 'casablanca', title: 'Casablanca' },
  { slug: 'nairobi', title: 'Nairobi' },
  { slug: 'johannesburg', title: 'Johannesburg' },
]
const destinations = new Map(TRIP_DESTINATIONS.map(destination => [destination.slug, destination]))
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export interface TripContext { destination: TripDestination | null; month: number | null }

export function validTripMonth(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 12 ? value : null
}
export function tripMonthName(month: number | null): string | null {
  return validTripMonth(month) === null ? null : MONTHS[month! - 1]
}

/** Reject duplicate and malformed fields individually; never repair a token. */
export function readTripContext(search: string): TripContext {
  const params = new URLSearchParams(search)
  const months = params.getAll('month')
  const slugs = params.getAll('destination')
  return {
    destination: slugs.length === 1 ? destinations.get(slugs[0]) ?? null : null,
    month: months.length === 1 && /^(?:[1-9]|1[0-2])$/.test(months[0]) ? Number(months[0]) : null,
  }
}
function monthQuery(month: number | null | undefined): string {
  return validTripMonth(month) === null ? '' : `month=${month}`
}
export function buildGuideHref(slug: string, month?: number | null): string {
  const path = destinations.has(slug) ? `/guides/${slug}` : '/guides'
  const query = monthQuery(month)
  return path + (query ? `?${query}` : '')
}
export function buildPlanHref(slug?: string | null, month?: number | null): string {
  const query = [slug && destinations.has(slug) ? `destination=${slug}` : '', monthQuery(month)].filter(Boolean).join('&')
  return `/plan${query ? `?${query}` : ''}#compare-prices`
}

/** Context links are navigation, not arbitrary URL/redirect forwarding. */
export function withTripMonth(href: string, month?: number | null): string {
  const match = /^(\/|\/guides|\/guides\/[a-z0-9-]+|\/plan)(?:\?([^#]*))?(#compare-prices)?$/.exec(href)
  if (!match) return `/${monthQuery(month) ? `?${monthQuery(month)}` : ''}`
  const [, path, query = '', hash = ''] = match
  if (path === '/plan') return buildPlanHref(readTripContext(query).destination?.slug, month)
  if (hash) return `/${monthQuery(month) ? `?${monthQuery(month)}` : ''}`
  if (path.startsWith('/guides/')) {
    const slug = path.slice('/guides/'.length)
    if (!destinations.has(slug)) return `/${monthQuery(month) ? `?${monthQuery(month)}` : ''}`
    return buildGuideHref(slug, month)
  }
  return path + (monthQuery(month) ? `?${monthQuery(month)}` : '')
}

interface ContextAirport { code: string; city: string; country: string; fullName: string }
/** Only exact known city matches or the existing verified Maldives gateway.
 * Multiple airports and broad regions require an explicit visitor choice. */
export function plannerDestination(context: TripContext, airports: readonly ContextAirport[]) {
  const destination = context.destination && destinations.get(context.destination.slug)
  const blank = { origin: '', departDate: '', returnDate: '' }
  if (!destination) return { ...blank, hotelDestination: '', flightDestination: '', airportCodes: [] as string[], gatewayNote: '' }
  const candidates = destination.slug === 'maldives'
    ? airports.filter(airport => airport.code === 'MLE' && airport.city === 'Male' && airport.country === 'Maldives')
    : airports.filter(airport => airport.city === destination.title)
  const airport = candidates.length === 1 ? candidates[0] : null
  return {
    ...blank,
    hotelDestination: destination.title,
    flightDestination: airport ? `${airport.city} (${airport.code})` : destination.title,
    airportCodes: airport ? [airport.code] : [],
    gatewayNote: airport
      ? `${airport.city} (${airport.code}) is the selected flight gateway for ${destination.title}. You can change it; check onward transfers.`
      : `Choose an arrival airport for ${destination.title}; replace the destination text to search city names or airport codes. No airport has been selected.`,
  }
}
