'use client'

import { useEffect, useState } from 'react'
import styles from './GolfGuide.module.css'

/** Enhance only the return link; the article and native /golf fallback stay static. */
export function GolfGuideNavigation({ breadcrumb = false }: { breadcrumb?: boolean }) {
  const [href, setHref] = useState('/golf')

  useEffect(() => {
    const updateReturn = () => {
      const months = new URLSearchParams(window.location.search).getAll('month')
      // Accept one canonical calendar month, never an arbitrary return URL.
      const month = months.length === 1 && /^(?:[1-9]|1[0-2])$/.test(months[0]) ? months[0] : null
      setHref(month ? `/golf?month=${month}#golf-results` : '/golf')
    }
    updateReturn()
    window.addEventListener('popstate', updateReturn)
    return () => window.removeEventListener('popstate', updateReturn)
  }, [])

  if (breadcrumb) return <a href={href} data-golf-finder-breadcrumb>Golf month finder</a>
  return <a className={styles.backLink} href={href} data-golf-finder-return><span aria-hidden="true">←</span> Back to the golf month finder</a>
}
