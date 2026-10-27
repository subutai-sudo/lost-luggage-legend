import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// Independent authored expectations: never infer an approved header from the
// mutable production media map, and never regenerate the published baseline.
const baselineBytes = readFileSync(new URL('../fixtures/golf-guide-header-baseline.json', import.meta.url))
assert.equal(createHash('sha256').update(baselineBytes).digest('hex'), 'd146e2d3ee2a0bb80bdcd256fcbd1a2d5bde0c3775ad6ab08278c9a24b7b806a')
export const baseline = JSON.parse(baselineBytes)
export const releaseApproval = JSON.parse(readFileSync(new URL('../fixtures/golf-navigation-photo-release-approved-changes.json', import.meta.url), 'utf8'))
export const approvedHeaderIds = ['al-maaden-golf', 'keilir-golf-club', 'new-south-wales-golf-club', 'wentworth-club-west']
assert.deepEqual(Object.keys(releaseApproval.headerOverrides).sort(), [...approvedHeaderIds].sort())
assert.deepEqual(Object.keys(releaseApproval.hashOverrides), ['src/data/golfCourseMedia.json'])
assert.equal(releaseApproval.hashOverrides['src/data/golfCourseMedia.json'], releaseApproval.changes['src/data/golfCourseMedia.json'].afterHash)
export const hashOverrides = releaseApproval.hashOverrides
export const headers = baseline.records.map(record => {
  const override = releaseApproval.headerOverrides[record.id]
  if (!override) return record
  assert.deepEqual(Object.keys(override).sort(), ['articleHash', 'beforeArticleHash', 'photo'])
  assert.equal(override.beforeArticleHash, record.articleHash)
  assert.equal(record.photo, null, `${record.id}: this release adds a previously missing photograph`)
  assert.match(override.articleHash, /^[a-f0-9]{64}$/)
  assert.notEqual(override.articleHash, record.articleHash)
  assert.ok(override.photo?.src.startsWith(`/golf-media/${record.id}-`))
  assert.ok(Object.hasOwn(releaseApproval.addedFiles, `public${override.photo.src}`))
  // In particular, metadata/name/character are inherited, not overrideable.
  return { ...record, photo: override.photo, articleHash: override.articleHash }
})
assert.equal(headers.length, 37)
assert.equal(headers.filter(record => record.photo).length, 22)
