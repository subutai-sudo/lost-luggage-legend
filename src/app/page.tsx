import type { Metadata } from 'next'
import { GoldilocksHome } from '@/components/GoldilocksHome'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import seasonalReasons from '@/data/seasonalReasons.json'
import { getSeasonalDisplayCatalog, type SeasonalCatalog } from '@/lib/seasonalReasons'
import { BEST_MONTHS } from '@/lib/seasonalHelpers'
import { siteUrl } from '@/lib/site'

const title = 'Goldilocks Zone — Find Your Right Time to Travel'
const description = 'Pick a travel month and discover a seasonal shortlist of destinations. Explore editorial travel guides with Goldilocks Zone by Lost Luggage Legend.'

export const metadata: Metadata = {
  title: { absolute: `${title} | Lost Luggage Legend` },
  description,
  alternates: { canonical: siteUrl('/') },
  openGraph: {
    title,
    description,
    url: siteUrl('/'),
    images: [{ url: 'https://images.unsplash.com/photo-1754151630904-da4334bddfbf?w=1200&q=80&auto=format&fit=crop', width: 1200, height: 630, alt: 'Goldilocks Zone — discover places through the calendar' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://images.unsplash.com/photo-1754151630904-da4334bddfbf?w=1200&q=80&auto=format&fit=crop'] },
}

export default function Home() {
  const now = new Date()
  const guides = DESTINATION_GUIDES.map(guide => ({
    id: guide.id, slug: guide.slug, title: guide.title, subtitle: guide.subtitle,
    excerpt: guide.excerpt, image: guide.heroImage, months: BEST_MONTHS[guide.id] ?? [],
  }))
  // Useful server-rendered content; the client synchronizes to the visitor's
  // local month (or an explicit ?month=) without a hydration mismatch.
  // Only the renderable projection crosses the client boundary.
  const seasonalCatalog = getSeasonalDisplayCatalog(seasonalReasons as SeasonalCatalog)
  return <GoldilocksHome guides={guides} initialMonth={now.getUTCMonth() + 1} year={now.getUTCFullYear()} seasonalCatalog={seasonalCatalog} />
}
