'use client'

import { useState } from 'react'
import { DestinationGuide } from '@/data/destinationGuides'

// Common departure cities with IATA codes
const DEPARTURE_CITIES = [
  { label: 'New York (JFK)', code: 'JFK', timezone: 'America/New_York' },
  { label: 'London (LHR)', code: 'LHR', timezone: 'Europe/London' },
  { label: 'Los Angeles (LAX)', code: 'LAX', timezone: 'America/Los_Angeles' },
  { label: 'Chicago (ORD)', code: 'ORD', timezone: 'America/Chicago' },
  { label: 'San Francisco (SFO)', code: 'SFO', timezone: 'America/Los_Angeles' },
  { label: 'Toronto (YYZ)', code: 'YYZ', timezone: 'America/Toronto' },
  { label: 'Dublin (DUB)', code: 'DUB', timezone: 'Europe/Dublin' },
  { label: 'Amsterdam (AMS)', code: 'AMS', timezone: 'Europe/Amsterdam' },
  { label: 'Paris (CDG)', code: 'CDG', timezone: 'Europe/Paris' },
  { label: 'Singapore (SIN)', code: 'SIN', timezone: 'Asia/Singapore' },
  { label: 'Sydney (SYD)', code: 'SYD', timezone: 'Australia/Sydney' },
  { label: 'Dubai (DXB)', code: 'DXB', timezone: 'Asia/Dubai' },
]

// Estimated flight time ranges in hours (nonstop / with connection)
// These are rough estimates based on great circle distance
function getFlightEstimate(departure: string, destination: string): string {
  // Major hub airport codes mapped to approximate coordinates
  const airportCoords: Record<string, [number, number]> = {
    JFK: [40.6413, -73.7781],
    LHR: [51.4700, -0.4543],
    LAX: [33.9416, -118.4085],
    ORD: [41.9742, -87.9073],
    SFO: [37.6213, -122.3790],
    YYZ: [43.6777, -79.6248],
    DUB: [53.4264, -6.2499],
    AMS: [52.3105, 4.7683],
    CDG: [49.0097, 2.5479],
    SIN: [1.3644, 103.9915],
    SYD: [-33.9399, 151.1753],
    DXB: [25.2532, 55.3657],
  }

  // Destination coordinates (approximate for major cities)
  const destCoords: Record<string, [number, number]> = {
    maldives: [3.2028, 73.2207],     // Malé
    santorini: [36.4072, 25.4456],
    queenstown: [-45.0312, 168.6626],
    tokyo: [35.5494, 139.7798],
    'amalfi-coast': [40.6333, 14.6029], // Naples area
    kyoto: [35.0116, 135.7681],
    'maasai-mara': [-1.4087, 35.0167],   // Nairobi area
    patagonia: [-41.8101, -68.9063],     // Bariloche area
    iceland: [63.9850, -16.5736],        // Keflavík
    bali: [-8.7468, 115.1628],           // Denpasan
    singapore: [1.3644, 103.9915],
    lisbon: [38.7756, -9.1354],
    dubai: [25.2532, 55.3657],
    barcelona: [41.2974, 2.0833],
    bangkok: [13.6900, 100.7501],
    amsterdam: [52.3105, 4.7683],
    'mexico-city': [19.4363, -99.0721],
    marrakech: [31.6061, -8.0363],
    helsinki: [60.3172, 24.9631],
    'cape-town': [-33.9715, 18.6021],
  }

  const dep = airportCoords[departure]
  const dest = destCoords[destination]

  if (!dep || !dest) return 'Varies'

  // Haversine formula for great circle distance
  const R = 6371 // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(dest[0] - dep[0])
  const dLon = toRad(dest[1] - dep[1])
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(dep[0])) *
      Math.cos(toRad(dest[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  // Estimate flight time: cruising speed ~850 km/h + 30 min takeoff/landing
  const directHours = Math.round(distance / 850)
  const connectHours = directHours + 3 // typical connection
  const connectHours2 = connectHours + 4 // with long connection

  if (directHours <= 2) return `${directHours}-${directHours + 1} hrs`
  if (directHours <= 5) return `${directHours}-${directHours + 1} hrs`
  if (directHours <= 8) return `${directHours}-${connectHours} hrs`
  if (directHours <= 12) return `${connectHours}-${connectHours2} hrs`
  return `${connectHours}+ hrs`
}

interface Props {
  guide: DestinationGuide
}

export function FlightSearch({ guide }: Props) {
  const [departure, setDeparture] = useState(DEPARTURE_CITIES[0])

  const estimate = getFlightEstimate(departure.code, guide.id)
  const flightUrl = `https://www.kayak.com/flights/${departure.code}-${guide.id.toUpperCase()}/?sort=price_a`
  // Browser-compatible base64url encoding
  const encoded = btoa(flightUrl).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <select
          value={departure.code}
          onChange={(e) => {
            const city = DEPARTURE_CITIES.find((c) => c.code === e.target.value)
            if (city) setDeparture(city)
          }}
          className="text-white font-semibold text-lg bg-transparent border-none cursor-pointer outline-none"
          style={{ fontFamily: "'Source Sans 3', sans-serif", maxWidth: '180px' }}
        >
          {DEPARTURE_CITIES.map((city) => (
            <option
              key={city.code}
              value={city.code}
              style={{ background: '#1e2d3d', color: '#fff' }}
            >
              {city.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span
          className="text-white text-xs uppercase tracking-wider"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Flight time
        </span>
        <span
          className="text-[#c9a96e] text-xs"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          {estimate}
        </span>
        <a
          href={`/go/${encoded}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-[#e8e0d4]/40 hover:text-[#c9a96e] text-xs ml-auto transition-colors"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Search flights →
        </a>
      </div>
    </div>
  )
}
