import type { ReactNode } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BrandLogo } from '@/components/BrandLogo'
import styles from './GuideTheme.module.css'

/** Guide-only visual scope: homepage/planning surfaces keep their own tokens. */
export function GuideShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root} data-guide-theme>
      <a className={styles.skip} href="#guide-main">Skip to guide content</a>
      <div className={styles.navigation}>
        <Navbar brandAppearance="cinematic" />
      </div>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <BrandLogo appearance="cinematic" />
          <p>A little timing.<br /><em>A lot of possibility.</em></p>
        </div>
        <div className={styles.footerBottom}>
          <p>Goldilocks Zone by Lost Luggage Legend.<br />Editorial inspiration, not a forecast.</p>
          <nav aria-label="Guide footer">
            <Link href="/">Choose a month</Link>
            <Link href="/guides">All guides</Link>
            <Link href="/plan">Plan your trip</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
          </nav>
        </div>
        <p className={styles.disclosure}>We may earn commissions from deliberate booking links, at no extra cost to you.</p>
      </footer>
    </div>
  )
}
