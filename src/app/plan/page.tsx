import { TripContextLink } from '@/components/TripContextLink'
import { Navbar } from '@/components/Navbar'
import { ComparePricesSection } from '@/components/ComparePricesSection'
import { pageMetadata } from '@/lib/site'
import { TravelTheme } from '@/components/TravelTheme'
import { TravelEditionStrip } from '@/components/TravelEditionStrip'
import styles from './PlanIntro.module.css'

export const metadata = pageMetadata({
  title: 'Plan Your Trip — Compare Flights and Hotels',
  description: 'Choose your airports, destination and travel dates, then compare flight and hotel options with trusted booking sites. Confirm live prices with each supplier.',
  path: '/plan',
})

export default function PlanPage() {
  return (
    <TravelTheme>
      <Navbar brandAppearance="cinematic" />
      <TravelEditionStrip />
      <main>
        <header className="max-w-6xl mx-auto px-6 lg:px-12 pt-16 lg:pt-20">
          <p className={`${styles.introAccent} text-xs font-semibold uppercase tracking-widest mb-4`}>From the first idea to take-off</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-5">Plan your trip</h1>
          <p className="text-ink-light text-lg leading-relaxed max-w-2xl">
            Found somewhere you want to go? Choose your airports and dates to compare flights,
            or search for a place to stay. Prices and availability are confirmed on each booking site.
          </p>
          <nav aria-label="Trip planning links" className={`${styles.introAccent} flex flex-wrap gap-6 mt-6 text-sm`}>
            <TripContextLink href="/" className="underline underline-offset-4">Find your travel month</TripContextLink>
            <TripContextLink href="/guides" className="underline underline-offset-4">Browse destination guides</TripContextLink>
          </nav>
        </header>
        <ComparePricesSection />
      </main>
    </TravelTheme>
  )
}
