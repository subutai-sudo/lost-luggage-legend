import { DestinationGuide } from '@/data/destinationGuides'
import Link from 'next/link'

// Stay22 AID for affiliate tracking
const STAY22_AID = '1193160bctld'

// All available suppliers from Stay22
const SUPPLIERS = [
  {
    id: 'booking',
    name: 'Booking.com',
    logo: 'https://cf.bstatic.com/static/img/favicon/9dcade2ed29e99b4c4e7c84e329e1f1b2d34db56/favicon.ico',
    url: (dest: string) => `https://www.booking.com/search.html?ss=${encodeURIComponent(dest)}`,
    categories: ['Accommodation', 'Car rental', 'Flights'],
    color: '#003580',
  },
  {
    id: 'expedia',
    name: 'Expedia',
    logo: 'https://www.expedia.com/favicon.ico',
    url: (dest: string) => `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(dest)}&adults=2`,
    categories: ['Accommodation', 'Packages', 'Flights', 'Cars'],
    color: '#003E7E',
  },
  {
    id: 'hotels',
    name: 'Hotels.com',
    logo: 'https://www.hotels.com/favicon.ico',
    url: (dest: string) => `https://www.hotels.com/hotels/search?destination=${encodeURIComponent(dest)}`,
    categories: ['Accommodation'],
    color: '#C92527',
  },
  {
    id: 'agoda',
    name: 'Agoda',
    logo: 'https://www.agoda.com/favicon.ico',
    url: (dest: string) => `https://www.agoda.com/search?destination=${encodeURIComponent(dest)}`,
    categories: ['Accommodation'],
    color: '#FF5C35',
  },
  {
    id: 'vrbo',
    name: 'Vrbo',
    logo: 'https://www.vrbo.com/favicon.ico',
    url: (dest: string) => `https://www.vrbo.com/search?q=${encodeURIComponent(dest)}&adults=2`,
    categories: ['Vacation Rentals'],
    color: '#5D4ED5',
  },
  {
    id: 'kayak',
    name: 'KAYAK',
    logo: 'https://www.kayak.com/favicon.ico',
    url: (dest: string) => `https://www.kayak.com/hotels?dest=${encodeURIComponent(dest)}`,
    categories: ['Hotels', 'Flights', 'Cars', 'Packages'],
    color: '#4A148C',
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor',
    logo: 'https://www.tripadvisor.com/favicon.ico',
    url: (dest: string) => `https://www.tripadvisor.com/Hotels-${encodeURIComponent(dest.replace(' ', '_'))}`,
    categories: ['Hotels', 'Activities'],
    color: '#34E0A1',
  },
]

interface Props {
  guide: DestinationGuide
  destination: string // e.g. "Lisbon, Portugal"
}

export function PriceComparison({ guide, destination }: Props) {
  return (
    <div className="my-12 p-6 bg-white rounded-sm border border-[#d9d0c4]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="issue-label text-[#c9a96e] mb-1">Compare Prices</div>
          <h3 className="font-display text-2xl font-bold text-[#1a1814]">
            Where to stay in {guide.title}
          </h3>
          <p className="text-[#6b6560] text-sm mt-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            We aggregate the best deals from 7 suppliers — no need to check each one manually.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#6b6560] text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          <span className="text-[#c9a96e]">✦</span>
          <span>We may earn a commission — but we show you all options</span>
        </div>
      </div>

      {/* Supplier grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {SUPPLIERS.map((supplier) => {
          const url = supplier.url(destination)
          const encoded = Buffer.from(url).toString('base64url')
          return (
            <a
              key={supplier.id}
              href={`/go/${encoded}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex flex-col items-start p-4 border border-[#e8e0d4] hover:border-[#c9a96e] hover:shadow-md transition-all duration-200 rounded-sm"
            >
              {/* Supplier logo placeholder */}
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

              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                {supplier.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] text-[#6b6560] uppercase tracking-wider border border-[#e8e0d4] px-1.5 py-0.5"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Price hint */}
              <div className="flex items-center gap-1.5 mt-auto">
                <span
                  className="text-[#c9a96e] text-xs font-semibold group-hover:gap-2 transition-all"
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
                  className="text-[#c9a96e]"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </div>
            </a>
          )
        })}
      </div>

      {/* Attribution */}
      <div className="mt-5 pt-4 border-t border-[#e8e0d4] flex items-center justify-between">
        <span className="text-[#9a9a9a] text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          Prices and availability vary by supplier. Click to compare.
        </span>
        <span className="text-[#9a9a9a] text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          Affiliate links — see our{' '}
          <a href="/#about" className="text-[#c9a96e] hover:underline">
            disclosure
          </a>
        </span>
      </div>
    </div>
  )
}
