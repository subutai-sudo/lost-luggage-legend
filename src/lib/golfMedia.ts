export interface GolfMediaResource {
  url: string
  label: string
  publisher: string
  checkedAt: string
  scope: string
}
export interface GolfLayoutResource extends GolfMediaResource {
  kind: 'routing-map' | 'hole-tour' | 'scorecard'
}
export interface GolfCoursePhoto {
  src: string
  width: number
  height: number
  alt: string
  caption: string
  scope: string
  author: string
  sourcePage: string
  originalUrl: string
  license: 'CC0' | 'Public domain' | 'CC BY 2.0' | 'CC BY 3.0' | 'CC BY 4.0' | 'CC BY-SA 2.0' | 'CC BY-SA 2.5' | 'CC BY-SA 3.0' | 'CC BY-SA 4.0'
  licenseUrl: string
  checkedAt: string
}
export interface GolfRoutingMap {
  src: string
  width: number
  height: number
  alt: string
  sourcePage: string
  checkedAt: string
  scope: string
  holes: number[]
  license: 'ODbL 1.0'
  licenseUrl: string
}
import golfCourseMedia from '../data/golfCourseMedia.json'
import { GOLF_COURSES } from '../data/golfCourses'

export interface GolfCourseMedia {
  courseId: string
  gallery: GolfMediaResource | null
  layout: GolfLayoutResource | null
  photos: GolfCoursePhoto[]
  map: GolfRoutingMap | null
}
const licenseLinks: Record<GolfCoursePhoto['license'], string> = {
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
  'Public domain': 'https://creativecommons.org/publicdomain/mark/1.0/',
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC BY-SA 2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
}
function required(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim() || /[<>\u0000-\u0008]/.test(value)) throw new Error(`Invalid golf media ${field}`)
}
function https(value: unknown, field: string): asserts value is string {
  required(value, field)
  let url: URL
  try { url = new URL(value) } catch { throw new Error(`Invalid golf media URL: ${field}`) }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !url.hostname.includes('.') || /^(?:\d|\[)/.test(url.hostname) || /\.(?:local|localhost|internal|test)$/.test(url.hostname)) throw new Error(`Unsafe golf media URL: ${field}`)
}
function date(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error('Invalid golf media check date')
}
function dimensions(record: { src: string; width: number; height: number }, id: string, allowVector = false) {
  // All media is locally hosted after provenance review. No arbitrary remote image proxy.
  const extensions = allowVector ? '(?:svg|webp|png|jpg)' : '(?:webp|png|jpg)'
  if (!new RegExp(`^/golf-media/${id}(?:-[a-z0-9]+)*\\.${extensions}$`).test(record.src)) throw new Error(`Unsafe or cross-course media asset: ${id}`)
  for (const value of [record.width, record.height]) if (!Number.isInteger(value) || value < 32 || value > 8192) throw new Error('Invalid golf media dimensions')
}
function resource(value: GolfMediaResource) {
  https(value.url, 'resource')
  for (const field of ['label', 'publisher', 'scope'] as const) required(value[field], field)
  date(value.checkedAt)
}

export function validateGolfMedia(records: GolfCourseMedia[], courseIds: string[]): void {
  if (!Array.isArray(records) || new Set(courseIds).size !== courseIds.length || records.length !== courseIds.length) throw new Error('Golf media must cover the exact course inventory')
  const ids = new Set<string>(), assets = new Set<string>(), originals = new Set<string>()
  for (const entry of records) {
    if (!entry || !courseIds.includes(entry.courseId) || ids.has(entry.courseId)) throw new Error('Unknown or duplicated golf media course')
    ids.add(entry.courseId)
    if (entry.gallery !== null) resource(entry.gallery)
    if (entry.layout !== null) {
      resource(entry.layout)
      if (!['routing-map', 'hole-tour', 'scorecard'].includes(entry.layout.kind)) throw new Error('Invalid layout resource type')
    }
    if (!Array.isArray(entry.photos)) throw new Error('Golf photos require an explicit list, including when unavailable')
    for (const photo of entry.photos) {
      dimensions(photo, entry.courseId)
      for (const field of ['alt', 'caption', 'scope', 'author'] as const) required(photo[field], field)
      https(photo.sourcePage, 'photo source'); https(photo.originalUrl, 'photo original'); https(photo.licenseUrl, 'photo licence')
      if (licenseLinks[photo.license] !== photo.licenseUrl) throw new Error('Unapproved or inconsistent golf photo licence')
      if (assets.has(photo.src) || originals.has(photo.originalUrl)) throw new Error('Repeated image asset across course guides')
      assets.add(photo.src); originals.add(photo.originalUrl)
      date(photo.checkedAt)
    }
    if (entry.map !== null) {
      const map = entry.map
      dimensions(map, entry.courseId, true)
      required(map.alt, 'map alt'); required(map.scope, 'map scope'); https(map.sourcePage, 'map source'); date(map.checkedAt)
      if (map.license !== 'ODbL 1.0' || map.licenseUrl !== 'https://opendatacommons.org/licenses/odbl/1-0/') throw new Error('Missing routing-map data licence')
      if (!Array.isArray(map.holes) || !map.holes.length || new Set(map.holes).size !== map.holes.length || map.holes.some(h => !Number.isInteger(h) || h < 1 || h > 36)) throw new Error('Missing or ambiguous mapped hole references')
      if (assets.has(map.src)) throw new Error('Repeated routing-map asset')
      assets.add(map.src)
    }
  }
}

// Explicit display-field projection: internal verification notes never become props.
export function getGolfCourseMedia(id: string, records: GolfCourseMedia[], courseIds: string[]): GolfCourseMedia | undefined {
  validateGolfMedia(records, courseIds)
  const record = records.find(item => item.courseId === id)
  if (!record) return undefined
  const displayResource = (item: GolfMediaResource) => ({ url: item.url, label: item.label, publisher: item.publisher, checkedAt: item.checkedAt, scope: item.scope })
  return {
    courseId: record.courseId,
    gallery: record.gallery && displayResource(record.gallery),
    layout: record.layout && { ...displayResource(record.layout), kind: record.layout.kind },
    photos: record.photos.map(p => ({ src: p.src, width: p.width, height: p.height, alt: p.alt, caption: p.caption, scope: p.scope, author: p.author, sourcePage: p.sourcePage, originalUrl: p.originalUrl, license: p.license, licenseUrl: p.licenseUrl, checkedAt: p.checkedAt })),
    map: record.map && { src: record.map.src, width: record.map.width, height: record.map.height, alt: record.map.alt, sourcePage: record.map.sourcePage, checkedAt: record.map.checkedAt, scope: record.map.scope, holes: [...record.map.holes], license: record.map.license, licenseUrl: record.map.licenseUrl },
  }
}

const DEFAULT_RECORDS = golfCourseMedia as GolfCourseMedia[]
const DEFAULT_COURSE_IDS = GOLF_COURSES.map(course => course.id)

/** Server-side lookup used by the course route. Validation runs before any prop is built. */
export function getGolfMediaForCourse(courseId: string): GolfCourseMedia | undefined {
  return getGolfCourseMedia(courseId, DEFAULT_RECORDS, DEFAULT_COURSE_IDS)
}

/** The one photo approved for on-page display, used as the guide hero when present. */
export function getGolfHeroPhoto(courseId: string): GolfCoursePhoto | undefined {
  return getGolfMediaForCourse(courseId)?.photos[0]
}
