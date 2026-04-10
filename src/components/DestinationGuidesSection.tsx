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
    <section id="guides" className="py-20 lg:py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="issue-label text-[#0891b2] mb-3">Destinations</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight" style={{ color: 'var(--color-ink)' }}>
              Plan Your Next Trip
            </h2>
            <p className="mt-3 max-w-md font-light" style={{ color: 'var(--color-muted)', fontFamily: "'Source Sans 3', sans-serif" }}>
              Curated destinations across every travel style — with live price comparisons across 8 suppliers so you can always find the best deal.
            </p>
          </div>
          {/* Affiliate note */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 text-xs" style={{ color: 'var(--color-gold)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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
              className={`text-xs uppercase tracking-widest px-4 py-2 border rounded-full transition-all ${
                activeTheme === theme
                  ? 'bg-[#0891b2] border-[#0891b2] text-white font-semibold'
                  : 'border-[var(--color-border)] hover:border-[#0891b2] hover:text-[#0891b2]'
              }`}
              style={{ 
                fontFamily: "'Source Sans 3', sans-serif",
                color: activeTheme === theme ? 'white' : 'var(--color-muted)'
              }}
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
          <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
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
