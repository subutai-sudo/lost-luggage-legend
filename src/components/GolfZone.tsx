'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { GolfReason } from '@/components/GolfReason'
import { GOLF_OPERATIONAL_NOTICES } from '@/data/golfOperationalNotices'
import {
  discoveryImage, getGolfMonthPreviews, getGolfMonthSelection, MONTH_NAMES, readGolfMonth,
  type GolfCourse, type GolfDisplayCatalog,
} from '@/lib/golfDiscovery'
import type { GolfFinderMedia } from '@/lib/golfFinderMedia'
import styles from './GolfZone.module.css'

/** Course-specific media and a clearly distinct destination fallback. */
export interface GolfZoneCourse extends GolfCourse {
  destinationTitle: string
  destinationSlug: string
  image: string
  media: GolfFinderMedia
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

function finderImage(course: GolfZoneCourse, width: number) {
  return course.media.photo?.src ?? discoveryImage(course.image, width)
}
function photoKind(course: GolfZoneCourse) {
  return course.media.photo ? 'Course photograph' : 'Destination photograph'
}
function photoAlt(course: GolfZoneCourse) {
  return course.media.photo?.alt ?? `${course.destinationTitle} — destination photograph, not the course`
}
function PhotoCredit({ course }: { course: GolfZoneCourse }) {
  const photo = course.media.photo
  return photo ? (
    <span className={styles.photoCredit}>
      {photo.author} · <a href={photo.sourcePage} rel="noreferrer">Photo source</a> ·{' '}
      <a href={photo.licenseUrl} rel="noreferrer">{photo.license}</a>
    </span>
  ) : null
}
function visualsLabel(course: GolfZoneCourse) {
  const { hasRoutingDiagram, layoutKind, photoCount, gallery } = course.media
  const resources = [
    hasRoutingDiagram && 'routing diagram',
    layoutKind && { 'routing-map': 'published map', 'hole-tour': 'published hole tour', scorecard: 'published scorecard' }[layoutKind],
    photoCount > 0 && 'course photos',
    gallery && 'gallery link',
  ].filter(Boolean)
  return `Course visuals: ${resources.join(' · ')}`
}

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
            src={finderImage(featured, 1600)}
            alt={photoAlt(featured)}
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
                never a ranking or a green-fee quote. Course photos where available; otherwise,
                clearly labelled destination views — not the course.
              </p>
              <p className={styles.heroCta}>
                <a href="#month-picker">Choose your month <span aria-hidden="true">↓</span></a>
              </p>
            </div>
            <div className={styles.heroPhotoNote} data-golf-hero-credit>
              <span>{photoKind(featured)}{!featured.media.photo && ` · ${featured.destinationTitle}, not the course`}</span>
              <PhotoCredit course={featured} />
            </div>
            <div className={styles.heroFoot}>
              <span>{MONTH_NAMES[month - 1]} · {featured.name}</span>
              <Link href={`/golf/${featured.id}`}>
                Read the {featured.name} golf guide <span aria-hidden="true">↗</span>
              </Link>
              <a href={`/golf/${featured.id}#course-visuals`}>Explore course visuals <span aria-hidden="true">↗</span></a>
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
                  aria-description={`Preview course: ${course.name}, ${course.city}. ${photoKind(course)}${course.media.photo ? '' : ', not the course'}. Credits in Month-preview photographs below.`}
                  aria-controls="golf-results"
                  onClick={() => chooseMonth(index + 1)}
                  className={styles.month}
                >
                  <Image
                    className={styles.monthImage}
                    src={finderImage(course, 480)}
                    alt=""
                    fill
                    sizes={MONTH_TILE_SIZES}
                    loading="lazy"
                  />
                  <span className={styles.monthNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.monthName} aria-hidden="true">{MONTH_NAMES[index]}</span>
                  <span className={styles.monthPlace} aria-hidden="true">{course.city}</span>
                  <span className={styles.monthPhotoKind} data-golf-preview-kind>{course.media.photo ? 'Course photo' : 'Destination view'}</span>
                </button>
              ))}
            </div>
            <details className={styles.previewCredits} data-golf-preview-credits>
              <summary>Month-preview photographs &amp; credits</summary>
              <p>Course photographs where available. Destination photographs show the named destination, not the course.</p>
              <ul>
                {previews.map((course, index) => (
                  <li key={course.id} data-golf-preview-credit={index + 1}>
                    <span>{MONTH_NAMES[index]} · {course.name} — {photoKind(course)}{!course.media.photo && ` · ${course.destinationTitle}`}</span>
                    <PhotoCredit course={course} />
                  </li>
                ))}
              </ul>
            </details>
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
                  <Link href={`/golf/${course.id}`} className={styles.cardFigure} aria-label={`Explore the ${course.name} golf guide`}>
                    <Image
                      className={styles.cardImage}
                      src={finderImage(course, 640)}
                      alt={photoAlt(course)}
                      fill
                      sizes={CARD_SIZES}
                      loading="lazy"
                    />
                    <span className={styles.figureLabel} data-golf-photo-kind>{photoKind(course)}</span>
                  </Link>
                  <div className={styles.cardPhotoNote} data-golf-photo-credit>
                    {course.media.photo ? <PhotoCredit course={course} /> : `${course.destinationTitle}, not the course.`}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardCharacter}>{course.character}</p>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/golf/${course.id}`}>{course.name}</Link>
                    </h3>
                    <p className={styles.cardPlace}>{course.city}, {course.country}</p>
                    {GOLF_OPERATIONAL_NOTICES[course.id] && (
                      <p data-golf-operational-notice>
                        <strong>Before planning a round:</strong> {GOLF_OPERATIONAL_NOTICES[course.id].text}{' '}
                        <a href={GOLF_OPERATIONAL_NOTICES[course.id].url} rel="noreferrer">{GOLF_OPERATIONAL_NOTICES[course.id].label} ↗</a>
                      </p>
                    )}
                    <GolfReason catalog={catalog} courseId={course.id} courseName={course.name} month={month} />
                    <p className={styles.cardLinks}>
                      <Link href={`/golf/${course.id}`}>
                        Read the {course.name} golf guide <span aria-hidden="true">↗</span>
                      </Link>
                      <a href={`/golf/${course.id}#course-visuals`}>{visualsLabel(course)} <span aria-hidden="true">↗</span></a>
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
              <p>Choose a course above for its golf guide. For the rest of your trip, <Link href="/guides">browse destination logistics <span aria-hidden="true">↗</span></Link>.</p>
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
