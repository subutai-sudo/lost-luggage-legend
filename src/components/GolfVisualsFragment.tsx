'use client'

import { useEffect } from 'react'

// Keep the article and its native fragment target server-rendered. On a cold
// document navigation WebKit can lose the native jump during hydration. Reapply
// only this explicit destination after document/font layout and the next frame.
export function GolfVisualsFragment() {
  useEffect(() => {
    let disposed = false
    let frame = 0
    const reveal = () => {
      if (window.location.hash !== '#course-visuals') return
      void document.fonts.ready.then(() => {
        if (disposed || window.location.hash !== '#course-visuals') return
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          if (disposed || window.location.hash !== '#course-visuals') return
          const target = document.getElementById('course-visuals')
          target?.focus({ preventScroll: true })
          target?.scrollIntoView({ behavior: 'instant', block: 'start' })
        })
      })
    }
    if (document.readyState === 'complete') reveal()
    else window.addEventListener('load', reveal, { once: true })
    window.addEventListener('hashchange', reveal)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('load', reveal)
      window.removeEventListener('hashchange', reveal)
    }
  }, [])
  return null
}
