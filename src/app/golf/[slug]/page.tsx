import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BrandLogo } from '@/components/BrandLogo'
import { Navbar } from '@/components/Navbar'
import { MONTH_NAMES } from '@/lib/golfDiscovery'
import { getGolfGuide, getGolfGuides } from '@/lib/golfGuides'
import { GOLF_OPERATIONAL_NOTICES } from '@/data/golfOperationalNotices'
import { pageMetadata } from '@/lib/site'
import styles from '@/components/GolfGuide.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getGolfGuides().map(({ course }) => ({ slug: course.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGolfGuide(slug)
  if (!guide) notFound()
  const { course, destination } = guide
  const title = `${course.name} Course Guide — When to Play & Visitor Access`
  const description = `Plan a round at ${course.name} in ${course.city}, ${course.country}: course character, playing notes, visitor access and sourced month-by-month advice.`
  const metadata = pageMetadata({ title, description, path: `/golf/${course.id}` })
  // Reuse only the destination's approved photo, with its scope explicit even in social previews.
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      images: [{ url: destination.heroImage, width: 1200, height: 630, alt: `${destination.title} destination photograph — not ${course.name}` }],
    },
    twitter: { ...metadata.twitter, images: [destination.heroImage] },
  }
}

export default async function GolfGuidePage({ params }: Props) {
  const { slug } = await params
  const guide = getGolfGuide(slug)
  if (!guide) notFound()
  const { course, destination, supportedMonths, monthlyNotes, sources } = guide

  return (
    <div className={styles.root} data-golf-guide={course.id}>
      <a className={styles.skip} href="#golf-guide-main">Skip to course guide</a>
      <div className={styles.navigation}>
        <Navbar appearance="cinematic" brandAppearance="cinematic" />
      </div>

      <main id="main-content">
      <header className={styles.hero} data-golf-guide-hero>
        <Image
          src={destination.heroImage}
          alt={`${destination.title} — destination photograph, not ${course.name}`}
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          data-golf-guide-image
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/golf">Golf month finder</Link>
            <span aria-hidden="true">/</span>
            <span>Course guide</span>
          </nav>
          <div className={styles.heroStory}>
            <p className={styles.eyebrow}>Golf Goldilocks Zone · Course field notes</p>
            <h1>{course.name}</h1>
            <p className={styles.location}>{course.city}, {course.country}</p>
            <p className={styles.character}>{course.character.replaceAll('-', ' ')} golf</p>
          </div>
          <div className={styles.heroFoot}>
            <p><strong>Destination photograph:</strong> {destination.title}. This is not a photograph of {course.name}.</p>
            <Link href="#golf-guide-main">Read the course guide <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
      </header>

      <div id="golf-guide-main" tabIndex={-1} className={styles.main}>
        <div className={styles.container}>
          <div className={styles.introduction}>
            {GOLF_OPERATIONAL_NOTICES[course.id] && (
              <p className={styles.tradeoff} data-golf-operational-notice>
                <strong>Before planning a round</strong>{GOLF_OPERATIONAL_NOTICES[course.id].text}{' '}
                <a href={GOLF_OPERATIONAL_NOTICES[course.id].url} rel="noreferrer">{GOLF_OPERATIONAL_NOTICES[course.id].label} ↗</a>
              </p>
            )}
            <p className={styles.eyebrow}>The course, in perspective</p>
            <p className={styles.overview} data-golf-guide-overview>{guide.overview}</p>
          </div>

          <div className={styles.editorialGrid}>
            <aside className={styles.sidebar} aria-label="Course guide at a glance">
              <div className={styles.sidebarInner}>
                <p className={styles.eyebrow}>Before you play</p>
                <dl className={styles.facts}>
                  <div><dt>Course character</dt><dd>{course.character.replaceAll('-', ' ')}</dd></div>
                  <div><dt>Course location</dt><dd>{course.city}, {course.country}</dd></div>
                  <div>
                    <dt>Supported editorial months</dt>
                    <dd data-golf-supported-months>{supportedMonths.map(month => MONTH_NAMES[month - 1]).join(' · ')}</dd>
                  </div>
                </dl>
                <p className={styles.note}>These are the months covered by our course-specific seasonal research, not an opening calendar or a claim that other months are unplayable.</p>
                <nav className={styles.contents} aria-label="In this course guide">
                  <a href="#playing-notes">Playing notes <span aria-hidden="true">↗</span></a>
                  <a href="#visitor-access">Visitor access &amp; tee times <span aria-hidden="true">↗</span></a>
                  <a href="#when-to-play">When to play <span aria-hidden="true">↗</span></a>
                  <a href="#sources">Sources &amp; checks <span aria-hidden="true">↗</span></a>
                </nav>
              </div>
            </aside>

            <article className={styles.article} aria-label={`${course.name} course guide`}>
              <section id="playing-notes" tabIndex={-1} className={styles.section}>
                <p className={styles.sectionNumber} aria-hidden="true">01 / The round</p>
                <h2>Playing notes</h2>
                <ul className={styles.highlights} data-golf-playing-notes>
                  {guide.playingNotes.map(note => <li key={note}>{note}</li>)}
                </ul>
              </section>

              <section id="visitor-access" tabIndex={-1} className={styles.section}>
                <p className={styles.sectionNumber} aria-hidden="true">02 / Before you book</p>
                <h2>Visitor access &amp; tee-time planning</h2>
                <p data-golf-visitor-access>{guide.access}</p>
                <ul className={styles.highlights} data-golf-planning>
                  {guide.planning.map(note => <li key={note}>{note}</li>)}
                </ul>
                <p className={styles.note}>Confirm the current visitor policy, any handicap requirements, course availability and maintenance directly with the club before committing to travel. We do not show live tee times or quote green fees.</p>
              </section>

              <section id="when-to-play" tabIndex={-1} className={styles.section}>
                <p className={styles.sectionNumber} aria-hidden="true">03 / Timing the trip</p>
                <h2>When to play {course.name}</h2>
                <p>Each supported month has its own reason and trade-off. This is editorial seasonal guidance, not a forecast, a ranking or a guarantee of access.</p>
                <div className={styles.monthNotes}>
                  {monthlyNotes.map(note => (
                    <section key={note.month} className={styles.monthNote} data-golf-reason data-golf-month={note.month} data-golf-course={course.id} aria-labelledby={`golf-month-${note.month}`}>
                      <div className={styles.monthHeading}>
                        <span aria-hidden="true">{String(note.month).padStart(2, '0')}</span>
                        <h3 id={`golf-month-${note.month}`}>{MONTH_NAMES[note.month - 1]}</h3>
                      </div>
                      <p className={styles.why} data-golf-why>{note.why}</p>
                      <p className={styles.tradeoff}><strong>Keep in mind</strong> <span data-golf-tradeoff>{note.tradeoff}</span></p>
                      <details className={styles.monthSources}>
                        <summary aria-label={`Sources & checks for ${course.name} in ${MONTH_NAMES[note.month - 1]}`}>Sources &amp; checks</summary>
                        <ul>
                          {note.sources.map(source => (
                            <li key={source.id}>
                              <a href={`#source-${source.id}`}>{source.title}</a>
                              <span>{source.publisher} · Source checked <time dateTime={source.checkedAt}>{source.checkedAt}</time></span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </section>
                  ))}
                </div>
              </section>

              <section id="sources" tabIndex={-1} className={styles.section}>
                <p className={styles.sectionNumber} aria-hidden="true">04 / The reading behind the round</p>
                <h2>Sources &amp; checks</h2>
                <p className={styles.note}>Sources for this course guide and its monthly notes. Check dates describe when a source was reviewed, not a weather observation or a promise that visitor rules remain unchanged.</p>
                <ul className={styles.sourceList} data-golf-guide-sources>
                  {sources.map(source => (
                    <li key={source.id} id={`source-${source.id}`} tabIndex={-1}>
                      <a href={source.url} rel="noreferrer" data-golf-source>{source.title} <span aria-hidden="true">↗</span></a>
                      <p>{source.publisher} · Source checked <time dateTime={source.checkedAt}>{source.checkedAt}</time></p>
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          </div>

          <section className={styles.destination} aria-labelledby="destination-logistics-heading">
            <div>
              <p className={styles.eyebrow}>Beyond the course</p>
              <h2 id="destination-logistics-heading">Destination logistics</h2>
              <p>For the wider trip, use our {destination.title} destination guide. It covers the destination or travel gateway, not the course itself; confirm your onward journey to {course.city} separately.</p>
            </div>
            <Link href={`/guides/${destination.slug}`} className={styles.destinationLink}>{destination.title} destination logistics <span aria-hidden="true">↗</span></Link>
          </section>
          <Link className={styles.backLink} href="/golf"><span aria-hidden="true">←</span> Back to the golf month finder</Link>
        </div>
      </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <BrandLogo appearance="cinematic" />
          <p>Goldilocks Zone by Lost Luggage Legend.<br />Course field notes. A little timing, a better starting point.</p>
          <nav aria-label="Course guide footer">
            <Link href="/golf">Golf month finder</Link>
            <Link href="/guides">Destination guides</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
          </nav>
          <p className={styles.disclosure}>Editorial inspiration, not a forecast or a tee-time booking service. We may earn commissions from deliberate booking links, at no extra cost to you.</p>
        </div>
      </footer>
    </div>
  )
}
