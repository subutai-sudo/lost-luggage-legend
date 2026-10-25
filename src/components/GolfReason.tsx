import { getGolfReason, type GolfDisplayCatalog } from '@/lib/golfDiscovery'
import { MONTH_NAMES } from '@/lib/goldilocksDiscovery'
import styles from './GolfReason.module.css'

interface Props {
  catalog: GolfDisplayCatalog
  courseId: string
  courseName: string
  month: number
}

/**
 * Month-specific golf context with its honest trade-off and cited checks.
 * Deliberately not a forecast, a ranking or a price.
 */
export function GolfReason({ catalog, courseId, courseName, month }: Props) {
  const note = getGolfReason(catalog, courseId, month)
  return (
    <div className={styles.note} data-golf-reason data-golf-month={month} data-golf-course={courseId}>
      <p className={styles.label}>Why play here in {MONTH_NAMES[month - 1]}?</p>
      <p className={styles.reason} data-golf-why>{note.why}</p>
      <p className={styles.tradeoff}><strong>Keep in mind</strong> <span data-golf-tradeoff>{note.tradeoff}</span></p>
      <details key={`${courseId}:${month}`} className={styles.sources}>
        <summary aria-label={`Sources & checks for ${courseName} in ${MONTH_NAMES[month - 1]}`}>
          Sources &amp; checks <span className={styles.indicator} aria-hidden="true">+</span>
        </summary>
        <div className={styles.sourceContent}>
          <p className={styles.scope}>Editorial seasonal guidance and reported course information — not a forecast, a green-fee quote or a guarantee that a course is open.</p>
          <ul role="list">
            {note.sources.map(source => (
              <li key={source.id}>
                <a href={source.url} rel="noreferrer" data-golf-source>{source.title} <span aria-hidden="true">↗</span></a>
                <p>{source.publisher} · Source checked <time dateTime={source.checkedAt}>{source.checkedAt}</time></p>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}
