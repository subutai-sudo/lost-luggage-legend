'use client'

import { useState, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import {
  BEST_MONTHS,
  isInGoldilockZoneForRange,
  isComingIntoSeason,
  getFirstInSeasonMonth,
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

function getGoldilockMonths(guideId: string): string {
  const months = BEST_MONTHS[guideId] ?? []
  if (months.length === 0) return 'Year-round'
  const sorted = [...months].sort((a, b) => a - b)
  if (sorted.length === 12) return 'Year-round'
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
  const [fromDate, setFromDate] = useState<string>('2026-04-01')
  const [toDate, setToDate]     = useState<string>('2026-05-01')

  const guides = useMemo(() => DESTINATION_GUIDES, [])

  const inZone = useMemo(
    () => guides.filter((g) => isInGoldilockZoneForRange(g.id, fromDate, toDate)),
    [guides, fromDate, toDate]
  )

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
    <section id="goldilock" className="py-20 lg:py-28 goldilock-section" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(8, 145, 178, 0.1)', color: 'var(--color-accent)', border: '1px solid rgba(8, 145, 178, 0.2)' }}>
            Interactive Map
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
            The Goldilock Zone
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            Not too hot, not too cold — the best time to visit. Enter your travel dates to see
            which destinations are in their ideal window.
          </p>
        </div>

        {/* Date selector */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
              Traveling from
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
              className="px-4 py-2.5 rounded-lg text-sm border-2 focus:outline-none focus:border-[#0891b2] cursor-pointer transition-all goldilock-input"
              style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
              To
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              max="2028-12-31"
              onChange={(e) => setToDate(e.target.value)}
              className="px-4 py-2.5 rounded-lg text-sm border-2 focus:outline-none focus:border-[#0891b2] cursor-pointer transition-all goldilock-input"
              style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(8, 145, 178, 0.1)' }}>
            <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
            <span className="text-sm" style={{ color: 'var(--color-ink)' }}>
              <span className="font-bold">{inZone.length}</span> in Goldilock Zone
            </span>
          </div>
          {upcomingZone.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}>
              <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
              <span className="text-sm" style={{ color: 'var(--color-ink)' }}>
                <span className="font-bold">{upcomingZone.length}</span> coming into season
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)' }}>
            <div className="w-3 h-3 rounded-full bg-[#9ca3af]" />
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
              <span className="font-bold">{outZone.length}</span> off season
            </span>
          </div>
        </div>

        {/* Map - THEME AWARE */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 goldilock-map-container" style={{ height: '500px', borderColor: 'var(--color-border)' }}>
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 160, center: [10, 0] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={12}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none', fill: 'var(--color-card-bg)' },
                        hover: { outline: 'none', fill: 'var(--color-bg-subtle)' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {guides.map((guide) => {
                const coords = GUIDE_COORDS[guide.id]
                if (!coords) return null
                const active = isInGoldilockZoneForRange(guide.id, fromDate, toDate)
                const comingSoon = !active && isComingIntoSeason(guide.id, toDate, 2)
                return (
                  <Marker key={guide.id} coordinates={coords as [number, number]}>
                    {active && (
                      <circle r={10} fill="none" stroke="#c9a96e" strokeWidth={1.5} opacity={0.5}
                        className="animate-ping" style={{ animationDuration: '2s' }} />
                    )}
                    {comingSoon && (
                      <circle r={10} fill="none" stroke="#0891b2" strokeWidth={1.5} opacity={0.4}
                        className="animate-ping" style={{ animationDuration: '3s' }} />
                    )}
                    <circle
                      r={active ? 6 : comingSoon ? 5 : 4}
                      fill={active ? '#c9a96e' : comingSoon ? '#0891b2' : '#9ca3af'}
                      stroke="var(--color-card-bg)"
                      strokeWidth={2}
                      style={{
                        filter: active ? 'drop-shadow(0 0 6px rgba(201,169,110,0.8))' : comingSoon ? 'drop-shadow(0 0 6px rgba(8,145,178,0.6))' : 'none',
                        cursor: 'pointer',
                      }}
                    />
                    <circle r={16} fill="transparent" className="cursor-pointer"
                      onClick={() => {
                        const el = document.getElementById(`guide-${guide.id}`)
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }}
                    />
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg shadow-lg border goldilock-legend" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#c9a96e]" />
                <span style={{ color: 'var(--color-ink)' }}>In Season</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
                <span style={{ color: 'var(--color-ink)' }}>Coming Soon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#9ca3af]" />
                <span style={{ color: 'var(--color-muted)' }}>Off Season</span>
              </div>
            </div>
          </div>
        </div>

        {/* Destination lists */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* In Zone */}
          <div className="rounded-xl border-2 p-5 goldilock-list-card" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'rgba(8, 145, 178, 0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--color-ink)' }}>In Season Now</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(8, 145, 178, 0.1)', color: '#0891b2' }}>
                {inZone.length} guides
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {inZone.map((guide) => (
                <a
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md border goldilock-list-item"
                  style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: guide.themeColor }}>
                    {guide.title.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{guide.title}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{guide.subtitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-[#0891b2]">{getGoldilockMonths(guide.id)}</div>
                  </div>
                </a>
              ))}
              {inZone.length === 0 && (
                <p className="text-center py-8" style={{ color: 'var(--color-muted)' }}>
                  No destinations are in their ideal window for these dates.
                </p>
              )}
            </div>
          </div>

          {/* Coming Into Season */}
          <div className="rounded-xl border-2 p-5 goldilock-list-card" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'rgba(96, 165, 250, 0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--color-ink)' }}>Coming Into Season</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>
                {upcomingZone.length} guides
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {upcomingZone.length > 0 ? upcomingZone.map((guide) => {
                const firstInSeason = getFirstInSeasonMonth(guide.id, toDate, addMonths(toDate, 12))
                return (
                  <a
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md border goldilock-list-item"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: guide.themeColor }}>
                      {guide.title.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{guide.title}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{guide.subtitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-[#60a5fa]">
                        {firstInSeason ? `${MONTH_NAMES[firstInSeason.month - 1].slice(0, 3)} ${firstInSeason.year}` : 'Soon'}
                      </div>
                    </div>
                  </a>
                )
              }) : (
                <p className="text-center py-8" style={{ color: 'var(--color-muted)' }}>
                  No destinations are coming into season soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
