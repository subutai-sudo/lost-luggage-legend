import Image from 'next/image'
import Link from 'next/link'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import { Navbar } from '@/components/Navbar'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export const metadata = {
  title: 'All Destination Guides | Lost Luggage Legend',
  description: 'Browse 100+ expert destination guides with honest price comparisons. Find your next trip — from Bangkok to Barcelona, Maldives to Marrakech.',
}

export default function GuidesPage() {
  const sorted = [...DESTINATION_GUIDES].sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  // Group by first letter for alphabetical navigation
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const grouped = new Map<string, typeof sorted>()
  for (const guide of sorted) {
    const letter = guide.title[0].toUpperCase()
    const group = grouped.get(letter) || []
    group.push(guide)
    grouped.set(letter, group)
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)' }} />
          <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-0.5 bg-accent" />
              <span className="text-accent text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {DESTINATION_GUIDES.length} Destinations
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-ink leading-tight mb-5">
              Destination Guides
            </h1>
            <p className="text-ink-light text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Honest, editorial guides with real price comparisons from trusted booking sites.
              No fake data, no sponsored reviews — just the information you need to plan your next trip.
            </p>
          </div>

          {/* Alphabetical quick-jump */}
          <div className="flex flex-wrap gap-1.5 mt-10">
            {letters.map((letter) => {
              const hasGuides = grouped.has(letter)
              return (
                <a
                  key={letter}
                  href={hasGuides ? `#letter-${letter}` : undefined}
                  className={`w-9 h-9 flex items-center justify-center text-sm rounded transition-colors ${
                    hasGuides
                      ? 'bg-bg-subtle text-ink hover:bg-accent hover:text-white cursor-pointer'
                      : 'bg-bg-subtle/30 text-muted/30 cursor-default'
                  }`}
                  style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}
                  {...(!hasGuides ? { 'aria-disabled': true } : {})}
                >
                  {letter}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Guide List */}
      <main style={{ backgroundColor: 'var(--color-bg)' }} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {letters.map((letter) => {
            const guides = grouped.get(letter)
            if (!guides) return null
            return (
              <section key={letter} id={`letter-${letter}`} className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display text-3xl font-bold text-gold">{letter}</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-muted text-xs uppercase tracking-wider" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    {guides.length} {guides.length === 1 ? 'guide' : 'guides'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group flex gap-4 p-4 rounded-lg border border-border bg-card-bg hover:border-gold hover:shadow-md transition-all duration-200"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={guide.heroImage}
                          alt={guide.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="64px"
                        />
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition-colors leading-tight truncate">
                          {guide.title}
                        </h3>
                        <p className="text-muted text-xs mt-0.5 truncate" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                          {guide.subtitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-semibold text-white"
                            style={{ backgroundColor: guide.themeColor, fontFamily: "'Source Sans 3', sans-serif" }}
                          >
                            {guide.theme}
                          </span>
                          <span className="text-gold text-xs" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                            {guide.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      {/* Newsletter */}
      <section id="newsletter" style={{ backgroundColor: 'var(--color-bg-warm)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}
