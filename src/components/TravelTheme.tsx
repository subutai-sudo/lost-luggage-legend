import type { ReactNode } from 'react'
import styles from './TravelTheme.module.css'

export interface TravelThemeProps {
  children: ReactNode
  className?: string
}

/** Opt-in aviation-journal palette. Keep Navbar full-width, outside story gutters. */
export function TravelTheme({ children, className }: TravelThemeProps) {
  return <div className={`${styles.root}${className ? ` ${className}` : ''}`} data-travel-theme data-design-edition="travel">{children}</div>
}

/** Optional page-intro composition; existing h1, copy and links remain children. */
export function TravelIntro({ children, className }: TravelThemeProps) {
  return <header className={`${styles.intro}${className ? ` ${className}` : ''}`} data-travel-intro>{children}</header>
}
