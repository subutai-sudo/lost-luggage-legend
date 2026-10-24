export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const

export const MONTHLY_LEADS = ['maldives', 'cape-town', 'kyoto', 'marrakech', 'amalfi-coast', 'santorini', 'bali', 'maasai-mara', 'iceland', 'lisbon', 'mexico-city', 'sydney'] as const

export interface GoldilocksDestination {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  image: string
  months: number[]
}

// Month-specific editorial selections, not numerical rankings. Every slot is
// reviewed in seasonalShortlistReview.json; broad guide windows remain separate.
export const MONTHLY_SHORTLISTS: readonly (readonly string[])[] = [
  ['maldives', 'cape-town', 'mexico-city', 'sydney', 'bangkok', 'queenstown'],
  ['cape-town', 'maldives', 'mexico-city', 'sydney', 'bangkok', 'patagonia'],
  ['kyoto', 'marrakech', 'tokyo', 'maldives', 'cape-town', 'mexico-city'],
  ['marrakech', 'kyoto', 'tokyo', 'barcelona', 'bali', 'mexico-city'],
  ['amalfi-coast', 'lisbon', 'kyoto', 'marrakech', 'santorini', 'tokyo'],
  ['santorini', 'lisbon', 'amalfi-coast', 'bali', 'iceland', 'amsterdam'],
  ['bali', 'iceland', 'amsterdam', 'helsinki', 'berlin', 'edinburgh'],
  ['maasai-mara', 'bali', 'iceland', 'amsterdam', 'helsinki', 'berlin'],
  ['iceland', 'lisbon', 'santorini', 'amalfi-coast', 'bali', 'amsterdam'],
  ['lisbon', 'kyoto', 'marrakech', 'santorini', 'tokyo', 'amalfi-coast'],
  ['mexico-city', 'kyoto', 'marrakech', 'tokyo', 'seville', 'cape-town'],
  ['sydney', 'maldives', 'cape-town', 'mexico-city', 'bangkok', 'buenos-aires'],
]

export function isTravelMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12
}

function guideIndex(guides: GoldilocksDestination[]) {
  const index = new Map<string, GoldilocksDestination>()
  for (const guide of guides) {
    if (index.has(guide.id)) throw new Error(`Duplicate destination identity: ${guide.id}`)
    index.set(guide.id, guide)
  }
  return index
}

export function getMonthSelection(guides: GoldilocksDestination[], month: number) {
  if (!isTravelMonth(month)) throw new RangeError('Travel month must be an integer from 1 to 12')
  const byId = guideIndex(guides)
  const ids = MONTHLY_SHORTLISTS[month - 1]
  if (!ids || ids.length !== 6 || new Set(ids).size !== 6 || ids[0] !== MONTHLY_LEADS[month - 1]) {
    throw new Error(`Invalid editorial shortlist for ${MONTH_NAMES[month - 1]}`)
  }
  const shortlist = ids.map(id => {
    const guide = byId.get(id)
    if (!guide || !guide.months.includes(month)) throw new Error(`Missing eligible editorial selection: ${id}/${month}`)
    return guide
  })
  const featured = shortlist[0]
  const total = guides.filter(guide => guide.months.includes(month)).length
  return { featured, shortlist, total }
}

export function getMonthPreviews(guides: GoldilocksDestination[]) {
  const byId = guideIndex(guides)
  return MONTHLY_LEADS.map((id, index) => {
    const guide = byId.get(id)
    if (!guide || !guide.months.includes(index + 1)) throw new Error(`Missing eligible month preview ${index + 1}`)
    return guide
  })
}

export function readTravelMonth(search: string, fallback: number) {
  const value = new URLSearchParams(search).get('month')
  return value && /^(?:[1-9]|1[0-2])$/.test(value) ? Number(value) : fallback
}

export function discoveryImage(src: string, width: number) {
  const url = new URL(src)
  if (url.protocol !== 'https:' || url.hostname !== 'images.unsplash.com') throw new Error('Unsupported editorial image source')
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', '80')
  return url.href
}
