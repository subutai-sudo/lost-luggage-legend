'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { GolfReason } from '@/components/GolfReason'
import {
  discoveryImage, getGolfMonthPreviews, getGolfMonthSelection, MONTH_NAMES, readGolfMonth,
  type GolfCourse, type GolfDisplayCatalog,
} from '@/lib/golfDiscovery'
import styles from './GolfZone.module.css'

/** A course plus the destination guide it belongs to, for photography and links. */
export interface GolfZoneCourse extends GolfCourse {
  destinationTitle: string
  destinationSlug: string
  image: string
}

interface Props {
  courses: GolfZoneCourse[]
  initialMonth: number
  catalog: GolfDisplayCatalog
}

// Derived from the real month-band layout: 3 columns at <=639px (5% gutters,
// 6px gaps), 4 columns below 960px and 6 columns above (4.4% gutters). Above
// ~1474px the band stops growing because its container caps at 1344px.
const MONTH_TILE_SIZES = '(max-width: 639px) calc((90vw - 12px) / 3), (max-width: 959px) calc((91.2vw - 18px) / 4), (min-width: 1474px) 219px, calc((91.2vw - 30px) / 6)'
// Results have 4.4% outer gutters AND inner width deductions on phone/tablet.
// Include the 1.03 hover scale so the decoded image covers its painted size.
const CARD_SIZES = '(max-width: 639px) calc(93.936vw - 41.2px), (max-width: 959px) calc(46.968vw - 45.32px), (min-width: 1474px) 442.22px, calc(31.312vw - 19.227px)'

export function GolfZone({ courses, initialMonth, catalog }: Props) {
  const [month, setMonth] = useState(initialMonth)
  const [ready, setReady] = useState(false)
  const { featured, shortlist } = useMemo(() => getGolfMonthSelection(courses, month), [courses, month])
  const previews = useMemo(() => getGolfMonthPreviews(courses), [courses])

  useEffect(() => {
    const synchronize = () => {
      setMonth(readGolfMonth(window.location.search, new Date().getMonth() + 1))
      setReady(true)
    }
    synchronize()
    window.addEventListener('popstate', synchronize)
    return () => window.removeEventListener('popstate', synchronize)
  }, [])

  function chooseMonth(next: number) {
    setMonth(next)
    const url = new URL(window.location.href)
    url.searchParams.set('month', String(next))
    url.hash = ''
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`)
  }

  return (
    <div className={styles.root} data-golf-zone data-ready={ready}>
      <a className={styles.skip} href="#month-picker">Skip to month picker</a>
      <main id="main-content">
        <section className={styles.hero} data-golf-hero aria-label="Golf Goldilocks Zone course finder">
          <Image
            key={featured.id}
            className={styles.heroImage}
            data-golf-hero-image
            src={discoveryImage(featured.image, 1600)}
            alt={`${featured.destinationTitle} — destination photograph`}
            fill
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.navigation}>
              <Navbar appearance="cinematic" brandAppearance="cinematic" />
            </div>
            <div className={styles.heroStory}>
              <p className={styles.eyebrow}>Golf Goldilocks Zone</p>
              <h1 className={styles.heroTitle}>The right course, at the right time.</h1>
              <p className={styles.heroLead}>
                Pick a month and see six courses worth playing then — each with the reason it suits that
                month, the trade-off to expect, and the checks behind it. An editorial starting point,
                never a ranking or a green-fee quote. Photos show destinations, not courses.
              </p>
              <p className={styles.heroCta}>
                <a href="#month-picker">Choose your month <span aria-hidden="true">↓</span></a>
              </p>
            </div>
            <div className={styles.heroFoot}>
              <span>{MONTH_NAMES[month - 1]} · {featured.name}</span>
              <Link href={`/guides/${featured.destinationSlug}`}>
                Read the {featured.destinationTitle} guide <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.calendar} aria-labelledby="month-picker">
          <div className={styles.calendarInner}>
            <div className={styles.calendarHead}>
              <div>
                <p className={styles.eyebrow}>When could you play?</p>
                <h2 className={styles.calendarTitle} id="month-picker" tabIndex={-1}>When could you play?</h2>
              </div>
              <p className={styles.calendarNote}>
                Editorial course windows. Not live conditions, green fees or availability.
              </p>
            </div>
            <div className={styles.months} role="group" aria-label="Choose your golf month">
              {previews.map((course, index) => (
                <button
                  key={course.id}
                  type="button"
                  data-golf-month={index + 1}
                  aria-pressed={month === index + 1}
                  aria-label={MONTH_NAMES[index]}
                  aria-description={`Preview course: ${course.name}, ${course.city}`}
                  aria-controls="golf-results"
                  onClick={() => chooseMonth(index + 1)}
                  className={styles.month}
                >
                  <Image
                    className={styles.monthImage}
                    src={discoveryImage(course.image, 480)}
                    alt=""
                    fill
                    sizes={MONTH_TILE_SIZES}
                    loading="lazy"
                  />
                  <span className={styles.monthNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.monthName} aria-hidden="true">{MONTH_NAMES[index]}</span>
                  <span className={styles.monthPlace} aria-hidden="true">{course.city}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.results} id="golf-results" aria-labelledby="golf-results-title">
          <div className={styles.resultsInner}>
            <div className={styles.resultsHead}>
              <div>
                <p className={styles.eyebrow}>Your course shortlist</p>
                <h2 className={styles.resultsTitle} id="golf-results-title">
                  {MONTH_NAMES[month - 1]}, six courses worth the trip.
                </h2>
                <p className={styles.resultsMeta}>
                  Featured course: {featured.name}. Six editorial picks covering{' '}
                  {new Set(shortlist.map(course => course.country)).size} countries.
                </p>
              </div>
              <p className={styles.calendarNote}>A starting point, not a ranking.</p>
            </div>

            <div className={styles.cards}>
              {shortlist.map(course => (
                <article key={course.id} className={styles.card} data-golf-card={course.id}>
                  <Link href={`/guides/${course.destinationSlug}`} className={styles.cardFigure} aria-label={`Explore the ${course.destinationTitle} guide`}>
                    <Image
                      className={styles.cardImage}
                      src={discoveryImage(course.image, 640)}
                      alt={`${course.destinationTitle} — destination photograph`}
                      fill
                      sizes={CARD_SIZES}
                      loading="lazy"
                    />
                    <span className={styles.figureLabel} aria-hidden="true">{course.destinationTitle}</span>
                  </Link>
                  <div className={styles.cardBody}>
                    <p className={styles.cardCharacter}>{course.character}</p>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/guides/${course.destinationSlug}`}>{course.name}</Link>
                    </h3>
                    <p className={styles.cardPlace}>{course.city}, {course.country}</p>
                    <GolfReason catalog={catalog} courseId={course.id} courseName={course.name} month={month} />
                    <p className={styles.cardLinks}>
                      <Link href={`/guides/${course.destinationSlug}`}>
                        Read the {course.destinationTitle} guide <span aria-hidden="true">↗</span>
                      </Link>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <p className={styles['sr-only']} role="status" aria-live="polite" aria-atomic="true">
              {MONTH_NAMES[month - 1]}: showing six editorial golf picks. Featured course: {featured.name}.
            </p>

            <div className={styles.notice}>
              <p>
                <strong>How this works.</strong> These are editorial course choices for the month, drawn
                from verifiable courses near the destinations we already guide. Course conditions, opening
                dates, visitor policies and green fees change — check with the club or a current
                directory before you travel, and treat every reason here as typical seasonal guidance
                rather than a forecast.
              </p>
              <p><Link href="/guides">Browse the destination guides <span aria-hidden="true">↗</span></Link></p>
            </div>

            <section className={styles.notice} aria-labelledby="golf-newsletter-heading">
              <h2 id="golf-newsletter-heading">A little wander, and a little golf.</h2>
              <NewsletterSignup compact />
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}
