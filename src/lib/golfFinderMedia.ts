import 'server-only'
import golfCourseMedia from '../data/golfCourseMedia.json'
import { GOLF_COURSES } from '../data/golfCourses'
import { validateGolfMedia, type GolfCourseMedia, type GolfCoursePhoto, type GolfLayoutResource } from './golfMedia'

/** Only display fields cross the finder client boundary; no authoring ledger. */
export interface GolfFinderMedia {
  photo: Pick<GolfCoursePhoto, 'src' | 'alt' | 'author' | 'modifications' | 'license' | 'licenseUrl' | 'sourcePage'> | null
  photoCount: number
  hasRoutingDiagram: boolean
  layoutKind: GolfLayoutResource['kind'] | null
  gallery: boolean
}

export function getGolfFinderMedia(records: GolfCourseMedia[] = golfCourseMedia as GolfCourseMedia[]): Record<string, GolfFinderMedia> {
  validateGolfMedia(records, GOLF_COURSES.map(course => course.id))
  return Object.fromEntries(records.map(record => {
    const photo = record.photos[0]
    return [record.courseId, {
      photo: photo ? {
        src: photo.src, alt: photo.alt, author: photo.author,
        ...(photo.modifications !== undefined ? { modifications: photo.modifications } : {}),
        license: photo.license, licenseUrl: photo.licenseUrl, sourcePage: photo.sourcePage,
      } : null,
      photoCount: record.photos.length,
      hasRoutingDiagram: record.map !== null,
      layoutKind: record.layout?.kind ?? null,
      gallery: record.gallery !== null,
    }]
  }))
}
