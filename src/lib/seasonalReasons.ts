export interface SeasonalSource {
  id: string
  url: string
  title: string
  publisher: string
  checkedAt: string
  evidence: string
}

export interface SeasonalNote {
  destinationId: string
  month: number
  why: string
  tradeoff: string
  sourceIds: string[]
}

export interface SeasonalCatalog { sources: SeasonalSource[]; notes: SeasonalNote[] }
export interface ResolvedSeasonalNote extends SeasonalNote { sources: SeasonalSource[] }

function validMonth(month: number) {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('Travel month must be an integer from 1 to 12')
}

function text(value: unknown, label: string, limit: number): asserts value is string {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) throw new Error(`Invalid ${label}`)
}

/** Contract validation for authoring/tests; evidence quality still needs human review. */
export function validateSeasonalCatalog(catalog: SeasonalCatalog): void {
  if (!catalog || !Array.isArray(catalog.sources) || !Array.isArray(catalog.notes)) throw new Error('Invalid seasonal catalog')
  const sources = new Set<string>()
  for (const source of catalog.sources) {
    text(source.id, 'source ID', 100)
    if (!/^[a-z0-9-]+$/.test(source.id) || sources.has(source.id)) throw new Error('Invalid or duplicate source ID')
    sources.add(source.id)
    text(source.title, 'source title', 240)
    text(source.publisher, 'source publisher', 160)
    text(source.evidence, 'source evidence', 2400)
    text(source.url, 'source URL', 1500)
    const url = new URL(source.url)
    if (url.protocol !== 'https:' || url.username || url.password || [...url.searchParams.keys()].some(key => /^utm_|^(fbclid|gclid)$/i.test(key))) throw new Error('Unsafe or tracked source URL')
    text(source.checkedAt, 'source check date', 10)
    const date = new Date(`${source.checkedAt}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== source.checkedAt) throw new Error('Invalid source check date')
  }
  const pairs = new Set<string>()
  for (const note of catalog.notes) {
    text(note.destinationId, 'destination ID', 100)
    if (!/^[a-z0-9-]+$/.test(note.destinationId)) throw new Error('Invalid destination ID')
    validMonth(note.month)
    const pair = `${note.destinationId}:${note.month}`
    if (pairs.has(pair)) throw new Error('Duplicate destination/month note')
    pairs.add(pair)
    text(note.why, 'seasonal reason', 240)
    text(note.tradeoff, 'seasonal trade-off', 200)
    if (!Array.isArray(note.sourceIds) || !note.sourceIds.length || new Set(note.sourceIds).size !== note.sourceIds.length || note.sourceIds.some(id => !sources.has(id))) throw new Error('Invalid seasonal source references')
  }
}

/** Exact lookup: never substitute another month or manufacture a reason. */
export function getSeasonalReason(catalog: SeasonalCatalog, destinationId: string, month: number): ResolvedSeasonalNote | null {
  validMonth(month)
  const note = catalog.notes.find(note => note.destinationId === destinationId && note.month === month)
  if (!note) return null
  const sources = note.sourceIds.map(id => {
    const source = catalog.sources.find(source => source.id === id)
    if (!source) throw new Error(`Missing seasonal source: ${id}`)
    return source
  })
  if (!sources.length) throw new Error('Seasonal note has no source evidence')
  return { ...note, sources }
}
