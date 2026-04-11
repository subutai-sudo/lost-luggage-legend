'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import {
  isInGoldilockZoneForRange,
  isComingIntoSeason,
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

export function GoldilockZone() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [activeTab, setActiveTab] = useState<'in-season' | 'coming' | 'all'>('in-season')
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)

  // Smart defaults (today + 2 months)
  useEffect(() => {
    const today = new Date()
    const from = today.toISOString().split('T')[0]
    const future = new Date(today)
    future.setMonth(future.getMonth() + 2)
    const to = future.toISOString().split('T')[0]
    setFromDate(from)
    setToDate(to)
  }, [])

  const filteredGuides = useMemo(() => {
    let result = DESTINATION_GUIDES

    if (activeTab === 'in-season') {
      result = result.filter(g => isInGoldilockZoneForRange(g.id, fromDate, toDate))
    } else if (activeTab === 'coming') {
      result = result.filter(g =>
        !isInGoldilockZoneForRange(g.id, fromDate, toDate) &&
        isComingIntoSeason(g.id, toDate, 2)
      )
    }
    return result.sort((a, b) => a.title.localeCompare(b.title))
  }, [fromDate, toDate, activeTab])

  const getMarkerColor = (id: string) => {
    if (isInGoldilockZoneForRange(id, fromDate, toDate)) return '#d97706'
    if (isComingIntoSeason(id, toDate, 2)) return '#2563eb'
    return '#6b7280'
  }

  const surpriseMe = () => {
    if (filteredGuides.length === 0) return
    const random = filteredGuides[Math.floor(Math.random() * filteredGuides.length)]
    window.location.href = `/guides/${random.slug}`
  }

  return (
    <section id="goldilock" className="py-20 lg:py-28 bg-[#f9f6f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl font-bold text-[#2c2520] mb-3">
            The Goldilock Zone
          </h2>
          <p className="text-[#6b5e52] max-w-2xl mx-auto">
            Not too hot. Not too crowded. Not too expensive.<br />
            These destinations are in their ideal travel window.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              { label: 'Next 30 days', days: 30 },
              { label: 'Next 3 months', days: 90 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const from = new Date()
                  const to = new Date(from)
                  to.setDate(to.getDate() + preset.days)
                  setFromDate(from.toISOString().split('T')[0])
                  setToDate(to.toISOString().split('T')[0])
                }}
                className="px-5 py-2 text-sm rounded-full border border-amber-300 hover:bg-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={surpriseMe}
              className="px-6 py-2 bg-[#2c2520] hover:bg-amber-800 text-white rounded-full text-sm font-medium transition-colors"
            >
              Surprise Me ✨
            </button>
          </div>

          <div className="flex gap-6">
            <div>
              <div className="text-xs text-amber-700 font-medium mb-1">FROM</div>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-4 py-3 border border-amber-200 rounded-2xl focus:border-amber-500 text-sm"
              />
            </div>
            <div>
              <div className="text-xs text-amber-700 font-medium mb-1">TO</div>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-4 py-3 border border-amber-200 rounded-2xl focus:border-amber-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: 'in-season' as const, label: 'In Season Now', color: 'amber' },
            { key: 'coming' as const, label: 'Coming Soon', color: 'blue' },
            { key: 'all' as const, label: 'All', color: 'gray' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#2c2520] text-white shadow'
                  : 'bg-white border border-amber-200 hover:bg-amber-50'
              }`}
            >
              {tab.label} ({filteredGuides.length})
            </button>
          ))}
        </div>

        <div className="relative bg-white rounded-3xl shadow border border-amber-100 overflow-hidden" style={{ height: '560px' }}>
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 170, center: [15, 5] }}
            width={900}
            height={560}
          >
            <ZoomableGroup 
              zoom={1.1} 
              minZoom={0.7} 
              maxZoom={8}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#f5f0e8"
                      stroke="#e8d9c8"
                      strokeWidth={0.6}
                    />
                  ))
                }
              </Geographies>

              {DESTINATION_GUIDES.map((guide) => {
                const coords = GUIDE_COORDS[guide.id]
                if (!coords) return null

                const isActive = isInGoldilockZoneForRange(guide.id, fromDate, toDate)
                const isComing = isComingIntoSeason(guide.id, toDate, 2)
                const color = isActive ? '#d97706' : isComing ? '#2563eb' : '#6b7280'

                return (
                  <Marker 
                    key={guide.id} 
                    coordinates={coords}
                  >
                    {/* Larger invisible click/hover area */}
                    <circle
                      r={14}
                      fill="transparent"
                      onMouseEnter={() => setTooltip({ name: guide.title, x: coords[0], y: coords[1] })}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => window.location.href = `/guides/${guide.slug}`}
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Visible dot with pulse for active ones */}
                    <circle
                      r={isActive ? 7 : 5.5}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={2.5}
                      style={{
                        filter: isActive ? 'drop-shadow(0 0 8px rgba(217, 119, 6, 0.6))' : 'none',
                      }}
                    />
                    {isActive && (
                      <circle
                        r={11}
                        fill="none"
                        stroke="#d97706"
                        strokeWidth={1.5}
                        opacity={0.3}
                        className="animate-ping"
                      />
                    )}
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute pointer-events-none bg-white shadow-lg px-4 py-2 rounded-2xl text-sm font-medium border border-amber-200 z-50"
              style={{
                left: '50%',
                top: '60px',
                transform: 'translateX(-50%)',
              }}
            >
              {tooltip.name}
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow border border-amber-100 text-xs flex gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d97706]"></div>
              <span>In Season</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2563eb]"></div>
              <span>Coming Soon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6b7280]"></div>
              <span>Off Season</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
