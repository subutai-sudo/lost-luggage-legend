import type { Metadata } from 'next'
import { GolfZone, type GolfZoneCourse } from '@/components/GolfZone'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import { GOLF_COURSES } from '@/data/golfCourses'
import golfSources from '@/data/golfSources.json'
import golfNotes from '@/data/golfCourseNotes.json'
import { getGolfDisplayCatalog, type GolfSource } from '@/lib/golfDiscovery'
import { pageMetadata } from '@/lib/site'
import { getGolfFinderMedia } from '@/lib/golfFinderMedia'

export const metadata: Metadata = pageMetadata({
  title: 'Golf Goldilocks Zone — The Best Courses by Month',
  description: 'Choose a month and see six golf courses worth playing then, with the reason each suits that month, the trade-off to expect and the checks behind it.',
  path: '/golf',
})

export default function GolfPage() {
  const guides = new Map(DESTINATION_GUIDES.map(guide => [guide.id, guide]))
  const media = getGolfFinderMedia()
  const courses: GolfZoneCourse[] = GOLF_COURSES.map(course => {
    const guide = guides.get(course.destinationId)
    if (!guide) throw new Error(`Golf course ${course.id} references an unknown destination: ${course.destinationId}`)
    return {
      ...course,
      destinationTitle: guide.title,
      destinationSlug: guide.slug,
      image: guide.heroImage,
      media: media[course.id],
    }
  })

  // Validate authoring URLs, dates, references and all 72 eligible selections
  // before projecting. Only allowlisted renderable fields cross to the client;
  // authoring evidence never ships to the browser.
  const catalog = getGolfDisplayCatalog({ sources: golfSources as GolfSource[], notes: golfNotes }, courses)

  // Server renders a deterministic month; the client synchronizes to the
  // visitor's local month (or an explicit ?month=) without a hydration mismatch.
  const now = new Date()
  return <GolfZone courses={courses} initialMonth={now.getUTCMonth() + 1} catalog={catalog} />
}
