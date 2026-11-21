'use client'

import { Suspense, useCallback, useEffect, useState, type AnchorHTMLAttributes } from 'react'
import { useSearchParams } from 'next/navigation'
import { readTripContext, withTripMonth } from '@/lib/tripContext'

function SearchObserver({ onChange }: { onChange: (search: string) => void }) {
  // Next updates this for native history, router navigation and back/forward.
  // Isolate the static-route Suspense boundary to this null-rendering observer;
  // the native link and planner form remain server-rendered and hydration-safe.
  const params = useSearchParams()
  const search = params?.toString() ?? ''
  useEffect(() => { onChange(search) }, [search, onChange])
  return null
}

export function TripContextSearchObserver({ onChange }: { onChange: (search: string) => void }) {
  return <Suspense fallback={null}><SearchObserver onChange={onChange} /></Suspense>
}

export interface TripContextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Only /, /guides, known /guides/<slug>, or /plan#compare-prices. */
  href: string
  /** Explicit selected month for client discovery. Omit to inherit the URL after hydration. */
  month?: number | null
}

/** Native anchor with a safe no-JS route. Server guides stay static. */
export function TripContextLink({ href, month, children, ...props }: TripContextLinkProps) {
  const [search, setSearch] = useState('')
  const onChange = useCallback((value: string) => setSearch(value), [])
  const selectedMonth = month === undefined ? readTripContext(search).month : month
  return (
    <a {...props} href={withTripMonth(href, selectedMonth)}>
      {children}
      <TripContextSearchObserver onChange={onChange} />
    </a>
  )
}
