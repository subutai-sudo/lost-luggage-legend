'use client'

import { useTheme } from '@/components/ThemeProvider'
import { useCurrency, CURRENCIES, CurrencyCode } from '@/components/CurrencyProvider'
import { useState, useRef, useEffect } from 'react'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { currency, setCurrency, currencyInfo } = useCurrency()
  const isDark = theme === 'dark'
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close currency menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCurrencyMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCurrencySelect = (code: CurrencyCode) => {
    setCurrency(code)
    setShowCurrencyMenu(false)
  }

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#0e7490] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
              <span className="text-white text-xl">🧳</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold leading-none block tracking-tight" style={{ color: 'var(--color-ink)' }}>Lost Luggage</span>
              <span className="eyebrow leading-none text-xs" style={{ color: 'var(--color-gold)' }}>Legend</span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/guides" className="nav-modern" style={{ color: 'var(--color-ink-light)' }}>
              Guides
            </a>
            <a href="#newsletter" className="nav-modern" style={{ color: 'var(--color-ink-light)' }}>
              Newsletter
            </a>
          </div>

          {/* Right side: Currency + Theme toggle + CTA */}
          <div className="flex items-center gap-3">
            {/* Currency picker */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                aria-label={`Currency: ${currencyInfo.code}`}
                className="theme-toggle w-10 h-10 flex items-center justify-center text-xs font-bold"
                style={{ color: 'var(--color-ink-light)', fontFamily: "'Source Sans 3', sans-serif" }}
                title={`Prices in ${currencyInfo.label} (${currencyInfo.symbol})`}
              >
                {currencyInfo.symbol}
              </button>
              {showCurrencyMenu && (
                <div
                  className="absolute right-0 top-full mt-1 py-2 w-48 rounded-lg shadow-xl border z-50"
                  style={{
                    backgroundColor: 'var(--color-card-bg, #fff)',
                    borderColor: 'var(--color-border, #e8e0d4)',
                  }}
                >
                  <div
                    className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold"
                    style={{ color: 'var(--color-muted, #9a9a9a)' }}
                  >
                    Currency
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleCurrencySelect(c.code)}
                      className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-[#0891b208] transition-colors"
                      style={{
                        color: c.code === currency ? '#0891b2' : 'var(--color-ink)',
                        fontWeight: c.code === currency ? 600 : 400,
                        fontFamily: "'Source Sans 3', sans-serif",
                      }}
                    >
                      <span>
                        <span className="inline-block w-8 font-semibold">{c.symbol}</span>
                        {c.code}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-muted, #9a9a9a)' }}>
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="theme-toggle w-10 h-10"
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* CTA */}
            <a href="#newsletter" className="btn-primary hidden sm:inline-flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
