import type { Metadata } from 'next'

// Canonicals must name the public site, including on localhost/Vercel previews.
// Do not derive these URLs from request headers or a preview deployment hostname.
export const SITE_ORIGIN = 'https://lostluggagelegend.com'
export const SITE_NAME = 'Lost Luggage Legend'
export const SOCIAL_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85'

export const INDEXABLE_STATIC_PATHS = [
  '/',
  '/guides',
  '/golf',
  '/plan',
  '/explore',
  '/privacy-policy',
  '/terms-of-service',
  '/affiliate-disclosure',
] as const

export function siteUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('Site metadata requires an absolute local path')
  }
  return new URL(path, SITE_ORIGIN).href
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = siteUrl(path)
  const socialTitle = `${title} | ${SITE_NAME}`
  return {
    // The root layout appends the brand exactly once to document titles.
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      url,
      title: socialTitle,
      description,
      images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [SOCIAL_IMAGE],
    },
  }
}
