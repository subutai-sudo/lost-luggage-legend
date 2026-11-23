'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { THEME_STORAGE_KEY, isTheme, type Theme } from '@/components/themeBoot'

export type { Theme }

interface ThemeContextValue {
  theme: Theme
  /** True once the stored/OS preference has been read on the client. */
  ready: boolean
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  ready: false,
  toggleTheme: () => {},
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

const systemTheme = (): Theme =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

function readStored(): Theme | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(raw) ? raw : null
  } catch {
    // Storage can be denied (private mode, blocked cookies). Fall back to the
    // OS preference rather than failing the whole theme system.
    return null
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Starts as 'light' so the server and the first client render agree;
  // the boot script has already painted the correct theme by this point.
  const [theme, setThemeState] = useState<Theme>('light')
  const [ready, setReady] = useState(false)
  // Tracks whether the visitor made an explicit choice, so an OS change does
  // not silently override it.
  const explicit = useRef(false)

  useEffect(() => {
    const stored = readStored()
    explicit.current = stored !== null
    const initial = stored ?? systemTheme()
    setThemeState(initial)
    applyTheme(initial)
    setReady(true)
  }, [])

  // Follow the OS while the visitor has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      if (explicit.current) return
      const next = event.matches ? 'dark' : 'light'
      setThemeState(next)
      applyTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Keep other open tabs in step.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return
      const next = isTheme(event.newValue) ? event.newValue : systemTheme()
      explicit.current = isTheme(event.newValue)
      setThemeState(next)
      applyTheme(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    explicit.current = true
    setThemeState(next)
    applyTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // A denied write only costs persistence, not the current appearance.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, ready, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
