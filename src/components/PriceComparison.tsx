'use client'

import { DestinationGuide } from '@/data/destinationGuides'
import { useCurrency, CurrencyCode } from '@/components/CurrencyProvider'
import Link from 'next/link'

const STAY22_AID = process.env.NEXT_PUBLIC_STAY22_AID || '1193160bctld'

// Price Comparison Suppliers
// Per Stay22 docs: Booking.com, Kayak Hotels, Hotels.com, Agoda all strip URL params via redirects.
// Only Expedia Hotel-Search, Google Flights, GetYourGuide, and Tripadvisor preserve params reliably.
// Stay22 Allez /roam covers ALL hotel OTAs with smart geo-routing.
// Secondary links go through Stay22 allez/{ota} for tracking + geo-routing.

const SUPPLIERS = [
  {
    id: 'stay22',
    name: 'Compare All Sites',
    description: 'Best price across Booking.com, Expedia, Hotels.com, Vrbo, KAYAK & more',
    url: (dest: string, currency: CurrencyCode = 'USD') => {
      let url = `https://www.stay22.com/allez/roam?aid=${STAY22_AID}&campaign=lll-guide&address=${encodeURIComponent(dest)}`
      if (currency !== 'USD') url += `&currency=${currency}`
      return url
    },
    categories: ['Hotels', 'Vacation Rentals'],
    color: '#0891b2',
    featured: true,
  },
  {
    id: 'expedia',
    name: 'Expedia',
    description: 'Hotels, flights & packages',
    url: (dest: string, currency: CurrencyCode = 'USD') => {
      // Route through Stay22 allez/expedia for geo-routing + affiliate tracking
      const expediaDeepLink = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(dest)}&adults=2`
      let url = `https://www.stay22.com/allez/expedia?aid=${STAY22_AID}&campaign=lll-guide&link=${encodeURIComponent(expediaDeepLink)}`
      if (currency !== 'USD') url += `&currency=${currency}`
      return url
    },
    categories: ['Hotels', 'Packages'],
    color: '#003E7E',
    featured: false,
  },
  {
    id: 'kayak',
    name: 'KAYAK',
    description: 'Compare flights across airlines',
    url: (dest: string, currency: CurrencyCode = 'USD') => {
      // KAYAK flights uses path-based URLs which are reliable
      // Hotel search strips params, so we only link flights
      return `https://www.kayak.com/flights/to-${encodeURIComponent(dest)}/2026-06-01/2026-06-08?sort=bestflight_a`
    },
    categories: ['Flights'],
    color: '#FF690F',
    featured: false,
  },
  {
    id: 'getyourguide',
    name: 'GetYourGuide',
    description: 'Tours, activities & experiences',
    url: (dest: string, _currency: CurrencyCode = 'USD') => {
      // GetYourGuide doesn't support currency via URL param — uses cookies/session
      // Route through Stay22 allez/getyourguide for tracking
      const gygDeepLink = `https://www.getyourguide.com/s/${encodeURIComponent(dest)}/l4/`
      return `https://www.stay22.com/allez/getyourguide?aid=${STAY22_AID}&campaign=lll-guide&link=${encodeURIComponent(gygDeepLink)}`
    },
    categories: ['Activities', 'Tours'],
    color: '#FF5A5F',
    featured: false,
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor',
    description: 'Reviews & hotel comparisons',
    url: (dest: string, _currency: CurrencyCode = 'USD') => {
      // Tripadvisor doesn't support currency or date pre-fill via URL param
      // Route through Stay22 allez/tripadvisor for tracking
      const taDeepLink = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(dest)}`
      return `https://www.stay22.com/allez/tripadvisor?aid=${STAY22_AID}&campaign=lll-guide&link=${encodeURIComponent(taDeepLink)}`
    },
    categories: ['Hotels', 'Activities'],
    color: '#34E0A1',
    featured: false,
  },
]

interface Props {
  guide: DestinationGuide
  destination: string // e.g. "Lisbon, Portugal"
}

export function PriceComparison({ guide, destination }: Props) {
  const { currency } = useCurrency()
  const featured = SUPPLIERS.find(s => s.featured)
  const others = SUPPLIERS.filter(s => !s.featured)

  return (
    <div className="my-12 p-6 bg-card-bg rounded-sm border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="issue-label text-gold mb-1">Compare Prices</div>
          <h3 className="font-display text-2xl font-bold text-ink">
            Where to stay in {guide.title}
          </h3>
          <p className="text-muted text-sm mt-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Click through to compare live rates across booking sites.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-muted text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          <span className="text-gold">&#10022;</span>
          <span>Real prices from each site</span>
        </div>
      </div>

      {/* Featured Stay22 card — primary CTA */}
      {featured && (
        <a
          href={featured.url(destination, currency)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group flex items-center gap-4 p-5 border-2 border-[#0891b2] hover:border-[#067a95] hover:shadow-lg transition-all duration-200 rounded-sm mb-4"
          style={{ backgroundColor: '#0891b208' }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center rounded-sm shrink-0"
            style={{ backgroundColor: '#0891b215' }}
          >
            <span className="text-2xl">&#128269;</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold text-[#0891b2] group-hover:text-[#067a95]">
              {featured.name}
            </div>
            <p className="text-muted text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              {featured.description}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[#0891b2] text-sm font-semibold group-hover:gap-2 transition-all"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Search hotels
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#0891b2]"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </div>
        </a>
      )}

      {/* Other supplier grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {others.map((supplier) => {
          const url = supplier.url(destination, currency)
          return (
            <a
              key={supplier.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex flex-col items-start p-4 border border-sand hover:border-[#c9a96e] hover:shadow-md transition-all duration-200 rounded-sm"
            >
              {/* Supplier logo */}
              <div
                className="w-full h-10 flex items-center justify-center mb-3 rounded-sm"
                style={{ backgroundColor: supplier.color + '15' }}
              >
                <span
                  className="font-display text-lg font-bold tracking-tight"
                  style={{ color: supplier.color }}
                >
                  {supplier.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted text-xs mb-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {supplier.description}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                {supplier.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] text-muted uppercase tracking-wider border border-sand px-1.5 py-0.5"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 mt-auto">
                <span
                  className="text-gold text-xs font-semibold group-hover:gap-2 transition-all"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Check prices
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gold"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </div>
            </a>
          )
        })}
      </div>

      {/* Attribution */}
      <div className="mt-5 pt-4 border-t border-sand flex items-center justify-between">
        <span className="text-muted text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          Prices and availability vary by site. Click to see live rates.
        </span>
        <span className="text-muted text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          Affiliate links — see our{' '}
          <Link href="/affiliate-disclosure" className="text-gold hover:underline">
            disclosure
          </Link>
        </span>
      </div>
    </div>
  )
}
