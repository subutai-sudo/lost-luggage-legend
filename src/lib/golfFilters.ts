/** UI filters narrow an existing editorial shortlist; they never grant month eligibility. */
export const GOLF_CHARACTERS = ['links', 'heathland', 'parkland', 'desert', 'coastal-cliff', 'resort', 'mountain'] as const
export interface GolfFilters { q: string; character: string; photos: boolean }
interface FilterableCourse {
  name: string; city: string; country: string; character: string
  media: { photo: unknown | null }
}
const cleanQuery = (q: string) => q.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80)
export function readGolfFilters(search: string): GolfFilters {
  const params = new URLSearchParams(search)
  const style = params.get('style') ?? ''
  return { q: cleanQuery(params.get('q') ?? ''), character: GOLF_CHARACTERS.some(value => value === style) ? style : '', photos: params.get('photos') === '1' }
}
export function filterGolfCourses<T extends FilterableCourse>(courses: T[], filters: GolfFilters): T[] {
  const q = cleanQuery(filters.q).toLocaleLowerCase('en')
  return courses.filter(course =>
    (!q || `${course.name} ${course.city} ${course.country}`.toLocaleLowerCase('en').includes(q)) &&
    (!filters.character || course.character === filters.character) &&
    (!filters.photos || !!course.media.photo))
}
function requireMonth(month: number) {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('Invalid golf month')
}
export function golfFinderQuery(month: number, filters: GolfFilters): string {
  requireMonth(month)
  const params = new URLSearchParams({ month: String(month) })
  const safe = readGolfFilters(new URLSearchParams({ q: filters.q, style: filters.character, photos: filters.photos ? '1' : '' }).toString())
  if (safe.q) params.set('q', safe.q)
  if (safe.character) params.set('style', safe.character)
  if (safe.photos) params.set('photos', '1')
  return `?${params.toString()}`
}
export function golfCourseHref(id: string, month: number, visuals = false): string {
  requireMonth(month)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Invalid golf course ID')
  return `/golf/${id}?month=${month}${visuals ? '#course-visuals' : ''}`
}
