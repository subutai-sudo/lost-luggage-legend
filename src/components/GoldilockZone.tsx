'use client'

import { useState, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { DESTINATION_GUIDES, type DestinationGuide } from '@/data/destinationGuides'
import {
  BEST_MONTHS,
  isInGoldilockZoneForRange,
  isComingIntoSeason,
  getFirstInSeasonMonth,
  formatDateRange,
  addMonths,
} from '@/lib/seasonalHelpers'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const GUIDE_COORDS: Record<string, [number, number]> = {
maldives: [73.2207, 3.2028],
  santorini: [25.4456, 36.4072],
  queenstown: [168.6626, -45.0312],
  tokyo: [139.6503, 35.6762],
  'amalfi-coast': [14.6029, 40.6333],
  kyoto: [135.7681, 35.0116],
  'maasai-mara': [35.0167, -1.4087],
  patagonia: [-68.9063, -41.8101],
  iceland: [-21.9426, 64.1466],
  bali: [115.1889, -8.4095],
  singapore: [103.8198, 1.3521],
  lisbon: [-9.1393, 38.7223],
  dubai: [55.2708, 25.2048],
  barcelona: [2.1686, 41.3874],
  bangkok: [100.5018, 13.7563],
  amsterdam: [4.9041, 52.3676],
  'mexico-city': [-99.1332, 19.4326],
  marrakech: [-7.9811, 31.6295],
  helsinki: [24.9384, 60.1699],
  'cape-town': [18.4241, -33.9249],
  london: [-0.1278, 51.5074],
  paris: [2.3522, 48.8566],
  vienna: [16.3738, 48.2082],
  berlin: [13.405, 52.52],
  prague: [14.4378, 50.0755],
  warsaw: [21.0122, 52.2297],
  krakow: [19.945, 50.0647],
  budapest: [19.0402, 47.4979],
  bucharest: [26.1025, 44.4268],
  rome: [12.4964, 41.9028],
  florence: [11.2558, 43.7696],
  milan: [9.19, 45.4642],
  venice: [12.3155, 45.4408],
  nice: [7.262, 43.7102],
  lyon: [4.8357, 45.764],
  bordeaux: [-0.5792, 44.8378],
  zurich: [8.5417, 47.3769],
  geneva: [6.1432, 46.2044],
  stockholm: [18.0686, 59.3293],
  copenhagen: [12.5683, 55.6761],
  reykjavik: [-21.9426, 64.1466],
  edinburgh: [-3.1883, 55.9533],
  manchester: [-2.2426, 53.4808],
  dublin: [-6.2603, 53.3498],
  madrid: [-3.7038, 40.4168],
  seville: [-5.9845, 37.3891],
  munich: [11.582, 48.1351],
  brussels: [4.3517, 50.8503],
  athens: [23.7275, 37.9838],
  'st-petersburg': [30.3609, 59.9311],
  istanbul: [28.9784, 41.0082],
  antalya: [30.7133, 36.8969],
  cairo: [31.2357, 30.0444],
  'hong-kong': [114.1694, 22.3193],
  shanghai: [121.4737, 31.2304],
  beijing: [116.4074, 39.9042],
  shenzhen: [114.0579, 22.5431],
  guangzhou: [113.2644, 23.1291],
  taipei: [121.5654, 25.033],
  seoul: [126.978, 37.5665],
  osaka: [135.5023, 34.6937],
  'kuala-lumpur': [101.6869, 3.139],
  phuket: [98.3923, 7.8804],
  pattaya: [100.877, 12.9276],
  'ho-chi-minh': [106.6297, 10.8231],
  mumbai: [72.8777, 19.076],
  delhi: [77.1025, 28.7041],
  bangalore: [77.5946, 12.9716],
  macau: [113.5439, 22.1987],
  sydney: [151.2093, -33.8688],
  melbourne: [144.9631, -37.8136],
  'new-york': [-74.006, 40.7128],
  'los-angeles': [-118.2437, 34.0522],
  'san-francisco': [-122.4194, 37.7749],
  chicago: [-87.6298, 41.8781],
  boston: [-71.0589, 42.3601],
  seattle: [-122.3321, 47.6062],
  miami: [-80.1918, 25.7617],
  'las-vegas': [-115.1398, 36.1699],
  orlando: [-81.3792, 28.5383],
  cancun: [-86.8515, 21.1619],
  toronto: [-79.3832, 43.6532],
  vancouver: [-123.1207, 49.2827],
  'washington-dc': [-77.0369, 38.9072],
  philadelphia: [-75.1652, 39.9526],
  nashville: [-86.7816, 36.1627],
  'new-orleans': [-90.0715, 29.9511],
  austin: [-97.7431, 30.2672],
  portland: [-122.6784, 45.5152],
  'san-diego': [-117.1611, 32.7157],
  tampa: [-82.4572, 27.9506],
  phoenix: [-112.074, 33.4484],
  denver: [-104.9903, 39.7392],
  bogota: [-74.0721, 4.711],
  'buenos-aires': [-58.3816, -34.6037],
  lima: [-77.0428, -12.0464],
  'sao-paulo': [-46.6333, -23.5505],
  casablanca: [-7.5898, 33.5731],
  nairobi: [36.8219, -1.2921],
  johannesburg: [28.0473, -26.2041],

}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function isInGoldilockZone(guideId: string, month: number): boolean {
  return BEST_MONTHS[guideId]?.includes(month) ?? false
}

function getGoldilockMonths(guideId: string): string {
  const months = BEST_MONTHS[guideId] ?? []
  if (months.length === 0) return 'Year-round'
  const sorted = [...months].sort((a, b) => a - b)
  if (sorted.length === 12) return 'Year-round'
  // Group consecutive months
  const groups: string[] = []
  let start = sorted[0]
  let prev = sorted[0]
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i] !== prev + 1) {
      groups.push(start === prev ? MONTH_NAMES[start - 1].slice(0, 3) : `${MONTH_NAMES[start - 1].slice(0, 3)}–${MONTH_NAMES[prev - 1].slice(0, 3)}`)
      if (i < sorted.length) { start = sorted[i]; prev = sorted[i] }
    } else {
      prev = sorted[i]
    }
  }
  return groups.join(', ')
}

export function GoldilockZone() {
  // Use stable defaults to avoid SSR/hydration mismatch
  const [fromDate, setFromDate] = useState<string>('2026-04-01')
  const [toDate, setToDate]     = useState<string>('2026-05-01')

  const guides = useMemo(() => DESTINATION_GUIDES, [])

  // In the Goldilock Zone if ANY month in the date range is in season
  const inZone = useMemo(
    () => guides.filter((g) => isInGoldilockZoneForRange(g.id, fromDate, toDate)),
    [guides, fromDate, toDate]
  )

  // Coming into season — not in range, but enters season within 2 months of trip end
  const upcomingZone = useMemo(
    () =>
      guides.filter(
        (g) =>
          !isInGoldilockZoneForRange(g.id, fromDate, toDate) &&
          isComingIntoSeason(g.id, toDate, 2)
      ).sort((a, b) => {
        const fa = getFirstInSeasonMonth(a.id, toDate, addMonths(toDate, 12))
        const fb = getFirstInSeasonMonth(b.id, toDate, addMonths(toDate, 12))
        return (fa?.month ?? 12) - (fb?.month ?? 12)
      }),
    [guides, fromDate, toDate]
  )

  const outZone = useMemo(
    () =>
      guides.filter(
        (g) =>
          !isInGoldilockZoneForRange(g.id, fromDate, toDate) &&
          !isComingIntoSeason(g.id, toDate, 2)
      ),
    [guides, fromDate, toDate]
  )

  return (
    <section className="py-20 lg:py-28 bg-[#0f1c26]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="issue-label text-[#c9a96e] mb-3">Interactive Map</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              The Goldilock Zone
            </h2>
            <p className="text-white/50 mt-3 max-w-lg text-base" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Not too hot, not too cold — the best time to visit. Enter your travel dates to see
              which destinations are in their ideal window.
            </p>
          </div>

          {/* Date range selector */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-white/40 text-xs uppercase tracking-wider"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                Travelling from
              </label>
              <input
                type="date"
                value={fromDate}
                min="2026-01-01"
                max="2028-12-31"
                onChange={(e) => {
                  const newFrom = e.target.value
                  setFromDate(newFrom)
                  if (newFrom >= toDate) setToDate(addMonths(newFrom, 1))
                }}
                className="bg-[#1e2d3d] border border-[#1e2d3d] text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#c9a96e] cursor-pointer"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-white/40 text-xs uppercase tracking-wider"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                To
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max="2028-12-31"
                onChange={(e) => setToDate(e.target.value)}
                className="bg-[#1e2d3d] border border-[#1e2d3d] text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#c9a96e] cursor-pointer"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c9a96e] shadow-[0_0_8px_rgba(201,169,110,0.6)]" />
            <span className="text-white/60 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <span className="text-white font-semibold">{inZone.length}</span> in Goldilock Zone
            </span>
          </div>
          {upcomingZone.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
              <span className="text-white/40 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                <span className="text-white/60 font-semibold">{upcomingZone.length}</span> coming into season
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <span className="text-white/40 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <span className="text-white/60 font-semibold">{outZone.length}</span> off season
            </span>
          </div>
          <div className="ml-auto">
            <span className="text-[#c9a96e]/70 text-xs font-medium" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              {formatDateRange(fromDate, toDate)}
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="relative bg-[#1e2d3d]/50 rounded-sm overflow-hidden" style={{ height: '480px' }}>
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 160, center: [10, 0] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#d4e5f7"
                      stroke="#b8c8d8"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#bfd4ec' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Destination markers */}
              {guides.map((guide) => {
                const coords = GUIDE_COORDS[guide.id]
                if (!coords) return null
                const active = isInGoldilockZoneForRange(guide.id, fromDate, toDate)
                const comingSoon =
                  !active && isComingIntoSeason(guide.id, toDate, 2)
                const inSeasonMonth = getFirstInSeasonMonth(guide.id, fromDate, toDate)
                return (
                  <Marker
                    key={guide.id}
                    coordinates={coords as [number, number]}
                  >
                    {/* Pulse ring for in-season and coming-soon markers */}
                    {active && (
                      <circle
                        r={10}
                        fill="none"
                        stroke="#c9a96e"
                        strokeWidth={1}
                        opacity={0.4}
                        className="animate-ping"
                        style={{ animationDuration: '2s' }}
                      />
                    )}
                    {comingSoon && (
                      <circle
                        r={10}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth={1}
                        opacity={0.35}
                        className="animate-ping"
                        style={{ animationDuration: '3s' }}
                      />
                    )}
                    {/* Marker dot */}
                    <circle
                      r={active ? 5 : comingSoon ? 4 : 3}
                      fill={active ? '#c9a96e' : comingSoon ? '#60a5fa' : '#4a5568'}
                      stroke={active ? '#f9f6f0' : comingSoon ? '#bfdbfe' : '#2d3748'}
                      strokeWidth={active ? 1.5 : comingSoon ? 1.5 : 1}
                      style={{
                        filter: active
                          ? 'drop-shadow(0 0 4px rgba(201,169,110,0.8))'
                          : comingSoon
                          ? 'drop-shadow(0 0 4px rgba(96,165,250,0.8))'
                          : 'none',
                        cursor: 'pointer',
                      }}
                    />
                    {/* Invisible larger hit area */}
                    <circle
                      r={14}
                      fill="transparent"
                      className="cursor-pointer"
                      onClick={() => {
                        const el = document.getElementById(`guide-${guide.id}`)
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        el?.classList.add('ring-2', 'ring-[#c9a96e]')
                        setTimeout(() => el?.classList.remove('ring-2', 'ring-[#c9a96e]'), 2000)
                      }}
                    />
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-[#0f1c26]/80 backdrop-blur-sm border border-[#1e2d3d] rounded-sm px-4 py-2.5">
            <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c9a96e] shadow-[0_0_6px_rgba(201,169,110,0.6)]" />
                <span className="text-white/70">In Season Now</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
                <span className="text-white/70">Coming Into Season</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4a5568]" />
                <span className="text-white/40">Off Season</span>
              </div>
            </div>
          </div>
        </div>

        {/* Destination lists below map */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* In Zone */}
          <div className="bg-[#1e2d3d]/40 border border-[#c9a96e]/20 rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c9a96e] shadow-[0_0_6px_rgba(201,169,110,0.5)]" />
              <h3 className="font-display text-base font-bold text-white">
                In Season Now
              </h3>
              <span className="ml-auto text-[#c9a96e] text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#c9a96e]/10" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {inZone.length} guides live
              </span>
            </div>
            <p className="text-white/30 text-xs mb-4 -mt-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Best weather, peak season, optimal travel conditions
            </p>
            <div className="space-y-2.5">
              {inZone.map((guide) => (
                <a
                  key={guide.id}
                  id={`guide-${guide.id}`}
                  href={`/guides/${guide.slug}`}
                  className="group flex items-center justify-between p-3 rounded-sm hover:bg-[#1e2d3d]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: guide.themeColor + 'cc' }}
                    >
                      {guide.title.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold group-hover:text-[#c9a96e] transition-colors" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                        {guide.title}
                      </div>
                      <div className="text-white/40 text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                        {guide.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[#c9a96e] text-xs font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                      Best: {getGoldilockMonths(guide.id)}
                    </div>
                    <div className="text-white/30 text-xs mt-0.5 group-hover:translate-x-0.5 transition-transform">
                      Read guide →
                    </div>
                  </div>
                </a>
              ))}
              {inZone.length === 0 && (
                <p className="text-white/30 text-sm text-center py-6" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  No destinations are in their ideal window for these dates.
                </p>
              )}
            </div>
          </div>

          {/* Coming Into Season */}
          {upcomingZone.length > 0 && (
            <div className="bg-[#1e2d3d]/40 border border-[#60a5fa]/20 rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
                <h3 className="font-display text-base font-bold text-white/80">
                  Coming Into Season
                </h3>
                <span className="ml-auto text-[#60a5fa] text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#60a5fa]/10" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  {upcomingZone.length} guides in progress
                </span>
              </div>
              <p className="text-white/30 text-xs mb-4 -mt-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                Enters Goldilock Zone within 2 months of your trip — write now for peak search traffic
              </p>
              <div className="space-y-2.5">
                {upcomingZone.map((guide) => {
                  const firstInSeason = getFirstInSeasonMonth(guide.id, toDate, addMonths(toDate, 12))
                  return (
                    <a
                      key={guide.id}
                      id={`guide-${guide.id}`}
                      href={`/guides/${guide.slug}`}
                      className="group flex items-center justify-between p-3 rounded-sm hover:bg-[#1e2d3d]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: guide.themeColor + 'cc' }}
                        >
                          {guide.title.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-white/70 text-sm font-semibold group-hover:text-[#60a5fa] transition-colors" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                            {guide.title}
                          </div>
                          <div className="text-white/30 text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                            {guide.subtitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[#60a5fa] text-xs font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                          {firstInSeason ? `${firstInSeason.year} ${MONTH_NAMES[firstInSeason.month - 1].slice(0, 3)}` : 'Soon'}
                        </div>
                        <div className="text-white/20 text-xs mt-0.5 group-hover:translate-x-0.5 transition-transform">
                          Read guide →
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Out of Zone */}
          <div className="bg-[#1e2d3d]/20 border border-[#1e2d3d] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4a5568]" />
              <h3 className="font-display text-lg font-bold text-white/60">
                Outside the Window
              </h3>
              <span className="ml-auto text-white/30 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {outZone.length} destinations
              </span>
            </div>
            <div className="space-y-2.5">
              {outZone.map((guide) => (
                <a
                  key={guide.id}
                  id={`guide-${guide.id}`}
                  href={`/guides/${guide.slug}`}
                  className="group flex items-center justify-between p-3 rounded-sm hover:bg-[#1e2d3d]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white/50 flex-shrink-0"
                      style={{ backgroundColor: guide.themeColor + '40' }}
                    >
                      {guide.title.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white/50 text-sm font-semibold group-hover:text-white/70 transition-colors" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                        {guide.title}
                      </div>
                      <div className="text-white/25 text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                        {guide.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white/25 text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                      Best: {getGoldilockMonths(guide.id)}
                    </div>
                    <div className="text-white/20 text-xs mt-0.5 group-hover:translate-x-0.5 transition-transform">
                      Read guide →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-white/20 text-xs mt-6 text-center" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          Goldilock Zone based on weather, peak season, and tourism conditions. Hover markers on the map to see destination details.
          Click any destination to jump to its guide.
        </p>
      </div>
    </section>
  )
}
