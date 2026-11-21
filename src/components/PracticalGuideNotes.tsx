import { getPracticalGuideNotes } from '@/data/practicalGuideNotes'
import styles from './PracticalGuideNotes.module.css'

export function PracticalGuideNotes({ guideId }: { guideId: string }) {
  const note = getPracticalGuideNotes(guideId)
  if (!note) return null

  return (
    <section
      id="practical-field-notes"
      tabIndex={-1}
      className={styles.notes}
      aria-labelledby="practical-field-notes-heading"
      data-practical-guide-notes
      data-practical-guide-id={guideId}
    >
      <p className={styles.eyebrow}>A more considered visit</p>
      <h2 id="practical-field-notes-heading">Practical field notes</h2>
      {note.sections.map((section) => (
        <div key={section.kind} className={styles.note}>
          <h3>{section.title}</h3>
          <p>{section.body}</p>
        </div>
      ))}
      <details className={styles.sources}>
        <summary>Sources &amp; checks</summary>
        <p>Sources for these practical notes. Check the operator’s current conditions before committing to a booking.</p>
        <ul>
          {note.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url}>{source.label}</a>
              <span>Checked on <time dateTime={source.checkedOn}>{source.checkedOn}</time></span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
