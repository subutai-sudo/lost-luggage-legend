'use client'

import { useTheme } from '@/components/ThemeProvider'
import { BrandLogo } from '@/components/BrandLogo'
import { useCurrency, CURRENCIES, CurrencyCode } from '@/components/CurrencyProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0891b2]'

export function Navbar({ appearance = 'default', brandAppearance }: { appearance?: 'default' | 'cinematic'; brandAppearance?: 'default' | 'cinematic' } = {}) {
  const { theme, toggleTheme } = useTheme()
  const { currency, setCurrency, currencyInfo } = useCurrency()
  const pathname = usePathname()
  const isDark = theme === 'dark'
  const [openMenu, setOpenMenu] = useState<'currency' | 'navigation' | null>(null)
  const currencyMenuRef = useRef<HTMLDivElement>(null)
  const navigationMenuRef = useRef<HTMLDivElement>(null)
  const currencyButtonRef = useRef<HTMLButtonElement>(null)
  const navigationButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeMobileMenu = () => {
      if (desktop.matches) setOpenMenu(current => current === 'navigation' ? null : current)
    }
    desktop.addEventListener('change', closeMobileMenu)
    return () => desktop.removeEventListener('change', closeMobileMenu)
  }, [])

  useEffect(() => {
    if (!openMenu) return
    const menu = openMenu === 'currency' ? currencyMenuRef : navigationMenuRef
    const button = openMenu === 'currency' ? currencyButtonRef : navigationButtonRef
    const handlePointerOutside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpenMenu(null)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        button.current?.focus()
      }
    }
    const handleNavigation = () => setOpenMenu(null)
    document.addEventListener('pointerdown', handlePointerOutside)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('hashchange', handleNavigation)
    window.addEventListener('popstate', handleNavigation)
    return () => {
      document.removeEventListener('pointerdown', handlePointerOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('hashchange', handleNavigation)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [openMenu])

  const handleCurrencySelect = (code: CurrencyCode) => {
    setCurrency(code)
    setOpenMenu(null)
    currencyButtonRef.current?.focus()
  }

  return (
    <nav
      aria-label="Primary navigation"
      className="sticky top-0 z-50 glass-nav transition-all duration-300"
      onClick={event => {
        if ((event.target as Element).closest('a')) setOpenMenu(null)
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-2 h-16">
          <BrandLogo appearance={brandAppearance ?? appearance} />

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/guides" className={`nav-modern inline-flex items-center min-h-11 ${focusRing}`} style={{ color: 'var(--color-ink-light)', minWidth: 44 }}>
              Guides
            </Link>
            <Link href="/#newsletter" className={`nav-modern inline-flex items-center min-h-11 ${focusRing}`} style={{ color: 'var(--color-ink-light)', minWidth: 44 }}>
              Newsletter
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {/* Currency is useful while planning, not during seasonal discovery. */}
            {appearance !== 'cinematic' && <div
              className="relative"
              ref={currencyMenuRef}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpenMenu(current => current === 'currency' ? null : current)
                }
              }}
            >
              <button
                ref={currencyButtonRef}
                type="button"
                onClick={() => setOpenMenu(openMenu === 'currency' ? null : 'currency')}
                aria-label={`Currency: ${currencyInfo.code}`}
                aria-expanded={openMenu === 'currency'}
                aria-controls="header-currencies"
                className={`theme-toggle w-11 h-11 text-xs font-bold ${focusRing}`}
                style={{ color: 'var(--color-ink-light)', fontFamily: "'Source Sans 3', sans-serif" }}
                title={`Prices in ${currencyInfo.label} (${currencyInfo.symbol})`}
              >
                {currencyInfo.symbol}
              </button>
              {openMenu === 'currency' && (
                <div
                  id="header-currencies"
                  className="absolute right-0 top-full mt-2 py-2 w-48 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-lg shadow-xl border z-50"
                  style={{ backgroundColor: 'var(--color-card-bg, #fff)', borderColor: 'var(--color-border, #e8e0d4)' }}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-muted, #9a9a9a)' }}>
                    Currency
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCurrencySelect(c.code)}
                      aria-pressed={c.code === currency}
                      className={`w-full min-h-11 text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-[#0891b208] transition-colors ${focusRing}`}
                      style={{ color: c.code === currency ? '#0891b2' : 'var(--color-ink)', fontWeight: c.code === currency ? 600 : 400, fontFamily: "'Source Sans 3', sans-serif" }}
                    >
                      <span><span className="inline-block w-8 font-semibold">{c.symbol}</span>{c.code}</span>
                      <span className="text-xs" style={{ color: 'var(--color-muted, #9a9a9a)' }}>{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`theme-toggle w-11 h-11 ${focusRing}`}
            >
              {isDark ? (
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* The wrapper hides the CTA: .btn-primary's display overrides utility classes. */}
            <div className={appearance === 'cinematic' ? 'hidden' : 'hidden lg:block'}>
              <Link href="/#newsletter" className={`btn-primary min-h-11 ${focusRing}`}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Subscribe
              </Link>
            </div>

            <div
              ref={navigationMenuRef}
              className="relative md:hidden"
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpenMenu(current => current === 'navigation' ? null : current)
                }
              }}
            >
              <button
                ref={navigationButtonRef}
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={openMenu === 'navigation'}
                aria-controls="header-mobile-navigation"
                onClick={() => setOpenMenu(openMenu === 'navigation' ? null : 'navigation')}
                className={`theme-toggle w-11 h-11 ${focusRing}`}
                style={{ color: 'var(--color-ink-light)' }}
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {openMenu === 'navigation' ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
              {openMenu === 'navigation' && (
                <div
                  id="header-mobile-navigation"
                  className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border p-2 shadow-xl"
                  style={{ backgroundColor: 'var(--color-card-bg, #fff)', borderColor: 'var(--color-border, #e8e0d4)' }}
                >
                  <Link href="/guides" className={`flex min-h-11 items-center rounded-lg px-4 hover:bg-[#0891b208] ${focusRing}`} style={{ color: 'var(--color-ink)' }}>Guides</Link>
                  <Link href="/#newsletter" className={`flex min-h-11 items-center rounded-lg px-4 hover:bg-[#0891b208] ${focusRing}`} style={{ color: 'var(--color-ink)' }}>Newsletter</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
