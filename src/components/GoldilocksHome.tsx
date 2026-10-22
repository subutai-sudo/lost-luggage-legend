'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { SeasonalReason } from '@/components/SeasonalReason'
import seasonalReasons from '@/data/seasonalReasons.json'
import { discoveryImage, getMonthPreviews, getMonthSelection, MONTH_NAMES, readTravelMonth, type GoldilocksDestination } from '@/lib/goldilocksDiscovery'
import styles from './GoldilocksHome.module.css'

interface Props { guides: GoldilocksDestination[]; initialMonth: number; year: number }

export function GoldilocksHome({ guides, initialMonth, year }: Props) {
  const [month, setMonth] = useState(initialMonth)
  const [ready, setReady] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const approachButton = useRef<HTMLButtonElement>(null)
  const { featured, shortlist, total } = useMemo(() => getMonthSelection(guides, month), [guides, month])
  const previews = useMemo(() => getMonthPreviews(guides), [guides])

  useEffect(() => {
    const synchronize = () => {
      // Preserve incoming links made before booking search moved downstream.
      if (window.location.hash === '#compare-prices') {
        window.location.replace('/plan#compare-prices')
        return
      }
      setMonth(readTravelMonth(window.location.search, new Date().getMonth() + 1))
      setReady(true)
    }
    synchronize()
    window.addEventListener('popstate', synchronize)
    window.addEventListener('hashchange', synchronize)
    // Long-lived tabs roll over only when no explicit month was selected.
    const timer = window.setInterval(synchronize, 60_000)
    return () => {
      window.removeEventListener('popstate', synchronize)
      window.removeEventListener('hashchange', synchronize)
      window.clearInterval(timer)
    }
  }, [])

  function chooseMonth(next: number) {
    setMonth(next)
    const url = new URL(window.location.href)
    url.searchParams.set('month', String(next))
    url.hash = ''
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`)
  }

  return (
    <div className={styles.root} data-goldilocks-home data-ready={ready}>
      <a className={styles.skip} href="#month-picker">Skip to month picker</a>
      <main id="main-content">
        <section id="goldilock" data-hero-scene className={styles.hero} aria-label="Goldilocks Zone seasonal destination finder">
          <Image key={featured.id} className={styles['hero-image']} data-hero-image
            src={discoveryImage(featured.image, 1600)} alt={`${featured.title} — destination photograph`}
            fill sizes="100vw" fetchPriority="high" loading="eager" />
          <div className={styles.navigation}><Navbar appearance="cinematic" /></div>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Goldilocks Zone</p>
            <h1>Somewhere,<br /><em>just right.</em></h1>
            <p className={styles['intro-copy']}>The world changes with the calendar.<br />Pick your month. Find six places<br />worth a closer look.</p>
            <a className={styles.monthJump} href="#month-picker">Choose your month <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles['frame-caption']}>
            <span className={styles.label}>In the frame · {MONTH_NAMES[month - 1]}</span>
            <Link href={`/guides/${featured.slug}`} data-feature-link>
              <strong data-feature-title>{featured.title}</strong>
              <span>{featured.subtitle}</span>
              <span aria-hidden="true">Explore the guide ↗</span>
            </Link>
          </div>
        </section>
        <div className={styles.calendarBand} data-calendar-band>
          <section className={styles.calendar} aria-labelledby="month-picker">
            <div className={styles['calendar-label']}>
              <h2 id="month-picker" tabIndex={-1}>When could you go?</h2>
              <p>A month. A different perspective.</p>
            </div>
            <div className={styles.months} role="group" aria-label="Choose your travel month">
              {previews.map((guide, index) => (
                <button key={guide.id} type="button" data-month={index + 1} data-preview-id={guide.id}
                  aria-label={MONTH_NAMES[index]} aria-description={`Preview destination: ${guide.title}`}
                  aria-pressed={month === index + 1} aria-controls="seasonal-results"
                  title={`${MONTH_NAMES[index]} · ${guide.title}`} onClick={() => chooseMonth(index + 1)}>
                  <Image src={discoveryImage(guide.image, 480)} alt="" fill
                    sizes="(max-width: 700px) 33vw, 17vw" loading="eager" />
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles['month-name']} aria-hidden="true">{MONTH_NAMES[index]}</span>
                  <span className={styles['month-place']} aria-hidden="true">{guide.title}</span>
                </button>
              ))}
            </div>
            <div className={styles['calendar-foot']}>
              <span>Editorial month windows. Not live travel conditions.</span>
              <button ref={approachButton} className={styles['approach-link']} type="button" data-method
                onClick={() => dialog.current?.showModal()}>Our approach ↗</button>
            </div>
            <noscript><p className={styles['calendar-foot']}>Month selection needs JavaScript. <a href="/guides">Browse all destination guides instead ↗</a></p></noscript>
          </section>
        </div>

        <section className={styles.below} id="seasonal-results" aria-labelledby="results-title">
          <div className={styles['results-heading']}>
            <div><p className={styles.eyebrow}>Your seasonal shortlist</p>
              <h2 id="results-title"><em data-selected-month>{MONTH_NAMES[month - 1]}</em>,<br />six ways to go.</h2>
            </div>
            <div className={styles['results-meta']}><p><strong>Six selections</strong> from <strong data-count>{total}</strong> matching guides.</p><p>A starting point, not a ranking.</p></div>
          </div>
          <div className={styles.results} data-results>
            {shortlist.map(guide => (
              <article className={styles.guide} key={guide.id} data-id={guide.id}>
                <Link className={styles['image-link']} href={`/guides/${guide.slug}`} aria-label={`Explore ${guide.title} guide`}>
                  <Image src={discoveryImage(guide.image, 800)} alt={`${guide.title} — destination photograph`}
                    fill sizes="(max-width: 380px) 90vw, (max-width: 700px) 44vw, 30vw" />
                </Link>
                <p className={styles['guide-tag']}>{guide.subtitle}</p>
                <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                <SeasonalReason catalog={seasonalReasons} destinationId={guide.id} title={guide.title}
                  month={month} fallbackExcerpt={guide.excerpt} />
                <Link className={styles['read-guide']} href={`/guides/${guide.slug}`} aria-label={`Read the ${guide.title} guide`}>Read the guide <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
          <p className={styles['sr-only']} role="status" aria-live="polite" aria-atomic="true">
            {ready && `${MONTH_NAMES[month - 1]}: showing six of ${total} matching editorial guides. Featured destination: ${featured.title}.`}
          </p>
          <div className={styles['index-links']}>
            <Link href="/guides">All destination guides ↗</Link>
            <Link href="/explore">Explore the optional map ↗</Link>
          </div>
          <div className={styles['source-note']}>
            <p><strong>Inspiration, not a forecast.</strong> Our editorial month windows are a starting point, not independent measurements of weather, crowds or prices. Some include peak season. Cards link to the published seasonal guidance behind each reason and trade-off. Check the destination guide and current conditions before planning.</p>
            <span className={styles['small-wordmark']}>A little timing. A lot of possibility.</span>
          </div>
          <section className={styles.newsletter} id="newsletter" aria-labelledby="newsletter-title">
            <div><p className={styles.eyebrow}>A little inspiration, later</p><h2 id="newsletter-title">Keep a little wander in your inbox.</h2><p>Destination stories and seasonal inspiration. Subscribe if you&apos;d like to hear from us.</p></div>
            <NewsletterSignup compact />
          </section>
        </section>
      </main>
      <footer className={styles.footer}>
        <div><p>LOST LUGGAGE LEGEND / GOLDILOCKS ZONE</p><p>© {year} Lost Luggage Legend.</p></div>
        <p className={styles.endline}>Travel by the calendar. Stay curious.</p>
        <nav aria-label="Footer"><Link href="/guides">All Guides</Link><Link href="/plan">Plan your trip</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/affiliate-disclosure">Affiliate disclosure</Link></nav>
        <p>We may earn commissions from deliberate booking links, at no extra cost to you.</p>
      </footer>
      <dialog ref={dialog} className={styles.methodDialog} aria-labelledby="method-title"
        onClose={() => approachButton.current?.focus()}
        onClick={event => {
          if (event.target !== dialog.current) return
          const rect = event.currentTarget.getBoundingClientRect()
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close()
        }}>
        <div className={styles['dialog-content']}>
          <div className={styles['dialog-top']}><p className={styles.eyebrow}>Behind the shortlist</p><button className={styles.close} type="button" data-close aria-label="Close approach dialog" onClick={() => dialog.current?.close()}>×</button></div>
          <h2 id="method-title">A calendar for curiosity.<br />Not a crystal ball.</h2>
          <p>Goldilocks Zone starts with one question: when would you like to travel? We filter our destination guides by their editorial recommended months and present six places to explore.</p>
          <p>The featured destination and display order are editorial choices, not numerical rankings. The count includes every matching guide; the shortlist is intentionally smaller.</p>
          <p>Each card explains typical seasonal appeal and a trade-off for the selected month, with links to tourism guidance, climate references or destination specialists. A source check date records when guidance was reviewed—not when its climate observations were measured. Seasonal patterns, holidays and wildlife timing can vary from year to year.</p>
          <p className={styles.disclaimer}>These windows do not independently validate weather, crowd levels or prices. Some may include peak season. No live forecasts, comparative scores, savings guarantees or crowd feeds are used here.</p>
          <p>Photographs illustrate destinations, not conditions for a particular month. Confirm local holidays, entry requirements, conditions and costs before making plans.</p>
        </div>
      </dialog>
    </div>
  )
}
