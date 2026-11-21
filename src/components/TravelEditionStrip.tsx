import { AviationMark } from '@/components/AviationMark'
import styles from './TravelEditionStrip.module.css'

/** Editorial travel identity, not a flight schedule or booking status. */
export function TravelEditionStrip() {
  return (
    <div className={styles.strip} data-travel-edition-strip>
      <AviationMark className={styles.mark} />
      <p className={styles.label}>The travel edition <span>Goldilocks Zone</span></p>
      <p className={styles.motto}>A month. A place. A different perspective.</p>
    </div>
  )
}
