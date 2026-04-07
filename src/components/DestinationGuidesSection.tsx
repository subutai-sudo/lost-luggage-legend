'use client'

import { useState } from 'react'
import { DestinationGuideCard } from '@/components/DestinationGuideCard'
import { DESTINATION_GUIDES, FEATURED_GUIDES } from '@/data/destinationGuides'

const THEMES = ['All', 'Adventure', 'Beach', 'City', 'Coastal', 'Falls', 'Mountains', 'Nature', 'Relaxing', 'Romantic', 'Safari', 'Surfing', 'Tropical', 'Winter', 'Zen']

export function DestinationGuidesSection() {
  const [activeTheme, setActiveTheme] = useState('All')

  const filtered =
    activeTheme === 'All'
      ? DESTINATION_GUIDES
      : DESTINATION_GUIDES.filter(g =>
          g.theme === activeTheme ||
          g.tags.some(t => t.toLowerCase() === activeTheme.toLowerCase())
        )

  const featured = FEATURED_GUIDES.filter(g =>
    activeTheme === 'All' ||
    g.theme === activeTheme ||
    g.tags.some(t => t.toLowerCase() === activeTheme.toLowerCase())
  )

  return (
    <section id="guides" className="bg-[#1e2d3d] py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="issue-label text-[#c9a96e] mb-3">Destinations</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              Plan Your Next Trip
            </h2>
            <p className="text-[#e8e0d4]/60 mt-3 max-w-md font-light" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Curated destinations across every travel style — with live price comparisons across 7 suppliers so you can always find the best deal.
            </p>
          </div>
          {/* Affiliate note */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 text-[#c9a96e] text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#c9a96e">
                <circle cx="12" cy="12" r="10" />
                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">i</text>
              </svg>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                Affiliate links — we earn a commission at no extra cost to you
              </span>
            </div>
          </div>
        </div>

        {/* Theme filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {THEMES.map(theme => (
            <button
              key={theme}
              onClick={() => setActiveTheme(theme)}
              className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all ${
                activeTheme === theme
                  ? 'bg-[#c9a96e] border-[#c9a96e] text-[#1a1814] font-semibold'
                  : 'border-[#e8e0d4]/20 text-[#e8e0d4]/60 hover:border-[#c9a96e] hover:text-[#c9a96e]'
              }`}
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Featured large cards — 3 across on desktop */}
        {featured.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {featured.slice(0, 3).map(guide => (
              <DestinationGuideCard key={guide.id} guide={guide} variant="featured" />
            ))}
          </div>
        )}

        {/* Remaining cards */}
        {filtered.length > 3 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {filtered
              .filter(g => !g.featured || activeTheme !== 'All')
              .slice(0, 6)
              .map(guide => (
                <DestinationGuideCard key={guide.id} guide={guide} variant="default" />
              ))}
          </div>
        )}

        {/* Bottom strip — all destinations */}
        {filtered.length > 6 && (
          <div className="mt-8 pt-8 border-t border-[#e8e0d4]/10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.slice(6).map(guide => (
                <DestinationGuideCard key={guide.id} guide={guide} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
