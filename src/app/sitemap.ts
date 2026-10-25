import type { MetadataRoute } from 'next'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import { GOLF_COURSES } from '@/data/golfCourses'
import { INDEXABLE_STATIC_PATHS, siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...INDEXABLE_STATIC_PATHS,
    ...DESTINATION_GUIDES.map((guide) => `/guides/${guide.slug}`),
    ...GOLF_COURSES.map((course) => `/golf/${course.id}`),
  ]

  return [...new Set(paths)].map((path) => ({ url: siteUrl(path) }))
}
