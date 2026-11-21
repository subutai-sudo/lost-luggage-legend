/** Browser-only persistence is injected; this module never reads globals. */
export const SAVED_DESTINATIONS_KEY = 'lll-saved-destinations-v1'
export const MAX_SAVED_DESTINATIONS = 3
export const MAX_SAVED_DESTINATIONS_BYTES = 4096

export interface SavedDestination { readonly id: string; readonly month: number }
export interface SavedDestinationsSnapshot {
  readonly items: readonly SavedDestination[]
  readonly persistence: 'pending' | 'available' | 'unavailable'
  readonly invalidData: boolean
}
interface StorageAccess {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}
interface StoreOptions {
  getStorage?: () => StorageAccess | null
  /** Only successful writes are announced to other current-document providers. */
  onPersist?: (raw: string) => void
}
export type SaveResult = 'saved' | 'already-saved' | 'limit' | 'invalid' | 'not-ready'

const validId = (id: unknown): id is string => typeof id === 'string' && id.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
const validMonth = (month: unknown): month is number => typeof month === 'number' && Number.isInteger(month) && month >= 1 && month <= 12
function exactKeys(value: unknown, keys: string[]): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    Object.keys(value).length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key))
}

/** Reject the whole envelope rather than silently repairing a corrupt list. */
export function parseSavedDestinations(raw: string | null, allowedIds: Iterable<string>): SavedDestination[] | null {
  if (raw === null) return []
  // Valid envelopes contain only ASCII identifiers/numbers and need far less
  // than this cap. Reject before JSON.parse to bound work on untrusted storage.
  if (typeof raw !== 'string' || raw.length > MAX_SAVED_DESTINATIONS_BYTES) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!exactKeys(value, ['version', 'items']) || value.version !== 1 || !Array.isArray(value.items) || value.items.length > MAX_SAVED_DESTINATIONS) return null
    const allowed = new Set(allowedIds)
    const seen = new Set<string>()
    const items: SavedDestination[] = []
    for (const item of value.items) {
      if (!exactKeys(item, ['id', 'month']) || !validId(item.id) || !allowed.has(item.id) || !validMonth(item.month) || seen.has(item.id)) return null
      seen.add(item.id)
      items.push({ id: item.id, month: item.month })
    }
    return items
  } catch {
    return null
  }
}

function snapshot(items: readonly SavedDestination[], persistence: SavedDestinationsSnapshot['persistence'], invalidData = false): SavedDestinationsSnapshot {
  return Object.freeze({ items: Object.freeze(items.map(item => Object.freeze({ ...item }))), persistence, invalidData })
}

/** An isolated, observable store. Call hydrate only after the client mounts. */
export function createSavedDestinationsStore(allowedIds: Iterable<string>, options: StoreOptions = {}) {
  const allowed = new Set([...allowedIds].filter(validId))
  const serverSnapshot = snapshot([], 'pending')
  let current = serverSnapshot
  let hydrated = false
  const listeners = new Set<() => void>()
  const publish = (next: SavedDestinationsSnapshot) => {
    current = next
    listeners.forEach(listener => listener())
  }
  const applyRaw = (raw: string | null) => {
    const parsed = parseSavedDestinations(raw, allowed)
    publish(snapshot(parsed ?? [], 'available', parsed === null))
  }
  const refresh = () => {
    if (!hydrated) return
    try {
      const storage = options.getStorage?.()
      if (storage) applyRaw(storage.getItem(SAVED_DESTINATIONS_KEY))
      else publish(snapshot(current.items, 'unavailable', current.invalidData))
    } catch { publish(snapshot(current.items, 'unavailable', current.invalidData)) }
  }
  // Read before every mutation, even no-ops: a queued storage event may not
  // have arrived yet. Unavailable/invalid storage stays memory-only until an
  // explicit refresh or notification permits a successful re-read.
  // localStorage has no atomic read-modify-write: this protects sequential
  // edits, not truly simultaneous writes in separate browser processes.
  const reconcileMutation = () => {
    if (current.persistence === 'available' && !current.invalidData) refresh()
  }
  const persist = (items: readonly SavedDestination[]) => {
    const raw = JSON.stringify({ version: 1, items })
    let written = false
    try {
      // A failed initial read must not overwrite an unseen saved list even
      // when a browser happens to permit writes but deny reads.
      const storage = current.persistence === 'available' && !current.invalidData ? options.getStorage?.() : null
      if (storage) { storage.setItem(SAVED_DESTINATIONS_KEY, raw); written = true }
    } catch { /* Keep the in-memory list usable when storage is denied/full. */ }
    publish(snapshot(items, written ? 'available' : 'unavailable', current.invalidData))
    if (written) {
      try { options.onPersist?.(raw) } catch { /* A listener cannot undo a successful write. */ }
    }
  }
  return {
    getSnapshot: () => current,
    // Remains empty even if this store was already hydrated in another render.
    getServerSnapshot: () => serverSnapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    hydrate() {
      if (hydrated) return
      hydrated = true
      try {
        const storage = options.getStorage?.()
        if (!storage) { publish(snapshot([], 'unavailable')); return }
        applyRaw(storage.getItem(SAVED_DESTINATIONS_KEY))
      } catch { publish(snapshot([], 'unavailable')) }
    },
    /** Notifications are invalidations, not authoritative payloads: a delayed
     * event must not roll back a newer write. Never echo a write. */
    receive(_raw: string | null) { refresh() },
    /** Re-read on bfcache restore; a denied read must not erase memory. */
    refresh,
    save(id: string, month: number): SaveResult {
      if (!hydrated) return 'not-ready'
      if (!validId(id) || !allowed.has(id) || !validMonth(month)) return 'invalid'
      reconcileMutation()
      if (current.items.some(item => item.id === id)) return 'already-saved'
      if (current.items.length >= MAX_SAVED_DESTINATIONS) return 'limit'
      persist([...current.items, { id, month }])
      return 'saved'
    },
    remove(id: string) {
      if (!hydrated) return
      reconcileMutation()
      if (!current.items.some(item => item.id === id)) return
      persist(current.items.filter(item => item.id !== id))
    },
    clear() {
      if (!hydrated) return
      reconcileMutation()
      if (current.items.length) persist([])
    },
  }
}
