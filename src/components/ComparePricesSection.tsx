'use client'

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { generateAffiliateLink } from '@/lib/affiliate'
import { useCurrency, CurrencyCode } from '@/components/CurrencyProvider'

interface Airport {
  code: string
  city: string
  country: string
  fullName: string
}

// Airport database with proper metro grouping
const AIRPORTS: Airport[] = [
  // North America - Multi-airport cities
  { code: 'JFK', city: 'New York', country: 'USA', fullName: 'John F. Kennedy International' },
  { code: 'LGA', city: 'New York', country: 'USA', fullName: 'LaGuardia' },
  { code: 'EWR', city: 'New York', country: 'USA', fullName: 'Newark Liberty International' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', fullName: 'Los Angeles International' },
  { code: 'BUR', city: 'Los Angeles', country: 'USA', fullName: 'Hollywood Burbank' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', fullName: 'San Francisco International' },
  { code: 'OAK', city: 'San Francisco', country: 'USA', fullName: 'Oakland International' },
  { code: 'SJC', city: 'San Jose', country: 'USA', fullName: 'San Jose International' },
  { code: 'ORD', city: 'Chicago', country: 'USA', fullName: "O'Hare International" },
  { code: 'MDW', city: 'Chicago', country: 'USA', fullName: 'Midway International' },
  { code: 'DFW', city: 'Dallas', country: 'USA', fullName: 'Dallas/Fort Worth International' },
  { code: 'DAL', city: 'Dallas', country: 'USA', fullName: 'Love Field' },
  { code: 'IAH', city: 'Houston', country: 'USA', fullName: 'Bush Intercontinental' },
  { code: 'HOU', city: 'Houston', country: 'USA', fullName: 'Hobby' },
  { code: 'DCA', city: 'Washington DC', country: 'USA', fullName: 'Reagan National' },
  { code: 'IAD', city: 'Washington DC', country: 'USA', fullName: 'Dulles International' },
  { code: 'BWI', city: 'Washington DC', country: 'USA', fullName: 'Baltimore-Washington' },
  
  // North America - Single airport cities
  { code: 'MIA', city: 'Miami', country: 'USA', fullName: 'Miami International' },
  { code: 'FLL', city: 'Fort Lauderdale', country: 'USA', fullName: 'Fort Lauderdale-Hollywood' },
  { code: 'LAS', city: 'Las Vegas', country: 'USA', fullName: 'Harry Reid International' },
  { code: 'SEA', city: 'Seattle', country: 'USA', fullName: 'Seattle-Tacoma International' },
  { code: 'BOS', city: 'Boston', country: 'USA', fullName: 'Logan International' },
  { code: 'DEN', city: 'Denver', country: 'USA', fullName: 'Denver International' },
  { code: 'ATL', city: 'Atlanta', country: 'USA', fullName: 'Hartsfield-Jackson International' },
  { code: 'PHX', city: 'Phoenix', country: 'USA', fullName: 'Sky Harbor International' },
  { code: 'PHL', city: 'Philadelphia', country: 'USA', fullName: 'Philadelphia International' },
  { code: 'TPA', city: 'Tampa', country: 'USA', fullName: 'Tampa International' },
  { code: 'MCO', city: 'Orlando', country: 'USA', fullName: 'Orlando International' },
  { code: 'SAN', city: 'San Diego', country: 'USA', fullName: 'San Diego International' },
  { code: 'PDX', city: 'Portland', country: 'USA', fullName: 'Portland International' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', fullName: 'Vancouver International' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', fullName: 'Toronto Pearson' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', fullName: 'Montreal-Trudeau' },
  { code: 'YYC', city: 'Calgary', country: 'Canada', fullName: 'Calgary International' },
  
  // Europe - Multi-airport cities
  { code: 'LHR', city: 'London', country: 'UK', fullName: 'Heathrow' },
  { code: 'LGW', city: 'London', country: 'UK', fullName: 'Gatwick' },
  { code: 'STN', city: 'London', country: 'UK', fullName: 'Stansted' },
  { code: 'LCY', city: 'London', country: 'UK', fullName: 'City Airport' },
  { code: 'CDG', city: 'Paris', country: 'France', fullName: 'Charles de Gaulle' },
  { code: 'ORY', city: 'Paris', country: 'France', fullName: 'Orly' },
  { code: 'BVA', city: 'Paris', country: 'France', fullName: 'Beauvais-Tille' },
  { code: 'FCO', city: 'Rome', country: 'Italy', fullName: 'Fiumicino' },
  { code: 'CIA', city: 'Rome', country: 'Italy', fullName: 'Ciampino' },
  { code: 'MXP', city: 'Milan', country: 'Italy', fullName: 'Malpensa' },
  { code: 'LIN', city: 'Milan', country: 'Italy', fullName: 'Linate' },
  { code: 'BGY', city: 'Milan', country: 'Italy', fullName: 'Bergamo' },
  
  // Europe - Single airport cities
  { code: 'MAD', city: 'Madrid', country: 'Spain', fullName: 'Adolfo Suarez-Barajas' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', fullName: 'El Prat' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', fullName: 'Schiphol' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', fullName: 'Frankfurt Airport' },
  { code: 'MUC', city: 'Munich', country: 'Germany', fullName: 'Munich Airport' },
  { code: 'BER', city: 'Berlin', country: 'Germany', fullName: 'Brandenburg' },
  { code: 'ZUR', city: 'Zurich', country: 'Switzerland', fullName: 'Zurich Airport' },
  { code: 'VIE', city: 'Vienna', country: 'Austria', fullName: 'Vienna International' },
  { code: 'CPH', city: 'Copenhagen', country: 'Denmark', fullName: 'Copenhagen Airport' },
  { code: 'ARN', city: 'Stockholm', country: 'Sweden', fullName: 'Arlanda' },
  { code: 'OSL', city: 'Oslo', country: 'Norway', fullName: 'Gardermoen' },
  { code: 'HEL', city: 'Helsinki', country: 'Finland', fullName: 'Vantaa' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', fullName: 'Dublin Airport' },
  { code: 'ATH', city: 'Athens', country: 'Greece', fullName: 'Eleftherios Venizelos' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', fullName: 'Istanbul Airport' },
  { code: 'SAW', city: 'Istanbul', country: 'Turkey', fullName: 'Sabiha Gokcen' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', fullName: 'Humberto Delgado' },
  { code: 'VCE', city: 'Venice', country: 'Italy', fullName: 'Marco Polo' },
  { code: 'PRG', city: 'Prague', country: 'Czech Republic', fullName: 'Vaclav Havel' },
  { code: 'WAW', city: 'Warsaw', country: 'Poland', fullName: 'Chopin' },
  { code: 'BUD', city: 'Budapest', country: 'Hungary', fullName: 'Ferenc Liszt' },
  
  // Asia - Multi-airport cities
  { code: 'NRT', city: 'Tokyo', country: 'Japan', fullName: 'Narita International' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', fullName: 'Haneda' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', fullName: 'Incheon International' },
  { code: 'GMP', city: 'Seoul', country: 'South Korea', fullName: 'Gimpo' },
  { code: 'PEK', city: 'Beijing', country: 'China', fullName: 'Capital International' },
  { code: 'PKX', city: 'Beijing', country: 'China', fullName: 'Daxing International' },
  { code: 'PVG', city: 'Shanghai', country: 'China', fullName: 'Pudong International' },
  { code: 'SHA', city: 'Shanghai', country: 'China', fullName: 'Hongqiao' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', fullName: 'Suvarnabhumi' },
  { code: 'DMK', city: 'Bangkok', country: 'Thailand', fullName: 'Don Mueang' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', fullName: 'Dubai International' },
  { code: 'DWC', city: 'Dubai', country: 'UAE', fullName: 'Al Maktoum' },
  
  // Asia - Single airport cities
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', fullName: 'Hong Kong International' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', fullName: 'Changi' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', fullName: 'KL International' },
  { code: 'CGK', city: 'Jakarta', country: 'Indonesia', fullName: 'Soekarno-Hatta' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', fullName: 'Ngurah Rai' },
  { code: 'MNL', city: 'Manila', country: 'Philippines', fullName: 'Ninoy Aquino' },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', fullName: 'Taoyuan' },
  { code: 'BOM', city: 'Mumbai', country: 'India', fullName: 'Chhatrapati Shivaji' },
  { code: 'DEL', city: 'Delhi', country: 'India', fullName: 'Indira Gandhi' },
  { code: 'BLR', city: 'Bangalore', country: 'India', fullName: 'Kempegowda' },
  { code: 'MAA', city: 'Chennai', country: 'India', fullName: 'Chennai International' },
  { code: 'TLV', city: 'Tel Aviv', country: 'Israel', fullName: 'Ben Gurion' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', fullName: 'Zayed International' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', fullName: 'Hamad International' },
  
  // Australia/Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', fullName: 'Kingsford Smith' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', fullName: 'Tullamarine' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', fullName: 'Brisbane Airport' },
  { code: 'PER', city: 'Perth', country: 'Australia', fullName: 'Perth Airport' },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', fullName: 'Auckland Airport' },
  
  // Africa/Middle East
  { code: 'CAI', city: 'Cairo', country: 'Egypt', fullName: 'Cairo International' },
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', fullName: 'O.R. Tambo' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', fullName: 'Cape Town International' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', fullName: 'Jomo Kenyatta' },
  { code: 'CMN', city: 'Casablanca', country: 'Morocco', fullName: 'Mohammed V' },
  
  // Latin America
  { code: 'MEX', city: 'Mexico City', country: 'Mexico', fullName: 'Benito Juarez' },
  { code: 'CUN', city: 'Cancun', country: 'Mexico', fullName: 'Cancun International' },
  { code: 'GRU', city: 'Sao Paulo', country: 'Brazil', fullName: 'Guarulhos' },
  { code: 'CGH', city: 'Sao Paulo', country: 'Brazil', fullName: 'Congonhas' },
  { code: 'GIG', city: 'Rio de Janeiro', country: 'Brazil', fullName: 'Galeao' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', fullName: 'Ezeiza' },
  { code: 'AEP', city: 'Buenos Aires', country: 'Argentina', fullName: 'Jorge Newbery' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', fullName: 'Arturo Merino Benitez' },
  { code: 'LIM', city: 'Lima', country: 'Peru', fullName: 'Jorge Chavez' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia', fullName: 'El Dorado' },
]

// Real booking site link generators — no fake prices
const FLIGHT_SUPPLIERS = [
  {
    id: 'kayak',
    name: 'Kayak',
    logoUrl: '/logos/kayak.png',
    color: '#4A148C',
    categories: ['Flights', 'Hotels'],
    buildUrl: (origin: string, dest: string, depart: string, returnDate?: string, currency: CurrencyCode = 'USD') => {
      // Kayak doesn't support currency via URL param — uses cookies/session
      if (returnDate) {
        return `https://www.kayak.com/flights/${origin}-${dest}/${depart}/${returnDate}?sort=price_a`
      }
      return `https://www.kayak.com/flights/${origin}-${dest}/${depart}?sort=price_a`
    },
  },
  {
    id: 'expedia',
    name: 'Expedia',
    logoUrl: '/logos/expedia.png',
    color: '#003E7E',
    categories: ['Flights', 'Hotels', 'Packages'],
    buildUrl: (origin: string, dest: string, depart: string, returnDate?: string, currency: CurrencyCode = 'USD') => {
      const currParam = currency !== 'USD' ? `&currency=${currency}` : ''
      if (returnDate) {
        return `https://www.expedia.com/Flights-Search?flight-type=on&mode=search&trip=roundtrip&leg1=from:${origin},to:${dest},departure:${depart}TANYT&leg2=from:${dest},to:${origin},departure:${returnDate}TANYT&passengers=adults:1${currParam}`
      }
      return `https://www.expedia.com/Flights-Search?flight-type=on&mode=search&trip=oneway&leg1=from:${origin},to:${dest},departure:${depart}TANYT&passengers=adults:1${currParam}`
    },
  },
  {
    id: 'google',
    name: 'Google Flights',
    logoUrl: '/logos/google.svg',
    color: '#4285F4',
    categories: ['Flights'],
    buildUrl: (origin: string, dest: string, depart: string, returnDate?: string, currency: CurrencyCode = 'USD') => {
      // Google Flights supports curr= param — confirmed working
      if (returnDate) {
        return `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${dest}+on+${depart}+return+${returnDate}&curr=${currency}`
      }
      return `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${dest}+on+${depart}&curr=${currency}`
    },
  },
]

// Hotel search links — powered by Stay22 Allez for reliable multi-OTA routing
// Stay22 auto-selects the best OTA (Booking.com, Expedia, Hotels.com, Vrbo, KAYAK, etc.)
// and handles geolocation, currency, and language routing automatically.
// Direct OTA URLs (Booking.com, Kayak, etc.) strip query params via redirects,
// so Stay22 is the only reliable way to deep-link hotel searches.
const STAY22_AID = process.env.NEXT_PUBLIC_STAY22_AID || '1193160bctld'

const HOTEL_SUPPLIERS = [
  {
    id: 'stay22',
    name: 'Compare All Sites',
    logoUrl: '/logos/stay22.svg',
    color: '#0891b2',
    categories: ['Hotels', 'Vacation Rentals'],
    buildUrl: (dest: string, checkin: string, checkout?: string, currency: CurrencyCode = 'USD') => {
      // Stay22 Allez SRP: searches across Booking.com, Expedia, Hotels.com, Vrbo, KAYAK, etc.
      // Stay22 handles currency via geolocation but accepts currency param as a hint
      let url = `https://www.stay22.com/allez/roam?aid=${STAY22_AID}&campaign=lll-hotels&address=${encodeURIComponent(dest)}&checkin=${checkin}`
      if (checkout) url += `&checkout=${checkout}`
      if (currency !== 'USD') url += `&currency=${currency}`
      return url
    },
  },
  {
    id: 'expedia',
    name: 'Expedia',
    logoUrl: '/logos/expedia.png',
    color: '#003E7E',
    categories: ['Hotels', 'Packages'],
    buildUrl: (dest: string, checkin: string, checkout?: string, currency: CurrencyCode = 'USD') => {
      // Expedia Hotel-Search is the only OTA that reliably accepts URL params
      const currParam = currency !== 'USD' ? `&currency=${currency}` : ''
      let url = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(dest)}&adults=2&d1=${checkin}`
      if (checkout) url += `&d2=${checkout}`
      url += currParam
      return url
    },
  },
  {
    id: 'kayak-stays',
    name: 'Kayak Stays',
    logoUrl: '/logos/kayak.png',
    color: '#4A148C',
    categories: ['Hotels', 'Flights'],
    buildUrl: (dest: string, checkin: string, checkout?: string, currency: CurrencyCode = 'USD') => {
      // Kayak stays URL format — use /stays/ path with SEO-style slug
      // Kayak doesn't support currency via URL param — uses cookies/session
      const slug = dest.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+$/, '')
      let url = `https://www.kayak.com/stays/${encodeURIComponent(slug)}-hotels`
      // Kayak doesn't reliably accept date params via URL, but include them for when it works
      if (checkout) url += `?checkin=${checkin}&checkout=${checkout}`
      else url += `?checkin=${checkin}`
      return url
    },
  },
]

// Helper: Get all airports for a city
function getAirportsByCity(cityName: string): Airport[] {
  const normalizedCity = cityName.toLowerCase().trim()
  return AIRPORTS.filter(a => a.city.toLowerCase() === normalizedCity)
}

// Helper: Search airports by query
function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return []
  const normalizedQuery = query.toLowerCase().trim()
  
  const cityMatches = AIRPORTS.filter(a => 
    a.city.toLowerCase().startsWith(normalizedQuery)
  )
  
  const codeMatches = AIRPORTS.filter(a => 
    a.code.toLowerCase().includes(normalizedQuery) &&
    !cityMatches.some(c => c.code === a.code)
  )
  
  return [...cityMatches, ...codeMatches].slice(0, 10)
}

export function ComparePricesSection() {
  const { currency } = useCurrency()
  // Search type
  const [searchType, setSearchType] = useState<'flights' | 'hotels'>('flights')
  
  // Form values
  const [originInput, setOriginInput] = useState('')
  const [destInput, setDestInput] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  
  // Selected airports (only for flights)
  const [selectedOriginAirports, setSelectedOriginAirports] = useState<string[]>([])
  const [selectedDestAirports, setSelectedDestAirports] = useState<string[]>([])
  
  // Autocomplete visibility
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)
  
  // Search state — whether we've submitted and should show results
  const [hasSearched, setHasSearched] = useState(false)
  
  // Refs
  const originRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginSuggestions(false)
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Get suggestions
  const originSuggestions = useMemo(() => {
    if (showOriginSuggestions && originInput.length >= 2) {
      return searchAirports(originInput)
    }
    return []
  }, [originInput, showOriginSuggestions])
  
  const destSuggestions = useMemo(() => {
    if (showDestSuggestions && destInput.length >= 2) {
      return searchAirports(destInput)
    }
    return []
  }, [destInput, showDestSuggestions])
  
  // Group suggestions by city
  const groupedOriginSuggestions = useMemo(() => {
    const groups: Record<string, Airport[]> = {}
    originSuggestions.forEach(airport => {
      if (!groups[airport.city]) groups[airport.city] = []
      groups[airport.city].push(airport)
    })
    return Object.entries(groups)
  }, [originSuggestions])
  
  const groupedDestSuggestions = useMemo(() => {
    const groups: Record<string, Airport[]> = {}
    destSuggestions.forEach(airport => {
      if (!groups[airport.city]) groups[airport.city] = []
      groups[airport.city].push(airport)
    })
    return Object.entries(groups)
  }, [destSuggestions])
  
  // Handle origin selection
  const handleOriginSelect = (airport: Airport) => {
    const cityAirports = getAirportsByCity(airport.city)
    const codes = cityAirports.map(a => a.code)
    setSelectedOriginAirports(codes)
    if (cityAirports.length > 1) {
      setOriginInput(`${airport.city} (${codes.join(', ')})`)
    } else {
      setOriginInput(`${airport.city} (${codes[0]})`)
    }
    setShowOriginSuggestions(false)
  }
  
  // Handle destination selection
  const handleDestSelect = (airport: Airport) => {
    const cityAirports = getAirportsByCity(airport.city)
    const codes = cityAirports.map(a => a.code)
    setSelectedDestAirports(codes)
    if (cityAirports.length > 1) {
      setDestInput(`${airport.city} (${codes.join(', ')})`)
    } else {
      setDestInput(`${airport.city} (${codes[0]})`)
    }
    setShowDestSuggestions(false)
  }
  
  // Handle input changes
  const handleOriginChange = (value: string) => {
    setOriginInput(value)
    if (!value) {
      setSelectedOriginAirports([])
    } else {
      setShowOriginSuggestions(true)
    }
  }
  
  const handleDestChange = (value: string) => {
    setDestInput(value)
    if (!value) {
      setSelectedDestAirports([])
    } else {
      setShowDestSuggestions(true)
    }
  }
  
  // Form validation
  const isFormValid = useMemo(() => {
    if (searchType === 'flights') {
      return selectedOriginAirports.length > 0 && selectedDestAirports.length > 0 && departDate
    }
    return originInput.trim() && destInput.trim() && departDate
  }, [searchType, selectedOriginAirports, selectedDestAirports, originInput, destInput, departDate])
  
  // Build real supplier links based on form state (currency-aware)
  const supplierLinks = useMemo(() => {
    if (!hasSearched) return []
    
    if (searchType === 'flights' && selectedOriginAirports.length > 0 && selectedDestAirports.length > 0) {
      const originCode = selectedOriginAirports[0]
      const destCode = selectedDestAirports[0]
      return FLIGHT_SUPPLIERS.map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        logoUrl: supplier.logoUrl,
        color: supplier.color,
        categories: supplier.categories,
        url: supplier.buildUrl(originCode, destCode, departDate, returnDate || undefined, currency),
      }))
    }
    
    if (searchType === 'hotels' && destInput.trim()) {
      const destCity = destInput.replace(/\s*\([A-Z,\s]+\)$/, '').trim()
      return HOTEL_SUPPLIERS.map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        logoUrl: supplier.logoUrl,
        color: supplier.color,
        categories: supplier.categories,
        url: supplier.buildUrl(destCity, departDate, returnDate || undefined, currency),
      }))
    }
    
    return []
  }, [hasSearched, searchType, selectedOriginAirports, selectedDestAirports, destInput, departDate, returnDate, currency])
  
  // Search handler — just show the redirect links (no fake API call)
  const handleSearch = () => {
    if (!isFormValid) return
    setHasSearched(true)
  }
  
  // Handle type switch
  const handleTypeChange = (type: 'flights' | 'hotels') => {
    setSearchType(type)
    setOriginInput('')
    setDestInput('')
    setSelectedOriginAirports([])
    setSelectedDestAirports([])
    setDepartDate('')
    setReturnDate('')
    setHasSearched(false)
  }
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  // Extract display city from input (strip airport codes)
  const getDisplayCity = (input: string) => input.replace(/\s*\([A-Z,\s]+\)$/, '').trim()
  
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#0891b2]"></span>
            <span className="text-[#0891b2] text-xs font-semibold uppercase tracking-widest">
              {searchType === 'flights' ? 'Flight Search' : 'Hotel Search'}
            </span>
            <span className="w-8 h-px bg-[#0891b2]"></span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--color-ink)' }}>
            Compare {searchType === 'flights' ? 'Flight' : 'Hotel'} Prices
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-ink-light)' }}>
            {searchType === 'flights' 
              ? 'Search live prices across Kayak, Expedia, and Google Flights. Click through to book at the best rate.'
              : 'Compare hotel rates across major booking sites via Stay22, Expedia, and Kayak. Click through to see real prices.'}
          </p>
        </div>
        
        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl border p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                <button
                  onClick={() => handleTypeChange('flights')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    searchType === 'flights' ? 'bg-white shadow-md' : 'hover:bg-black/5'
                  }`}
                  style={{ color: searchType === 'flights' ? '#0891b2' : 'var(--color-muted)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Flights
                </button>
                <button
                  onClick={() => handleTypeChange('hotels')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    searchType === 'hotels' ? 'bg-white shadow-md' : 'hover:bg-black/5'
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
              {/* Origin */}
              <div className="relative" ref={originRef}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'From (City or Airport)' : 'Destination'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={originInput}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => setShowOriginSuggestions(true)}
                    placeholder={searchType === 'flights' ? 'e.g., New York or JFK' : 'City name'}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 font-medium transition-all focus:outline-none focus:border-[#0891b2]"
                    style={{ 
                      borderColor: 'var(--color-border)', 
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-ink)'
                    }}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                
                {/* Autocomplete Dropdown */}
                {showOriginSuggestions && groupedOriginSuggestions.length > 0 && (
                  <div 
                    className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border max-h-60 overflow-auto"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {searchType === 'flights' ? (
                      groupedOriginSuggestions.map(([city, airports]) => (
                        <button
                          key={city}
                          onClick={() => handleOriginSelect(airports[0])}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>{city}</span>
                              <span className="text-sm ml-2" style={{ color: 'var(--color-muted)' }}>{airports[0].country}</span>
                            </div>
                            <div className="flex gap-1">
                              {airports.map(a => (
                                <span 
                                  key={a.code} 
                                  className="px-2 py-0.5 text-xs font-bold rounded"
                                  style={{ backgroundColor: 'var(--color-bg-subtle)', color: '#0891b2' }}
                                >
                                  {a.code}
                                </span>
                              ))}
                            </div>
                          </div>
                          {airports.length > 1 && (
                            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                              All {airports.length} airports included
                            </p>
                          )}
                        </button>
                      ))
                    ) : (
                      groupedOriginSuggestions.map(([city, airports]) => (
                        <button
                          key={city}
                          onClick={() => {
                            setOriginInput(city)
                            setShowOriginSuggestions(false)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{city}</span>
                          <span className="text-sm ml-2" style={{ color: 'var(--color-muted)' }}>{airports[0].country}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* Destination */}
              <div className="relative" ref={destRef}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'To (City or Airport)' : 'Hotel Area'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destInput}
                    onChange={(e) => handleDestChange(e.target.value)}
                    onFocus={() => setShowDestSuggestions(true)}
                    placeholder={searchType === 'flights' ? 'e.g., London or LHR' : 'Neighborhood'}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 font-medium transition-all focus:outline-none focus:border-[#0891b2]"
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
                
                {/* Autocomplete Dropdown */}
                {showDestSuggestions && groupedDestSuggestions.length > 0 && (
                  <div 
                    className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border max-h-60 overflow-auto"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {searchType === 'flights' ? (
                      groupedDestSuggestions.map(([city, airports]) => (
                        <button
                          key={city}
                          onClick={() => handleDestSelect(airports[0])}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>{city}</span>
                              <span className="text-sm ml-2" style={{ color: 'var(--color-muted)' }}>{airports[0].country}</span>
                            </div>
                            <div className="flex gap-1">
                              {airports.map(a => (
                                <span 
                                  key={a.code} 
                                  className="px-2 py-0.5 text-xs font-bold rounded"
                                  style={{ backgroundColor: 'var(--color-bg-subtle)', color: '#0891b2' }}
                                >
                                  {a.code}
                                </span>
                              ))}
                            </div>
                          </div>
                          {airports.length > 1 && (
                            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                              All {airports.length} airports included
                            </p>
                          )}
                        </button>
                      ))
                    ) : (
                      groupedDestSuggestions.map(([city, airports]) => (
                        <button
                          key={city}
                          onClick={() => {
                            setDestInput(city)
                            setShowDestSuggestions(false)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{city}</span>
                          <span className="text-sm ml-2" style={{ color: 'var(--color-muted)' }}>{airports[0].country}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
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
                  className="w-full px-4 py-3 rounded-lg border-2 font-medium transition-all focus:outline-none focus:border-[#0891b2] cursor-pointer"
                  style={{ 
                    borderColor: 'var(--color-border)', 
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                />
              </div>
              
              {/* Return/Check-out */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
                  {searchType === 'flights' ? 'Return (Optional)' : 'Check-out'}
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 font-medium transition-all focus:outline-none focus:border-[#0891b2] cursor-pointer"
                  style={{ 
                    borderColor: 'var(--color-border)', 
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                />
              </div>
            </div>
            
            {/* Search Button */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                onClick={handleSearch}
                disabled={!isFormValid}
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
                style={{ 
                  background: isFormValid
                    ? 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' 
                    : 'var(--color-muted)'
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search {searchType === 'flights' ? 'Flights' : 'Hotels'}
              </button>
              
              <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
                We earn a commission when you book through our links — at no extra cost to you.
              </p>
            </div>
          </div>
        </div>
        
        {/* Search Results — Real links to booking sites */}
        {hasSearched && supplierLinks.length > 0 && (
          <div className="max-w-4xl mx-auto">
            {/* Route Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 rounded-xl border" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'rgba(8, 145, 178, 0.05)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  {searchType === 'flights' ? 'Flights' : 'Hotels'}:{' '}
                  <span className="font-bold">{searchType === 'flights' ? getDisplayCity(originInput) : getDisplayCity(destInput)}</span>
                  {searchType === 'flights' && (
                    <>
                      {' → '}
                      <span className="font-bold">{getDisplayCity(destInput)}</span>
                    </>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  {formatDate(departDate)}
                  {returnDate && ` → ${formatDate(returnDate)}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                  Compare across
                </p>
                <p className="text-2xl font-bold" style={{ color: '#0891b2' }}>{supplierLinks.length} sites</p>
              </div>
            </div>
            
            {/* Supplier Grid — each links to a real booking site */}
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-subtle)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                  Click to see live {searchType === 'flights' ? 'flight' : 'hotel'} prices on each site
                </span>
              </div>
              
              <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {supplierLinks.map((supplier, index) => (
                  <a
                    key={supplier.id}
                    href={supplier.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between px-4 py-4 transition-all hover:bg-opacity-50"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <span className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full" 
                        style={{ 
                          backgroundColor: index === 0 ? '#0891b2' : 'var(--color-bg-subtle)',
                          color: index === 0 ? 'white' : 'var(--color-muted)'
                        }}>
                        {index + 1}
                      </span>
                      
                      {/* Supplier Logo */}
                      <div className="w-24 h-10 flex items-center justify-center">
                        <img
                          src={supplier.logoUrl}
                          alt={supplier.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const img = e.currentTarget
                            img.style.display = 'none'
                            const fallback = img.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                        <div
                          className="w-full h-full items-center justify-center font-display text-sm font-bold tracking-tight"
                          style={{ color: supplier.color, display: 'none' }}
                        >
                          {supplier.name}
                        </div>
                      </div>
                      
                      {/* Categories */}
                      <div className="hidden sm:flex flex-wrap gap-1">
                        {supplier.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] text-[#6b6560] uppercase tracking-wider border border-[#e8e0d4] px-1.5 py-0.5"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* CTA */}
                      <span className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }}>
                        Check Prices
                      </span>
                      <span className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }}>
                        Check
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Honest Disclaimer */}
            <div className="mt-4 p-4 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-muted)' }}>
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>How this works:</strong>{' '}
                  {searchType === 'flights' 
                    ? 'We send you directly to each booking site with your search details pre-filled. You see their real, live prices and book directly on their site. Prices may vary between sites depending on availability, airline, and when you search.'
                    : 'We send you directly to each hotel booking site with your destination and dates pre-filled. You see their real, live rates and book directly on their site. Rates may vary between sites depending on availability, room type, and when you search.'}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {/* Empty State — before search */}
        {!hasSearched && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--color-border)' }}>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--color-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {searchType === 'flights' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                )}
              </svg>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                Ready to compare {searchType === 'flights' ? 'flights' : 'hotels'}?
              </p>
              <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--color-muted)' }}>
                Enter your {searchType === 'flights' ? 'origin, destination' : 'destination'} and dates above. We&apos;ll send you directly to {searchType === 'flights' ? '3' : '3'} booking sites with your search pre-filled so you can compare real prices.
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Secure booking links</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Real prices from real sites</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>No booking fees</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
