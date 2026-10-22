import Image from 'next/image'
import Link from 'next/link'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { GuideShell } from '@/components/guides/GuideShell'
import { getGoldilockMonthsLabel } from '@/lib/seasonalHelpers'
import { pageMetadata } from '@/lib/site'
import styles from './GuideIndex.module.css'

export const metadata = pageMetadata({
  title: 'All Destination Guides',
  description: 'Browse 100+ expert destination guides with honest price comparisons. Find your next trip — from Bangkok to Barcelona, Maldives to Marrakech.',
  path: '/guides',
})

export default function GuidesPage() {
  const sorted = [...DESTINATION_GUIDES].sort((a, b) => a.title.localeCompare(b.title))
  const hero = sorted.find(guide => guide.id === 'lisbon') ?? sorted[0]
  if (!hero) throw new Error('Guide directory requires a destination inventory')
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const grouped = new Map<string, typeof sorted>()
  for (const guide of sorted) {
    const letter = guide.title[0].toUpperCase()
    const group = grouped.get(letter) ?? []
    group.push(guide)
    grouped.set(letter, group)
  }

  return (
    <GuideShell>
      <header className={styles.hero} data-guide-hero>
        <Image src={hero.heroImage} alt={`${hero.title} — destination photograph`} fill priority
          sizes="100vw" className={styles.heroImage} data-guide-hero-image />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>The Goldilocks collection</p>
          <h1>Destination{' '}<br /><em>guides.</em></h1>
          <p className={styles.heroCopy}>A month sparks the idea.<br />A place makes the story.</p>
          <Link className={styles.heroLink} href="#guide-main">Browse {sorted.length} destinations <span aria-hidden="true">↓</span></Link>
        </div>
        <div className={styles.caption}>
          <span>In the frame</span>
          <Link href={`/guides/${hero.slug}`}><strong>{hero.title}</strong><span>{hero.subtitle}</span></Link>
        </div>
      </header>

      <main id="guide-main" className={styles.main} data-guide-directory>
        <section className={styles.indexIntro} aria-labelledby="directory-title">
          <div><p className={styles.smallLabel}>Your next chapter</p><h2 id="directory-title">A world to look<br /><em>closer at.</em></h2></div>
          <p className={styles.indexCopy}>Explore {sorted.length} destination guides, from neighbourhood ideas to seasonal context and practical planning. Start with a place—or <Link href="/">let the calendar lead ↗</Link>.</p>
        </section>
        <nav className={styles.alphabet} aria-label="Browse guides by letter">
          {letters.map(letter => grouped.has(letter)
            ? <a key={letter} href={`#letter-${letter}`}>{letter}</a>
            : <span key={letter} aria-disabled="true">{letter}</span>)}
        </nav>
        {letters.map(letter => {
          const guides = grouped.get(letter)
          if (!guides) return null
          return (
            <section key={letter} id={`letter-${letter}`} className={styles.letterSection} aria-labelledby={`heading-${letter}`}>
              <div className={styles.letterHeading}><h2 id={`heading-${letter}`}>{letter}</h2><span>{String(guides.length).padStart(2, '0')} {guides.length === 1 ? 'guide' : 'guides'}</span></div>
              <div className={styles.grid}>
                {guides.map(guide => (
                  <Link key={guide.id} href={`/guides/${guide.slug}`} className={styles.card}
                    data-guide-card={guide.id} aria-label={`Read the ${guide.title} guide`}>
                    <span className={styles.cardImage}>
                      <Image src={guide.heroImage} alt={guide.title} fill
                        sizes="(max-width: 380px) 86px, (max-width: 700px) 104px, 110px" />
                    </span>
                    <div className={styles.cardText}>
                      <span className={styles.region}>{guide.subtitle}</span>
                      <h3>{guide.title}</h3>
                      <span className={styles.window} data-guide-window>{getGoldilockMonthsLabel(guide.id)} <span>· editorial window</span></span>
                      <span className={styles.cardEnd}>{guide.theme}<span aria-hidden="true">↗</span></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
        <p className={styles.editorialNote}>Month windows are editorial starting points, not live forecasts or guarantees of weather, crowds or prices. Confirm details for your own travel dates.</p>
        <section id="newsletter" className={styles.newsletter} aria-labelledby="guide-newsletter-title">
          <div><p className={styles.smallLabel}>A little inspiration, later</p><h2 id="guide-newsletter-title">Keep a little wander<br /><em>in your inbox.</em></h2><p>Destination stories and seasonal inspiration. Subscribe if you&apos;d like to hear from us.</p></div>
          <NewsletterSignup compact />
        </section>
      </main>
    </GuideShell>
  )
}
