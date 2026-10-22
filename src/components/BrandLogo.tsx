import Image from 'next/image'
import Link from 'next/link'
import styles from './BrandLogo.module.css'

/** One shared identity for the photographic homepage and regular-page header. */
export function BrandLogo({ appearance = 'default' }: { appearance?: 'default' | 'cinematic' }) {
  return (
    <Link href="/" className={styles.logo} data-brand-logo data-appearance={appearance}
      aria-label="Lost Luggage Legend — home" title="Lost Luggage Legend · Goldilocks Zone">
      <Image className={styles.mark} src="/brand/goldilocks-mark.svg" width={48} height={48}
        alt="" aria-hidden="true" unoptimized />
      <span className={styles.wordmark} data-brand-wordmark>
        <span className={styles.name} data-brand-name>Lost Luggage</span>
        <span className={styles.signature}>
          <span className={styles.legend} data-brand-parent>Legend</span>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.descriptor} data-brand-descriptor>Goldilocks Zone</span>
        </span>
      </span>
    </Link>
  )
}
