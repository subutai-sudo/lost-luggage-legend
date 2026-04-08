'use client'

import { useTheme } from '@/components/ThemeProvider'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: 'var(--color-nav-bg)', borderColor: 'var(--color-nav-border)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#0e7490] flex items-center justify-center">
              <span className="text-white text-lg">🧳</span>
            </div>
            <div>
              <span className="font-display text-base font-bold leading-none block tracking-tight" style={{ color: 'var(--color-ink)' }}>Lost Luggage</span>
              <span className="eyebrow leading-none text-xs" style={{ color: 'var(--color-gold)' }}>Legend</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#guides" className="nav-modern transition-colors" style={{ color: 'var(--color-ink-light)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ink-light)')}>
              Guides
            </a>
            <a href="#newsletter" className="nav-modern transition-colors" style={{ color: 'var(--color-ink-light)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ink-light)')}>
              Newsletter
            </a>
          </div>

          {/* Right side: Theme toggle + CTA */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}
            >
              {isDark ? (
                // Sun icon for dark mode (click to go light)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                // Moon icon for light mode (click to go dark)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* CTA */}
            <a href="#newsletter" className="btn-primary hidden sm:inline-flex items-center gap-2">
              Subscribe
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
