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
export const layoutApproval = JSON.parse(readFileSync(new URL('../fixtures/golf-official-layouts-approved-changes.json', import.meta.url), 'utf8'))
assert.equal(layoutApproval.kind, 'golf-official-layouts-approved-change')
assert.equal(layoutApproval.baseline, '8b47a24849bee70227b118a4c5ad761cd1ebce44')
assert.deepEqual(Object.keys(layoutApproval.hashOverrides), ['src/data/golfCourseMedia.json'])
assert.equal(layoutApproval.changes['src/data/golfCourseMedia.json'].beforeHash, releaseApproval.hashOverrides['src/data/golfCourseMedia.json'])
assert.equal(layoutApproval.hashOverrides['src/data/golfCourseMedia.json'], layoutApproval.changes['src/data/golfCourseMedia.json'].afterHash)
export const hashOverrides = layoutApproval.hashOverrides
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

// Layout-only deltas deliberately do NOT replace header records: the published
// four-photo identity test and every photo/name/character/metadata oracle remain
// intact. Only the full-article assertion consumes this separate hash map.
export const approvedArticleIds = [
  'brautarholt-golf-club', 'bro-hof-slott-stadium', 'cog-hill-no-4-dubsdread',
  'jack-s-point', 'katameya-heights-golf-tennis-resort', 'kyt-j-golf-south-east',
  'montgomerie-maxx-royal', 'royal-cape-golf-club', 'royal-golf-marrakech-old-course',
  'sentosa-golf-club-serapong', 'steenberg-golf-club', 'thai-country-club',
  'tpc-summerlin', 'walton-heath-golf-club-old',
]
export function validateLayoutArticleOverrides(overrides) {
  assert.deepEqual(Object.keys(overrides).sort(), [...approvedArticleIds].sort(), 'only explicitly named layout articles')
  const hashes = {}
  for (const id of approvedArticleIds) {
    const record = headers.find(record => record.id === id)
    assert.ok(record, `${id}: published course identity`)
    const override = overrides[id]
    assert.deepEqual(Object.keys(override).sort(), ['articleHash', 'beforeArticleHash'], `${id}: no photo, name or metadata overrides`)
    assert.equal(override.beforeArticleHash, record.articleHash, `${id}: chain from final PR23 article bytes`)
    assert.match(override.articleHash, /^[a-f0-9]{64}$/, `${id}: finalize candidate bytes before running acceptance`)
    assert.notEqual(override.articleHash, record.articleHash, `${id}: necessary layout-only delta`)
    hashes[id] = override.articleHash
  }
  return Object.freeze(hashes)
}
export const articleHashOverrides = validateLayoutArticleOverrides(layoutApproval.articleOverrides)
assert.match(hashOverrides['src/data/golfCourseMedia.json'], /^[a-f0-9]{64}$/)
assert.notEqual(hashOverrides['src/data/golfCourseMedia.json'], releaseApproval.hashOverrides['src/data/golfCourseMedia.json'])
