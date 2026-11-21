'use client'

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import Link from 'next/link'
import { MONTH_NAMES, type GoldilocksDestination } from '@/lib/goldilocksDiscovery'
import { getSeasonalReason, type SeasonalDisplayCatalog } from '@/lib/seasonalReasons'
import { createSavedDestinationsStore, MAX_SAVED_DESTINATIONS, SAVED_DESTINATIONS_KEY, type SavedDestination, type SavedDestinationsSnapshot } from '@/lib/savedDestinations'
import { SeasonalReason } from './SeasonalReason'
import styles from './SavedDestinations.module.css'

const DOCUMENT_EVENT = 'lll:saved-destinations-updated'
type Store = ReturnType<typeof createSavedDestinationsStore>
interface SavedContext {
  store: Store
  snapshot: SavedDestinationsSnapshot
  message: string
  announce: (message: string) => void
}
const Context = createContext<SavedContext | null>(null)
function useSavedDestinations() {
  const value = useContext(Context)
  if (!value) throw new Error('Saved destinations components require SavedDestinationsProvider')
  return value
}

export function SavedDestinationsProvider({ guides, children }: { guides: GoldilocksDestination[]; children: ReactNode }) {
  const [message, announce] = useState('')
  const store = useMemo(() => createSavedDestinationsStore(guides.map(guide => guide.id), {
    // These functions are inert during server render and the hydration render.
    getStorage: () => window.localStorage,
    onPersist: raw => window.dispatchEvent(new CustomEvent(DOCUMENT_EVENT, { detail: { raw } })),
  }), [guides])
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SAVED_DESTINATIONS_KEY && event.key !== null) return
      try {
        if (event.storageArea !== window.localStorage) return
        store.receive(event.key === null ? null : event.newValue)
        announce('Saved places updated in another tab.')
      } catch { /* Access can be denied even for the localStorage property. */ }
    }
    const onDocument = (event: Event) => {
      const raw: unknown = (event as CustomEvent<{ raw?: unknown }>).detail?.raw
      if (typeof raw === 'string') store.receive(raw)
    }
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) store.refresh() }
    window.addEventListener('storage', onStorage)
    window.addEventListener(DOCUMENT_EVENT, onDocument)
    window.addEventListener('pageshow', onPageShow)
    store.hydrate()
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(DOCUMENT_EVENT, onDocument)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [store])
  return <Context.Provider value={{ store, snapshot, message, announce }}>{children}</Context.Provider>
}

export function SaveDestinationButton({ destinationId, title, month }: { destinationId: string; title: string; month: number }) {
  const { store, snapshot, announce } = useSavedDestinations()
  const saved = snapshot.items.some(item => item.id === destinationId)
  const [feedback, setFeedback] = useState('')
  const feedbackId = useId()
  useEffect(() => { setFeedback('') }, [destinationId, month, snapshot.items.length, saved])
  function toggle() {
    if (saved) {
      store.remove(destinationId)
      announce(`${title} removed from saved places.`)
      setFeedback('')
      return
    }
    const result = store.save(destinationId, month)
    if (result === 'limit') {
      const text = `You can save up to ${MAX_SAVED_DESTINATIONS} places. Remove a saved place before adding another.`
      // Keep limit feedback beside the clicked control as well as in the panel.
      setFeedback(text)
      announce(text)
    } else if (result === 'saved') {
      setFeedback('')
      announce(`${title} saved for ${MONTH_NAMES[month - 1]}.`)
    } else if (result === 'invalid') {
      setFeedback('This destination or month cannot be saved.')
      announce('This destination or month cannot be saved.')
    }
  }
  return <div className={styles.saveControl}>
    <button type="button" className={styles.saveButton} onClick={toggle} aria-label={`${saved ? 'Unsave' : 'Save'} ${title}`} aria-pressed={saved} aria-describedby={feedback ? feedbackId : undefined} disabled={snapshot.persistence === 'pending'}>
      <span aria-hidden="true">{saved ? '−' : '+'}</span> {saved ? 'Unsave' : 'Save'}
    </button>
    {feedback && <p id={feedbackId} className={styles.feedback} role="status">{feedback}</p>}
  </div>
}

interface PanelProps { guides: GoldilocksDestination[]; seasonalCatalog: SeasonalDisplayCatalog }

/** Also exported for isolated render verification without browser persistence. */
export function SavedDestinationComparison({ guides, seasonalCatalog, items }: PanelProps & { items: readonly SavedDestination[] }) {
  return <section className={styles.comparison} data-destination-comparison aria-label="Saved places comparison">
    <h3>Compare your saved places</h3>
    <p className={styles.comparisonIntro}>Each place keeps the month you saved. Seasonal guidance is not a live forecast or a price comparison.</p>
    <div className={styles.comparisonGrid}>
      {items.map(item => {
        const guide = guides.find(guide => guide.id === item.id)
        if (!guide || !Number.isInteger(item.month) || item.month < 1 || item.month > 12) return null
        const note = getSeasonalReason(seasonalCatalog, item.id, item.month)
        return <article key={item.id} className={styles.comparisonCard} data-saved-destination={item.id} data-saved-month={item.month}>
          <p className={styles.month}>Saved for {MONTH_NAMES[item.month - 1]}</p>
          <h4>{guide.title}</h4>
          {note ? <div className={styles.seasonal}><SeasonalReason catalog={seasonalCatalog} destinationId={item.id} title={guide.title} month={item.month} fallbackExcerpt="" /></div> : <p className={styles.unavailable}>Seasonal context is not available for this saved month. Read the guide before deciding.</p>}
          <Link prefetch={false} className={styles.guideLink} href={`/guides/${encodeURIComponent(guide.slug)}?month=${item.month}`}>Read {guide.title} guide <span aria-hidden="true">↗</span></Link>
        </article>
      })}
    </div>
  </section>
}

export function SavedDestinationsPanel({ guides, seasonalCatalog }: PanelProps) {
  const { store, snapshot, message, announce } = useSavedDestinations()
  const [comparing, setComparing] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const comparisonId = useId()
  const canCompare = snapshot.items.length >= 2
  useEffect(() => { if (!canCompare) setComparing(false) }, [canCompare])
  function remove(id: string, title: string, index: number) {
    store.remove(id)
    announce(`${title} removed from saved places.`)
    // Removal unmounts its button: retain a useful keyboard starting point.
    requestAnimationFrame(() => {
      const buttons = list.current?.querySelectorAll<HTMLButtonElement>('button')
      const next = buttons?.[Math.min(index, (buttons?.length ?? 0) - 1)]
      ;(next ?? heading.current)?.focus()
    })
  }
  function clear() {
    store.clear()
    announce('Saved places cleared.')
    heading.current?.focus()
  }
  return <section className={styles.panel} aria-label="Saved destinations">
    <div className={styles.panelHeader}>
      <div>
        <p className={styles.eyebrow}>A little room to decide</p>
        <h2 ref={heading} tabIndex={-1}>Your saved places</h2>
        <p className={styles.disclosure}>Saved on this browser only. No account required.</p>
      </div>
      <p className={styles.count}>{snapshot.items.length} / {MAX_SAVED_DESTINATIONS} places</p>
    </div>
    <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{message}</p>
    {snapshot.persistence === 'unavailable' && <p className={styles.notice}>Browser storage is unavailable. You can still save places here, but they may be lost when you leave or reload.</p>}
    {snapshot.invalidData && <p className={styles.notice}>The existing saved data is not recognized and has been left unchanged. New saves stay on this page only; clear this site’s browser data to enable persistent saving again.</p>}
    {snapshot.items.length ? <ul ref={list} className={styles.savedList}>
      {snapshot.items.map((item, index) => {
        const guide = guides.find(guide => guide.id === item.id)
        if (!guide) return null
        return <li key={item.id} className={styles.savedRow}>
          <div className={styles.savedIdentity}>
            <Link prefetch={false} className={styles.savedTitle} href={`/guides/${encodeURIComponent(guide.slug)}?month=${item.month}`}>{guide.title}</Link>
            <span className={styles.savedMonth}>Saved for {MONTH_NAMES[item.month - 1]}</span>
          </div>
          <button className={styles.removeButton} type="button" aria-label={`Remove ${guide.title}`} onClick={() => remove(item.id, guide.title, index)}>Remove <span className={styles.srOnly}>{guide.title}</span></button>
        </li>
      })}
    </ul> : <p className={styles.empty}>Save up to three places from any month, then compare their seasonal reasons and trade-offs here.</p>}
    <div className={styles.actions}>
      <button className={styles.compareButton} type="button" disabled={!canCompare} aria-expanded={comparing && canCompare} aria-controls={comparisonId} onClick={() => setComparing(value => !value)}>Compare saved places</button>
      {!!snapshot.items.length && <button className={styles.clearButton} type="button" onClick={clear}>Clear saved places</button>}
    </div>
    {!canCompare && <p className={styles.hint}>Save at least two places to compare.</p>}
    <div id={comparisonId}>{comparing && canCompare && <SavedDestinationComparison guides={guides} seasonalCatalog={seasonalCatalog} items={snapshot.items} />}</div>
  </section>
}
