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

const editorialOrder = ['lisbon', 'kyoto', 'marrakech', 'santorini', 'tokyo', 'amalfi-coast', 'maldives', 'bali', 'iceland', 'cape-town', 'mexico-city', 'sydney', 'bangkok', 'buenos-aires']
// These source photos need a separate visual audit. Guides remain available in
// the complete index and matching count; don't promote known mismatches here.
const pendingPhotoReview = new Set(['patagonia', 'queenstown', 'helsinki', 'edinburgh', 'new-orleans', 'seville'])

export function isTravelMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12
}

export function getMonthSelection(guides: GoldilocksDestination[], month: number) {
  if (!isTravelMonth(month)) throw new RangeError('Travel month must be an integer from 1 to 12')
  const matches = guides.filter(guide => guide.months.includes(month))
  const featured = matches.find(guide => guide.id === MONTHLY_LEADS[month - 1])
  if (!featured) throw new Error(`Missing editorial feature for ${MONTH_NAMES[month - 1]}`)
  const order: readonly string[] = [featured.id, ...editorialOrder]
  const rank = (guide: GoldilocksDestination) => {
    const index = order.indexOf(guide.id)
    return index < 0 ? order.length : index
  }
  const shortlist = matches.filter(guide => !pendingPhotoReview.has(guide.id))
    .sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title)).slice(0, 6)
  if (shortlist.length !== 6) throw new Error(`Need six eligible editorial selections for month ${month}`)
  return { featured, shortlist, total: matches.length }
}

export function getMonthPreviews(guides: GoldilocksDestination[]) {
  return MONTHLY_LEADS.map((id, index) => {
    const guide = guides.find(guide => guide.id === id && guide.months.includes(index + 1))
    if (!guide) throw new Error(`Missing eligible month preview ${index + 1}`)
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
