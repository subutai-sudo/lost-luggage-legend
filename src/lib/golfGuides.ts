import { DESTINATION_GUIDES, type DestinationGuide } from '../data/destinationGuides'
import { GOLF_COURSES } from '../data/golfCourses'
import golfGuideDetails from '../data/golfGuideDetails.json'
import golfSources from '../data/golfSources.json'
import golfNotes from '../data/golfCourseNotes.json'
import {
  getGolfDisplayCatalog, getGolfReason, SUPPORTED_GOLF_MONTHS,
  type GolfCourse, type GolfDisplaySource, type GolfNote, type GolfSource, type ResolvedGolfNote,
} from './golfDiscovery'

export interface GolfGuideDetail {
  courseId: string
  overview: string
  playingNotes: string[]
  access: string
  planning: string[]
  sourceIds: string[]
  sources?: GolfDisplaySource[]
}

/** Injectable authoring inputs keep the real rendering boundary independently testable. */
export interface GolfGuideInput {
  details: unknown
  courses: GolfCourse[]
  sources: GolfSource[]
  notes: GolfNote[]
  destinations: DestinationGuide[]
}

export interface GolfGuide {
  course: GolfCourse
  destination: { id: string; title: string; slug: string; heroImage: string }
  overview: string
  playingNotes: string[]
  access: string
  planning: string[]
  supportedMonths: number[]
  monthlyNotes: ResolvedGolfNote[]
  sources: GolfDisplaySource[]
}

const DEFAULT_INPUT: GolfGuideInput = {
  details: golfGuideDetails,
  courses: GOLF_COURSES,
  sources: golfSources,
  notes: golfNotes,
  destinations: DESTINATION_GUIDES,
}

function record(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid ${label}`)
}

function text(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Invalid ${label}: expected nonempty text`)
}

function identifier(value: unknown, label: string): asserts value is string {
  text(value, label)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error(`Invalid ${label}`)
}

function strings(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value) || !value.length) throw new Error(`Invalid ${label}: expected a nonempty list`)
  for (const item of value) text(item, label)
  if (new Set(value).size !== value.length) throw new Error(`Duplicate ${label}`)
}

function sourceRecord(value: unknown): asserts value is GolfDisplaySource {
  record(value, 'golf guide source')
  identifier(value.id, 'golf guide source ID')
  text(value.title, 'golf guide source title')
  text(value.publisher, 'golf guide source publisher')
  text(value.url, 'golf guide source URL')
  const url = new URL(value.url)
  if (url.protocol !== 'https:' || url.username || url.password || [...url.searchParams.keys()].some(key => /^utm_|^(fbclid|gclid)$/i.test(key))) {
    throw new Error(`Unsafe or tracked golf guide source URL: ${value.id}`)
  }
  text(value.checkedAt, 'golf guide source check date')
  const date = new Date(`${value.checkedAt}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.checkedAt) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value.checkedAt) {
    throw new Error(`Invalid golf guide source check date: ${value.id}`)
  }
}

/** Explicit projection: authoring evidence, review fields and unknown keys never escape. */
function displaySource({ id, url, title, publisher, checkedAt }: GolfDisplaySource): GolfDisplaySource {
  return { id, url, title, publisher, checkedAt }
}

function sourcePool(sources: GolfDisplaySource[]): Map<string, GolfDisplaySource> {
  const pool = new Map<string, GolfDisplaySource>()
  for (const source of sources) {
    sourceRecord(source)
    if (pool.has(source.id)) throw new Error(`Duplicate golf guide source ID: ${source.id}`)
    pool.set(source.id, displaySource(source))
  }
  return pool
}

/**
 * Validate the entire details ledger, not just the requested course. Optional
 * sources are record-local; they cannot shadow a shared source ID. No fallback
 * prose, unknown records, duplicate records or dangling citations are accepted.
 */
export function validateGolfGuideDetails(
  details: unknown,
  courses: GolfCourse[] = GOLF_COURSES,
  sources: GolfDisplaySource[] = golfSources,
): asserts details is GolfGuideDetail[] {
  if (!Array.isArray(details)) throw new Error('Invalid golf guide details ledger')
  const courseIds = new Set<string>()
  for (const course of courses) {
    identifier(course.id, 'golf course ID')
    if (courseIds.has(course.id)) throw new Error(`Duplicate golf course identity: ${course.id}`)
    for (const key of ['name', 'city', 'country', 'destinationId', 'character'] as const) text(course[key], `golf course ${key}`)
    courseIds.add(course.id)
  }
  if (!courseIds.size) throw new Error('Empty golf course catalog')
  sourcePool(sources)
  const covered = new Set<string>()
  for (const detail of details) {
    record(detail, 'golf guide detail')
    identifier(detail.courseId, 'golf guide course ID')
    if (!courseIds.has(detail.courseId)) throw new Error(`Unknown golf guide course: ${detail.courseId}`)
    if (covered.has(detail.courseId)) throw new Error(`Duplicate golf guide detail: ${detail.courseId}`)
    covered.add(detail.courseId)
    text(detail.overview, 'golf guide overview')
    text(detail.access, 'golf guide visitor access')
    strings(detail.playingNotes, 'golf guide playing notes')
    strings(detail.planning, 'golf guide planning notes')
    strings(detail.sourceIds, 'golf guide source references')
    if (detail.sources !== undefined && !Array.isArray(detail.sources)) throw new Error('Invalid additional golf guide sources')
    const pool = sourcePool([...sources, ...(detail.sources ?? [])])
    for (const id of detail.sourceIds) {
      identifier(id, 'golf guide source reference')
      if (!pool.has(id)) throw new Error(`Missing golf guide source: ${detail.courseId}:${id}`)
    }
  }
  for (const id of courseIds) {
    if (!covered.has(id)) throw new Error(`Missing golf guide detail: ${id}`)
  }
}

/** Pure, fail-closed server projection used by static params, metadata and pages. */
export function getGolfGuides(input: GolfGuideInput = DEFAULT_INPUT): GolfGuide[] {
  validateGolfGuideDetails(input.details, input.courses, input.sources)
  // Reuse the seasonal ledger's exact coverage, eligibility, URL and evidence checks.
  // Evidence is read for validation only; only the display projection is returned.
  const catalog = getGolfDisplayCatalog({ sources: input.sources, notes: input.notes }, input.courses)
  const detailsById = new Map(input.details.map(detail => [detail.courseId, detail]))
  const destinations = new Map<string, DestinationGuide>()
  for (const destination of input.destinations) {
    if (destinations.has(destination.id)) throw new Error(`Duplicate golf destination: ${destination.id}`)
    destinations.set(destination.id, destination)
  }
  return input.courses.map(course => {
    const detail = detailsById.get(course.id)!
    const destination = destinations.get(course.destinationId)
    if (!destination) throw new Error(`Golf course ${course.id} references an unknown destination: ${course.destinationId}`)
    const supportedMonths = [...(SUPPORTED_GOLF_MONTHS[course.id] ?? [])]
    if (!supportedMonths.length) throw new Error(`Missing supported golf months: ${course.id}`)
    const monthlyNotes = supportedMonths.map(month => getGolfReason(catalog, course.id, month))
    const pool = sourcePool([...input.sources, ...(detail.sources ?? [])])
    const referenced = new Set([...detail.sourceIds, ...monthlyNotes.flatMap(note => note.sourceIds)])
    const sources = [...referenced].map(id => {
      const source = pool.get(id)
      if (!source) throw new Error(`Missing golf guide source: ${id}`)
      return displaySource(source)
    })
    return {
      course: {
        id: course.id, name: course.name, city: course.city, country: course.country,
        destinationId: course.destinationId, character: course.character,
      },
      destination: { id: destination.id, title: destination.title, slug: destination.slug, heroImage: destination.heroImage },
      overview: detail.overview,
      playingNotes: [...detail.playingNotes],
      access: detail.access,
      planning: [...detail.planning],
      supportedMonths,
      monthlyNotes,
      sources,
    }
  })
}

/** Unknown IDs remain unknown; validation errors deliberately propagate. */
export function getGolfGuide(courseId: string, input: GolfGuideInput = DEFAULT_INPUT): GolfGuide | undefined {
  return getGolfGuides(input).find(guide => guide.course.id === courseId)
}
