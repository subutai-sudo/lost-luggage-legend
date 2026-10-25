import { MONTH_NAMES, discoveryImage, isTravelMonth, readTravelMonth } from './goldilocksDiscovery'

export { MONTH_NAMES, discoveryImage }

/** A real, verifiable golf course keyed to one of the site's destination guides. */
export interface GolfCourse {
  id: string
  name: string
  city: string
  country: string
  /** Destination guide id; supplies the approved photograph and the cross-link. */
  destinationId: string
  /** Sourced course character, e.g. links, heathland, parkland, desert, coastal-cliff, resort, mountain. */
  character: string
}

/** Authoring/review source record. Evidence is never sent to the browser. */
export interface GolfSource {
  id: string
  url: string
  title: string
  publisher: string
  checkedAt: string
  evidence: string
}

export interface GolfNote {
  courseId: string
  month: number
  why: string
  tradeoff: string
  sourceIds: string[]
}

export interface GolfDisplaySource {
  id: string
  url: string
  title: string
  publisher: string
  checkedAt: string
}

export interface GolfDisplayCatalog {
  sources: GolfDisplaySource[]
  notes: GolfNote[]
}

export interface ResolvedGolfNote extends GolfNote {
  sources: GolfDisplaySource[]
}

export type GolfCharacter = 'links' | 'heathland' | 'parkland' | 'desert' | 'coastal-cliff' | 'resort' | 'mountain'

/**
 * Month-specific editorial selections, not numerical rankings. Every slot is
 * reviewed in golfCourseReview.json; supported month eligibility stays separate
 * from promotion and never claims these are the only playable courses.
 *
 * An empty or malformed shortlist must throw rather than silently fall back
 * to another month. Reviewed replacements retain the existing month leads.
 */
export const MONTHLY_GOLF_LEADS: readonly string[] = ['emirates-golf-club-majlis-course', 'tpc-scottsdale-stadium-course', 'royal-cape-golf-club', 'the-royal-melbourne-golf-club-west', 'portmarnock-golf-club', 'muirfield', 'keilir-golf-club', 'capilano-golf-and-country-club', 'bethpage-black', 'oitavos-dunes', 'steenberg-golf-club', 'new-south-wales-golf-club']

export const MONTHLY_GOLF_SHORTLISTS: readonly (readonly string[])[] = [
  ['emirates-golf-club-majlis-course', 'jack-s-point', 'al-maaden-golf', 'oitavos-dunes', 'torrey-pines-golf-course-south-course', 'montgomerie-maxx-royal'],
  ['tpc-scottsdale-stadium-course', 'royal-golf-marrakech-old-course', 'new-south-wales-golf-club', 'millbrook-resort', 'thai-country-club', 'katameya-heights-golf-tennis-resort'],
  ['royal-cape-golf-club', 'new-south-wales-golf-club', 'oitavos-dunes', 'millbrook-resort', 'katameya-heights-golf-tennis-resort', 'real-club-de-golf-el-prat'],
  ['the-royal-melbourne-golf-club-west', 'muirfield', 'marco-simone-golf-country-club', 'millbrook-resort', 'emirates-golf-club-majlis-course', 'sentosa-golf-club-serapong'],
  ['portmarnock-golf-club', 'wentworth-club-west', 'brautarholt-golf-club', 'bro-hof-slott-stadium', 'kennemer-golf-country-club', 'praia-d-el-rey'],
  ['muirfield', 'brautarholt-golf-club', 'bro-hof-slott-stadium', 'bali-national-golf-club', 'portmarnock-golf-club', 'walton-heath-golf-club-old'],
  ['keilir-golf-club', 'kyt-j-golf-south-east', 'bali-national-golf-club', 'portmarnock-golf-club', 'bro-hof-slott-stadium', 'muirfield'],
  ['capilano-golf-and-country-club', 'chambers-bay', 'fontana-golf-club', 'new-south-wales-golf-club', 'cog-hill-no-4-dubsdread', 'glen-abbey-golf-club'],
  ['bethpage-black', 'crans-sur-sierre-golf-club-ballesteros', 'montgomerie-maxx-royal', 'real-club-de-golf-el-prat', 'the-royal-melbourne-golf-club-west', 'marco-simone-golf-country-club'],
  ['oitavos-dunes', 'the-royal-melbourne-golf-club-west', 'emirates-golf-club-majlis-course', 'royal-golf-marrakech-old-course', 'sentosa-golf-club-serapong', 'jack-s-point'],
  ['steenberg-golf-club', 'emirates-golf-club-majlis-course', 'sentosa-golf-club-serapong', 'the-royal-melbourne-golf-club-west', 'jack-s-point', 'kennemer-golf-country-club'],
  ['new-south-wales-golf-club', 'steenberg-golf-club', 'jack-s-point', 'sentosa-golf-club-serapong', 'tpc-summerlin', 'kennemer-golf-country-club'],
]

/**
 * Independently supported editorial months, transcribed from the reviewed
 * course/month ledger (golfCourseReview.json), NOT derived from the shortlist.
 * This is the evidence-backed scope we can currently promote, not an opening
 * calendar or a claim that other months are unplayable. Extend only after a
 * separate course/month evidence review; changing a shortlist grants no rights.
 * Kept as plain data so the pure selector enforces the same scope in the client
 * without importing authoring evidence or a server-only JSON dependency.
 */
export const SUPPORTED_GOLF_MONTHS: Readonly<Record<string, readonly number[]>> = Object.freeze({
  'al-maaden-golf': Object.freeze([1]),
  'bali-national-golf-club': Object.freeze([6, 7]),
  'bethpage-black': Object.freeze([9]),
  'brautarholt-golf-club': Object.freeze([5, 6]),
  'bro-hof-slott-stadium': Object.freeze([5, 6, 7]),
  'capilano-golf-and-country-club': Object.freeze([8]),
  'chambers-bay': Object.freeze([8]),
  'cog-hill-no-4-dubsdread': Object.freeze([8]),
  'crans-sur-sierre-golf-club-ballesteros': Object.freeze([9]),
  'emirates-golf-club-majlis-course': Object.freeze([1, 4, 10, 11]),
  'fontana-golf-club': Object.freeze([8]),
  'glen-abbey-golf-club': Object.freeze([8]),
  'jack-s-point': Object.freeze([1, 10, 11, 12]),
  'katameya-heights-golf-tennis-resort': Object.freeze([2, 3]),
  'keilir-golf-club': Object.freeze([7]),
  'kennemer-golf-country-club': Object.freeze([5, 11, 12]),
  'kyt-j-golf-south-east': Object.freeze([7]),
  'marco-simone-golf-country-club': Object.freeze([4, 9]),
  'millbrook-resort': Object.freeze([2, 3, 4]),
  'montgomerie-maxx-royal': Object.freeze([1, 9]),
  'muirfield': Object.freeze([4, 6, 7]),
  'new-south-wales-golf-club': Object.freeze([2, 3, 8, 12]),
  'oitavos-dunes': Object.freeze([1, 3, 10]),
  'portmarnock-golf-club': Object.freeze([5, 6, 7]),
  'praia-d-el-rey': Object.freeze([5]),
  'real-club-de-golf-el-prat': Object.freeze([3, 9]),
  'royal-cape-golf-club': Object.freeze([3]),
  'royal-golf-marrakech-old-course': Object.freeze([2, 10]),
  'sentosa-golf-club-serapong': Object.freeze([4, 10, 11, 12]),
  'steenberg-golf-club': Object.freeze([11, 12]),
  'thai-country-club': Object.freeze([2]),
  'the-royal-melbourne-golf-club-west': Object.freeze([4, 9, 10, 11]),
  'torrey-pines-golf-course-south-course': Object.freeze([1]),
  'tpc-scottsdale-stadium-course': Object.freeze([2]),
  'tpc-summerlin': Object.freeze([12]),
  'walton-heath-golf-club-old': Object.freeze([6]),
  'wentworth-club-west': Object.freeze([5]),
})

function validMonth(month: number) {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('Golf month must be an integer from 1 to 12')
}

function text(value: unknown, label: string, limit: number): asserts value is string {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) throw new Error(`Invalid ${label}`)
}

/** Shared by server coverage validation and the client selector. */
function selectedIds(month: number): readonly string[] {
  validMonth(month)
  const ids = MONTHLY_GOLF_SHORTLISTS[month - 1]
  if (MONTHLY_GOLF_SHORTLISTS.length !== 12 || MONTHLY_GOLF_LEADS.length !== 12 || new Set(MONTHLY_GOLF_LEADS).size !== 12 || !ids || ids.length !== 6 || new Set(ids).size !== 6 || ids[0] !== MONTHLY_GOLF_LEADS[month - 1]) {
    throw new Error(`Invalid golf shortlist for ${MONTH_NAMES[month - 1]}`)
  }
  for (const id of ids) {
    if (!SUPPORTED_GOLF_MONTHS[id]?.includes(month)) throw new Error(`Ineligible golf course selection: ${id}:${month}`)
  }
  return ids
}

/** Authoring validation, including exact coverage of every promoted slot. */
export function validateGolfCatalog(catalog: GolfDisplayCatalog & { sources: GolfSource[] }): void {
  if (!catalog || !Array.isArray(catalog.sources) || !Array.isArray(catalog.notes)) throw new Error('Invalid golf catalog')
  const sources = new Set<string>()
  for (const source of catalog.sources) {
    text(source.id, 'golf source ID', 100)
    if (!/^[a-z0-9-]+$/.test(source.id) || sources.has(source.id)) throw new Error('Invalid or duplicate golf source ID')
    sources.add(source.id)
    text(source.title, 'golf source title', 240)
    text(source.publisher, 'golf source publisher', 160)
    text(source.evidence, 'golf source evidence', 2400)
    text(source.url, 'golf source URL', 1500)
    const url = new URL(source.url)
    if (url.protocol !== 'https:' || url.username || url.password || [...url.searchParams.keys()].some(key => /^utm_|^(fbclid|gclid)$/i.test(key))) throw new Error('Unsafe or tracked golf source URL')
    text(source.checkedAt, 'golf source check date', 10)
    const date = new Date(`${source.checkedAt}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== source.checkedAt) throw new Error('Invalid golf source check date')
  }
  const pairs = new Set<string>()
  for (const note of catalog.notes) {
    text(note.courseId, 'golf course ID', 100)
    if (!/^[a-z0-9-]+$/.test(note.courseId)) throw new Error('Invalid golf course ID')
    validMonth(note.month)
    const pair = `${note.courseId}:${note.month}`
    if (pairs.has(pair)) throw new Error('Duplicate golf course/month note')
    pairs.add(pair)
    if (!SUPPORTED_GOLF_MONTHS[note.courseId]?.includes(note.month)) throw new Error(`Ineligible golf course/month note: ${pair}`)
    text(note.why, 'golf reason', 240)
    text(note.tradeoff, 'golf trade-off', 200)
    if (!Array.isArray(note.sourceIds) || !note.sourceIds.length || new Set(note.sourceIds).size !== note.sourceIds.length || note.sourceIds.some(id => !sources.has(id))) throw new Error('Invalid golf source references')
  }
  const selected = new Set<string>()
  for (let month = 1; month <= 12; month++) {
    for (const id of selectedIds(month)) {
      const pair = `${id}:${month}`
      if (!pairs.has(pair)) throw new Error(`Missing golf course/month note: ${pair}`)
      selected.add(pair)
    }
  }
  for (const pair of pairs) {
    if (!selected.has(pair)) throw new Error(`Unexpected golf course/month note: ${pair}`)
  }
}

/**
 * The server rendering boundary: validate ALL authoring records, exact 72-slot
 * coverage, independent month support and course identities before projecting.
 * Authoring evidence and uncited sources never reach the browser.
 */
export function getGolfDisplayCatalog(catalog: GolfDisplayCatalog & { sources: GolfSource[] }, courses: GolfCourse[]): GolfDisplayCatalog {
  validateGolfCatalog(catalog)
  for (let month = 1; month <= 12; month++) getGolfMonthSelection(courses, month)
  const referenced = new Set<string>()
  for (const note of catalog.notes) {
    if (!Array.isArray(note.sourceIds)) throw new Error('Invalid golf source references')
    for (const id of note.sourceIds) referenced.add(id)
  }
  const sources = catalog.sources
    .filter(source => referenced.has(source.id))
    .map(({ id, url, title, publisher, checkedAt }) => ({ id, url, title, publisher, checkedAt }))
  const notes = catalog.notes.map(({ courseId, month, why, tradeoff, sourceIds }) => ({
    courseId, month, why, tradeoff, sourceIds: [...sourceIds],
  }))
  return { sources, notes }
}

/** Exact lookup: never substitute another month or manufacture a reason. */
export function getGolfReason(catalog: GolfDisplayCatalog, courseId: string, month: number): ResolvedGolfNote {
  validMonth(month)
  const notes = catalog.notes.filter(note => note.courseId === courseId && note.month === month)
  if (!notes.length) throw new Error(`Missing golf course/month note: ${courseId}:${month}`)
  if (notes.length !== 1) throw new Error(`Duplicate golf course/month note: ${courseId}:${month}`)
  const note = notes[0]
  if (!SUPPORTED_GOLF_MONTHS[courseId]?.includes(month)) throw new Error(`Ineligible golf course/month note: ${courseId}:${month}`)
  if (new Set(note.sourceIds).size !== note.sourceIds.length) throw new Error('Invalid golf source references')
  const sources = note.sourceIds.map(id => {
    const matches = catalog.sources.filter(source => source.id === id)
    if (!matches.length) throw new Error(`Missing golf source: ${id}`)
    if (matches.length !== 1) throw new Error(`Duplicate golf source: ${id}`)
    return matches[0]
  })
  if (!sources.length) throw new Error('Golf note has no source evidence')
  return { ...note, sources }
}

function courseIndex<T extends GolfCourse>(courses: T[]) {
  const index = new Map<string, T>()
  for (const course of courses) {
    if (index.has(course.id)) throw new Error(`Duplicate golf course identity: ${course.id}`)
    index.set(course.id, course)
  }
  return index
}

/** Fail-closed selection: six unique, existing, independently supported picks. */
export function getGolfMonthSelection<T extends GolfCourse>(courses: T[], month: number): { featured: T; shortlist: T[]; total: number } {
  validMonth(month)
  const byId = courseIndex(courses)
  const ids = selectedIds(month)
  const shortlist = ids.map(id => {
    const course = byId.get(id)
    if (!course) throw new Error(`Missing golf course selection: ${id}`)
    return course
  })
  return { featured: shortlist[0], shortlist, total: courses.length }
}

/** One preview course per month for the calendar band. */
export function getGolfMonthPreviews<T extends GolfCourse>(courses: T[]): T[] {
  const byId = courseIndex(courses)
  if (MONTHLY_GOLF_LEADS.length !== 12) throw new Error('Golf month previews require twelve leads')
  return MONTHLY_GOLF_LEADS.map((id, index) => {
    const course = byId.get(id)
    if (!course) throw new Error(`Missing golf month preview ${index + 1}: ${id}`)
    return course
  })
}

export function readGolfMonth(search: string, fallback: number) {
  return readTravelMonth(search, fallback)
}

export { isTravelMonth }
