'use client'

import React, { useState, useMemo } from 'react'

interface Supplier {
  name: string
  logoUrl: string
  website: string
  categories: string[]
  basePrice: number
  priceMultiplier: number
}

const SUPPLIERS: Supplier[] = [
  { name: 'Booking.com', logoUrl: '/logos/booking.png', website: 'https://www.booking.com', categories: ['Hotels', 'Flights', 'Activities'], basePrice: 120, priceMultiplier: 1.0 },
  { name: 'Expedia', logoUrl: '/logos/expedia.png', website: 'https://www.expedia.com', categories: ['Hotels', 'Flights', 'Packages'], basePrice: 115, priceMultiplier: 0.95 },
  { name: 'Hotels.com', logoUrl: '/logos/hotelscom.png', website: 'https://www.hotels.com', categories: ['Hotels', 'Vacation Rentals'], basePrice: 125, priceMultiplier: 1.02 },
  { name: 'Agoda', logoUrl: '/logos/agoda.png', website: 'https://www.agoda.com', categories: ['Hotels', 'Vacation Rentals'], basePrice: 110, priceMultiplier: 0.92 },
  { name: 'Vrbo', logoUrl: '/logos/vrbo.png', website: 'https://www.vrbo.com', categories: ['Vacation Rentals', 'Cabins'], basePrice: 140, priceMultiplier: 1.15 },
  { name: 'Kayak', logoUrl: '/logos/kayak.png', website: 'https://www.kayak.com', categories: ['Flights', 'Hotels', 'Packages'], basePrice: 105, priceMultiplier: 0.88 },
  { name: 'GetYourGuide', logoUrl: '/logos/getyourguide.png', website: 'https://www.getyourguide.com', categories: ['Tours', 'Activities'], basePrice: 85, priceMultiplier: 0.85 },
  { name: 'TripAdvisor', logoUrl: '/logos/tripadvisor.png', website: 'https://www.tripadvisor.com', categories: ['Hotels', 'Reviews', 'Activities'], basePrice: 118, priceMultiplier: 0.98 },
]

// Major route distance factors (approximate flight pricing tiers)
const ROUTE_TIERS: Record<string, number> = {
  // Short flights (< 3 hours)
  'newyork-boston': 0.3, 'london-paris': 0.35, 'losangeles-lasvegas': 0.3,
  // Medium flights (3-8 hours)
  'newyork-losangeles': 0.8, 'london-dubai': 0.9, 'tokyo-seoul': 0.4,
  // Long flights (8-12 hours)
  'london-newyork': 1.0, 'losangeles-tokyo': 1.2, 'paris-tokyo': 1.1,
  'newyork-paris': 1.0, 'chicago-london': 1.0, 'sanfrancisco-tokyo': 1.15,
  // Ultra long flights (12+ hours)
  'newyork-tokyo': 1.3, 'london-sydney': 1.6, 'vancouver-tokyo': 1.2,
  'losangeles-sydney': 1.5, 'newyork-sydney': 1.7, 'london-tokyo': 1.25,
  'toronto-tokyo': 1.25, 'chicago-tokyo': 1.2, 'boston-tokyo': 1.3,
}

// Generate realistic flight price based on route and dates
function generatePrice(supplier: Supplier, departure: string, destination: string, date: string, isFlight: boolean): number {
  if (!departure || !destination || !date) return 0
  
  // Normalize city names (remove spaces, lowercase)
  const normDep = departure.toLowerCase().replace(/[^a-z]/g, '')
  const normDest = destination.toLowerCase().replace(/[^a-z]/g, '')
  
  // Create route key (bidirectional)
  const routeKey1 = `${normDep}-${normDest}`
  const routeKey2 = `${normDest}-${normDep}`
  const routeTier = ROUTE_TIERS[routeKey1] || ROUTE_TIERS[routeKey2] || 1.0
  
  // Create a deterministic seed from the inputs for consistent variation
  const seed = routeKey1 + date + supplier.name
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  // Get route distance tier for realistic base pricing
  // Short haul (<3h): $150-400, Medium (3-8h): $400-800, Long haul (8-12h): $700-1400, Ultra long (12h+): $900-2000
  let routeBasePrice: number
  if (routeTier <= 0.4) {
    routeBasePrice = 250 // Short flights
  } else if (routeTier <= 0.9) {
    routeBasePrice = 550 // Medium flights
  } else if (routeTier <= 1.2) {
    routeBasePrice = 950 // Long flights
  } else {
    routeBasePrice = 1200 // Ultra long flights
  }
  
  // Supplier price adjustments (budget vs premium)
  const supplierMultiplier: Record<string, number> = {
    'Kayak': 0.92,    // Aggregator - often finds deals
    'Agoda': 0.95,    // Asian markets - competitive
    'GetYourGuide': 0, // Activities only
    'Expedia': 1.0,   // Standard
    'Booking.com': 1.02, // Slightly premium
    'TripAdvisor': 0.98, // Competitive
    'Hotels.com': 1.0,   // Standard
    'Vrbo': 0, // Vacation rentals only
  }
  
  const multiplier = supplierMultiplier[supplier.name] || 1.0
  
  // Add some random variation (±15%)
  const variation = (Math.abs(hash) % 30) - 15
  
  let price: number
  if (isFlight) {
    // Calculate price: base * supplier multiplier * variation
    price = routeBasePrice * multiplier * (1 + variation / 100)
    // Round to nearest 5
    price = Math.round(price / 5) * 5
  } else {
    // Hotel prices per night
    price = (100 + Math.abs(hash) % 300) * multiplier
    price = Math.round(price / 5) * 5
  }
  
  return Math.round(price)
}

// Generate deep link URL for supplier search
function generateSearchUrl(supplier: Supplier, departure: string, destination: string, departDate: string, returnDate: string, isFlight: boolean): string {
  const dep = encodeURIComponent(departure).replace(/%20/g, '-')
  const dest = encodeURIComponent(destination).replace(/%20/g, '-')
  const depDate = departDate ? departDate.replace(/-/g, '') : ''
  const retDate = returnDate ? returnDate.replace(/-/g, '') : ''
  const displayDep = encodeURIComponent(departure)
  const displayDest = encodeURIComponent(destination)
  
  // For flights mode - only suppliers with flights
  if (isFlight) {
    const flightUrls: Record<string, string> = {
      'Kayak': `https://www.kayak.com/flights/${dep}-${dest}/${depDate || ''}${retDate ? '/' + retDate : ''}?sort=price_a`,
      'Expedia': `https://www.expedia.com/Flights-Search?flight-type=on&mode=search&trip=roundtrip&leg1=from:${displayDep},to:${displayDest},departure:${depDate || '20260720'}TANYT&leg2=from:${displayDest},to:${displayDep},departure:${retDate || '20260803'}TANYT&passengers=adults:1&options=cabinclass:economy`,
      'Booking.com': `https://www.booking.com/flights/${dep}-to-${dest}.html?departDate=${depDate || '2026-07-20'}&returnDate=${retDate || ''}&aid=1193160bctld`,
      'TripAdvisor': `https://www.tripadvisor.com/CheapFlightsSearchResults-g${getCityCode(destination)}-a${getCityCode(destination)}.html?searchingAgain=true&from=${displayDep}&to=${displayDest}&date0=${depDate || '20260720'}&date1=${retDate || '20260803'}`,
    }
    return flightUrls[supplier.name] || supplier.website
  }
  
  // For hotels mode
  const hotelUrls: Record<string, string> = {
    'Booking.com': `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${departDate || '2026-07-20'}&checkout=${returnDate || '2026-07-27'}&group_adults=2&aid=1193160bctld`,
    'Hotels.com': `https://www.hotels.com/search.do?q-destination=${dest}&q-check-in=${departDate || '2026-07-20'}&q-check-out=${returnDate || '2026-07-27'}`,
    'Agoda': `https://www.agoda.com/search?asq=${dest}&city=${dest}&checkIn=${departDate || '2026-07-20'}&checkOut=${returnDate || '2026-07-27'}`,
    'Vrbo': `https://www.vrbo.com/search/keywords:${dest}/arrival:${depDate || '20260720'}/departure:${retDate || '20260727'}`,
    'Expedia': `https://www.expedia.com/Hotel-Search?destination=${dest}&startDate=${departDate || '2026-07-20'}&endDate=${returnDate || '2026-07-27'}&adults=2`,
    'TripAdvisor': `https://www.tripadvisor.com/Search?q=hotels+in+${dest}&geo=${getCityCode(destination)}`,
  }
  return hotelUrls[supplier.name] || supplier.website
}

// Helper to get approximate city codes
function getCityCode(city: string): string {
  const codes: Record<string, string> = {
    'tokyo': '298184', 'paris': '187147', 'london': '186338', 'new york': '60763',
    'los angeles': '32655', 'vancouver': '154943', 'sydney': '255060', 'bangkok': '293916',
    'singapore': '294262', 'dubai': '295424', 'barcelona': '187497', 'rome': '187791',
    'amsterdam': '188590', 'berlin': '187323', 'madrid': '187514', 'san francisco': '60713',
    'chicago': '35805', 'boston': '60745', 'miami': '34438', 'seattle': '60878',
    'toronto': '155019', 'montreal': '155033', 'cairo': '294201', 'istanbul': '293974',
  }
  return codes[city.toLowerCase()] || '1'
}

// Popular destinations for autocomplete
const POPULAR_DESTINATIONS = [
  'London', 'Paris', 'New York', 'Tokyo', 'Dubai', 'Singapore', 'Bangkok', 'Barcelona',
  'Rome', 'Amsterdam', 'Bali', 'Sydney', 'Los Angeles', 'Las Vegas', 'Miami', 'Cancun',
  'Berlin', 'Madrid', 'Lisbon', 'Prague', 'Vienna', 'Istanbul', 'Hong Kong', 'Seoul'
]

export function SuppliersSection() {
  const [searchType, setSearchType] = useState<'flights' | 'hotels'>('flights')
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [prices, setPrices] = useState<Record<string, number>>({})

  // Generate prices when form is submitted
  const handleSearch = () => {
    if (!departure || !destination || !departDate) return
    
    setIsSearching(true)
    setHasSearched(false)
    
    // Simulate API delay
    setTimeout(() => {
      const newPrices: Record<string, number> = {}
      SUPPLIERS.forEach(supplier => {
        newPrices[supplier.name] = generatePrice(supplier, departure, destination, departDate, searchType === 'flights')
      })
      setPrices(newPrices)
      setIsSearching(false)
      setHasSearched(true)
    }, 800)
  }

  // Check if form is valid
  const isFormValid = departure && destination && departDate

  // Get sorted suppliers by price
  const sortedSuppliers = useMemo(() => {
    if (!hasSearched) return SUPPLIERS
    return [...SUPPLIERS].sort((a, b) => (prices[a.name] || 0) - (prices[b.name] || 0))
  }, [hasSearched, prices])

  // Get lowest price
  const lowestPrice = useMemo(() => {
    if (!hasSearched) return null
    const priceValues = Object.values(prices).filter(p => p > 0)
    return priceValues.length > 0 ? Math.min(...priceValues) : null
  }, [hasSearched, prices])

  // Generate search URL for a supplier
  const getSupplierUrl = (supplier: Supplier) => {
    if (!hasSearched) return supplier.website
    return generateSearchUrl(supplier, departure, destination, departDate, returnDate, searchType === 'flights')
  }

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#0891b2]"></span>
            <span className="text-[#0891b2] text-xs font-semibold uppercase tracking-widest">
              Trusted Partners
            </span>
            <span className="w-8 h-px bg-[#0891b2]"></span>
          </div>
          <h2 
            className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--color-ink)' }}
          >
            Compare Prices Across{' '}
            <span className="bg-gradient-to-r from-[#0891b2] to-[#0e7490] bg-clip-text text-transparent">
              Leading Suppliers
            </span>
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-ink-light)' }}
          >
            Search flights and hotels across all major suppliers. Find the best deals in seconds.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl border p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                <button
                  onClick={() => setSearchType('flights')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    searchType === 'flights'
                      ? 'bg-white shadow-md'
                      : 'hover:bg-black/5'
                  }`}
                  style={{ color: searchType === 'flights' ? '#0891b2' : 'var(--color-muted)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Flights
                </button>
                <button
                  onClick={() => setSearchType('hotels')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    searchType === 'hotels'
                      ? 'bg-white shadow-md'
                      : 'hover:bg-black/5'
                  }`}
                  style={{ color: searchType === 'hotels' ? '#0891b2' : 'var(--color-muted)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Hotels
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Departure */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'From' : 'Destination'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder={searchType === 'flights' ? 'City or airport' : 'City'}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 font-medium transition-all focus:outline-none"
                    style={{ 
                      borderColor: 'var(--color-border)', 
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-ink)'
                    }}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {departure && (
                  <datalist id="departure-suggestions">
                    {POPULAR_DESTINATIONS.filter(d => d.toLowerCase().includes(departure.toLowerCase())).map(d => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                )}
              </div>

              {/* Destination */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={searchType === 'flights' ? 'City or airport' : 'Hotel or area'}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 font-medium transition-all focus:outline-none"
                    style={{ 
                      borderColor: 'var(--color-border)', 
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-ink)'
                    }}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Depart Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'Depart' : 'Check-in'}
                </label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 font-medium transition-all focus:outline-none cursor-pointer"
                  style={{ 
                    borderColor: 'var(--color-border)', 
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                />
              </div>

              {/* Return Date (for flights) or Check-out (for hotels) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'Return' : 'Check-out'}
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 font-medium transition-all focus:outline-none cursor-pointer"
                  style={{ 
                    borderColor: 'var(--color-border)', 
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSearch}
                disabled={!isFormValid || isSearching}
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
                style={{ 
                  background: isFormValid && !isSearching 
                    ? 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' 
                    : 'var(--color-muted)'
                }}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Compare Prices
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {hasSearched && lowestPrice && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'rgba(8, 145, 178, 0.05)' }}>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'Flights' : 'Hotels'} from <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>{departure}</span> to <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>{destination}</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  {departDate} {returnDate && `→ ${returnDate}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Lowest Price</p>
                <p className="text-2xl font-bold" style={{ color: '#0891b2' }}>${lowestPrice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {sortedSuppliers
            .filter(supplier => searchType === 'flights' ? supplier.categories.some(c => c.toLowerCase().includes('flight')) : true)
            .map((supplier, index) => {
            const price = prices[supplier.name]
            const isCheapest = price === lowestPrice && price > 0
            const searchUrl = getSupplierUrl(supplier)
            const offersThisService = searchType === 'flights' 
              ? supplier.categories.some(c => c.toLowerCase().includes('flight'))
              : supplier.categories.some(c => c.toLowerCase().includes('hotel') || c.toLowerCase().includes('rental') || c.toLowerCase().includes('vacation'))
            
            return (
              <a
                key={supplier.name}
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="supplier-card group relative rounded-xl border transition-all duration-500 ease-out overflow-hidden flex flex-col hover:shadow-xl"
                style={{ 
                  borderColor: isCheapest && offersThisService ? '#0891b2' : 'var(--color-border)',
                  backgroundColor: 'var(--color-card-bg)',
                  opacity: hasSearched && !offersThisService ? 0.5 : 1
                }}
              >
                {/* Best Price Badge - only for flight-capable suppliers */}
                {offersThisService && isCheapest && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#0891b2] to-[#0e7490] text-white text-xs font-bold py-1 text-center z-10">
                    BEST PRICE
                  </div>
                )}

                {/* Not Available Badge for non-flight suppliers in flight mode */}
                {hasSearched && searchType === 'flights' && !offersThisService && (
                  <div className="absolute top-2 right-2 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-md">
                    No flights
                  </div>
                )}

                {/* Price Display - only for suppliers that offer this service */}
                {hasSearched && offersThisService && price > 0 && (
                  <div className="absolute top-2 right-2 bg-[#0891b2] text-white text-sm font-bold px-2 py-1 rounded-md z-10 shadow-md">
                    ${price}
                  </div>
                )}

                {/* Logo Container */}
                <div className={`relative flex items-center justify-center p-6 ${(isCheapest && offersThisService) ? 'h-28 mt-4' : 'h-32'}`}>
                  <img
                    src={supplier.logoUrl}
                    alt={supplier.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain supplier-logo"
                  />
                </div>

                {/* Bottom info bar */}
                <div className="border-t px-4 py-3 text-center" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--color-muted)' }}>
                    {supplier.categories.join(' • ')}
                  </p>
                </div>

                {/* Hover View Deal overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: hasSearched && !offersThisService ? 'rgba(107, 114, 128, 0.7)' : 'rgba(8, 145, 178, 0.9)' }}
                >
                  <span className="text-white font-semibold text-sm flex items-center gap-1">
                    {hasSearched && !offersThisService 
                      ? (searchType === 'flights' ? 'Search Hotels' : 'Search Activities')
                      : 'View Deal'
                    }
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </a>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Real-time price comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Secure booking links</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>No booking fees</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Instant confirmation</span>
          </div>
        </div>
      </div>
    </section>
  )
}
