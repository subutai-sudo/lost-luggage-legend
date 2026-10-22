import { getSeasonalReason, type SeasonalCatalog } from '@/lib/seasonalReasons'
import { MONTH_NAMES } from '@/lib/goldilocksDiscovery'
import styles from './SeasonalReason.module.css'

interface Props {
  catalog: SeasonalCatalog
  destinationId: string
  title: string
  month: number
  fallbackExcerpt: string
}

/** Typical seasonal context, not a live forecast or a numerical travel score. */
export function SeasonalReason({ catalog, destinationId, title, month, fallbackExcerpt }: Props) {
  const note = getSeasonalReason(catalog, destinationId, month)
  if (!note) return (
    <div className={styles.note} data-seasonal-pending>
      <p className={styles.reason}>{fallbackExcerpt}</p>
      <p className={styles.tradeoff}>Seasonal context under review.</p>
    </div>
  )
  return (
    <div className={styles.note} data-seasonal-note data-seasonal-month={month} data-destination={destinationId}>
      <p className={styles.label}>Why this month?</p>
      <p className={styles.reason} data-seasonal-why>{note.why}</p>
      <p className={styles.tradeoff}><strong>Keep in mind</strong> <span data-seasonal-tradeoff>{note.tradeoff}</span></p>
      <details key={`${destinationId}:${month}`} className={styles.sources}>
        <summary aria-label={`Seasonal sources for ${title} in ${MONTH_NAMES[month - 1]}`}>
          Sources &amp; checks <span className={styles.indicator} aria-hidden="true">+</span>
        </summary>
        <div className={styles.sourceContent}>
          <p className={styles.scope}>Typical seasonal guidance—not a forecast or a guarantee of conditions.</p>
          <ul role="list">
            {note.sources.map(source => (
              <li key={source.id}>
                <a href={source.url} rel="noreferrer" data-seasonal-source>{source.title} <span aria-hidden="true">↗</span></a>
                <p>{source.publisher} · Source checked <time dateTime={source.checkedAt}>{source.checkedAt}</time></p>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}
