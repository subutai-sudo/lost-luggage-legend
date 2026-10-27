import 'server-only'
import character from '../data/golfCourseCharacter.json'
import { GOLF_COURSES } from '../data/golfCourses'

/**
 * Reader-facing, course-specific character lines. Each phrase paraphrases the
 * course's own sourced guide record; none of it is derived from the photograph,
 * the season, current conditions or visitor policy.
 */
const INTERNAL_COPY = /\b(?:our|the)?\s*(?:review|verification|research|audit)\b|\breviewed\b|\bverified\b|\bretrieved\b|\bscreenshot\b|\bevidence\b|HTTP\s*\d{3}|\bplaceholder\b/i
// Generic travel-marketing adjectives do not describe a specific course. The
// course's own sourced record is the only acceptable basis for this line.
const GENERIC_COPY = /\b(?:unforgettable|perfect|world-?class|hidden gem|must-?play|must-?see|paradise|breathtaking|stunning|iconic|award-?winning|bucket-?list|top-?rated|best-?in-?class|simply)\b|^worth (?:playing|a (?:visit|round))\b/i

export function getGolfCourseCharacter(records: Record<string, string> = character): Record<string, string> {
  const ids = GOLF_COURSES.map(course => course.id)
  const keys = Object.keys(records)
  if (keys.length !== ids.length || new Set(keys).size !== keys.length) throw new Error('Golf character copy must cover every course exactly once')
  for (const id of ids) {
    const phrase = records[id]
    if (typeof phrase !== 'string') throw new Error(`Missing golf character copy for ${id}`)
    const value = phrase.trim()
    if (value !== phrase || value.length < 24 || value.length > 72) throw new Error(`Golf character copy for ${id} must be a trimmed 24–72 character phrase`)
    if (/[<>\u0000-\u0008]|https?:|www\.|@/.test(value)) throw new Error(`Golf character copy for ${id} contains non-copy characters`)
    if (INTERNAL_COPY.test(value)) throw new Error(`Golf character copy for ${id} contains internal verification language`)
    if (GENERIC_COPY.test(value)) throw new Error(`Golf character copy for ${id} is generic marketing copy, not a course-specific description`)
  }
  return records
}
