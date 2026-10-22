import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { GoldilockZone } from '@/components/GoldilockZone'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Explore the Goldilocks Zone Map',
  description: 'Explore destination guides on an interactive world map. Choose a date range to browse editorial travel seasons, then open a guide to plan your trip.',
  path: '/explore',
})

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <main>
        <header className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-4">Another way to wander</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-5">Explore the Goldilocks Zone map</h1>
          <p className="text-ink-light text-lg leading-relaxed max-w-2xl">
            Prefer to explore by place? Choose a date range and open a destination on the map
            to read its guide. Seasonal windows are editorial suggestions, not live weather,
            crowd or price forecasts.
          </p>
          <nav aria-label="Destination discovery links" className="flex flex-wrap gap-6 mt-6 text-sm text-accent">
            <Link href="/" className="underline underline-offset-4">Find your travel month</Link>
            <Link href="/guides" className="underline underline-offset-4">Browse destination guides</Link>
          </nav>
        </header>
        <GoldilockZone />
      </main>
    </>
  )
}
