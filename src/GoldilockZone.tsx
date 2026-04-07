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
  maldives: [73.2207, 3.2028],         // Malé
  santorini: [25.4456, 36.4072],        // Santorini island
  queenstown: [168.6626, -45.0312],   // Queenstown, NZ
  tokyo: [139.6503, 35.6762],           // Tokyo
  'amalfi-coast': [14.6029, 40.6333],  // Naples area (nearest major)
  kyoto: [135.7681, 35.0116],           // Kyoto
  'maasai-mara': [35.0167, -1.4087],   // Maasai Mara, Kenya
  patagonia: [-68.9063, -41.8101],     // Bariloche, Argentina
  iceland: [-21.9426, 64.1466],       // Reykjavik
  bali: [115.1889, -8.4095],           // Denpasan/Bali
  singapore: [103.8198, 1.3521],       // Singapore
  lisbon: [-9.1393, 38.7223],           // Lisbon
  dubai: [55.2708, 25.2048],            // Dubai
  barcelona: [2.1686, 41.3874],         // Barcelona
  bangkok: [100.5018, 13.7563],         // Bangkok
  amsterdam: [4.9041, 52.3676],        // Amsterdam
  'mexico-city': [-99.1332, 19.4326],  // Mexico City
  marrakech: [-7.9811, 31.6295],       // Marrakech
  helsinki: [24.9384, 60.1699],        // Helsinki
  'cape-town': [18.4241, -33.9249],    // Cape Town
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
            projectionConfig={{ scale: 160, center: [0, 10] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e3a52"
                      stroke="#0f1c26"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#234b66' },
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
