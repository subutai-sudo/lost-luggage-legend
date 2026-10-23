import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const BASELINE = 'c1858b91776e83d4438d9df6d73a541b0d305dfa'
const IMAGE_QUERY = '?w=1200&q=85&auto=format&fit=crop'
// Frozen from the reviewed baseline audit, NOT the current catalog or git history.
// Keep these constants portable: no runtime dependency on the external audit file.
const AUDITED = [
  ['bogota', 'verify_location', 'photo-1568632234165-47bb34c35708'],
  ['bordeaux', 'non_destination_stock', 'photo-1560393464-5c69a73c5770'],
  ['brussels', 'non_destination_stock', 'photo-1559113513-d5e09c78b9dd'],
  ['cancun', 'verify_location', 'photo-1630252421399-ddde79af47b3'],
  ['casablanca', 'verify_location', 'photo-1539020140153-e479b8c22e70'],
  ['denver', 'verify_location', 'photo-1602800458591-eddda28a498b'],
  ['dublin', 'verify_location', 'photo-1549918864-48ac978761a4'],
  ['edinburgh', 'non_destination_stock', 'photo-1548839140-29a749e1cf4d'],
  ['geneva', 'verify_location', 'photo-1584200463394-bba4b2117e4d'],
  ['guangzhou', 'non_destination_stock', 'photo-1547637589-f54c34f5d7a4'],
  ['helsinki', 'non_destination_stock', 'photo-1558788353-f76d92427f16'],
  ['iceland', 'verify_location', 'photo-1531366936337-7c912a4589a7'],
  ['johannesburg', 'non_destination_stock', 'photo-1586350977771-b3b0abd50c82'],
  ['krakow', 'wrong_destination', 'photo-1559128010-7c1ad6e1b6a5'],
  ['maasai-mara', 'verify_location', 'photo-1516426122078-c23e76319801'],
  ['macau', 'wrong_destination', 'photo-1508009603885-50cf7c579365'],
  ['madrid', 'non_destination_stock', 'photo-1543353071-873f17a7a088'],
  ['maldives', 'verify_location', 'photo-1514282401047-d79a71a590e8'],
  ['miami', 'verify_location', 'photo-1506966953602-c20cc11f75e3'],
  ['milan', 'non_destination_stock', 'photo-1558618666-fcd25c85cd64'],
  ['nashville', 'verify_location', 'photo-1514320291840-2e0a9bf2a9ae'],
  ['new-orleans', 'wrong_destination', 'photo-1544078751-58fee2d8a03b'],
  ['orlando', 'non_destination_stock', 'photo-1558618666-fcd25c85cd64'],
  ['patagonia', 'wrong_destination', 'photo-1531761535209-180857e963b9'],
  ['pattaya', 'verify_location', 'photo-1504214208698-ea1916a2195a'],
  ['phoenix', 'non_destination_stock', 'photo-1568772585407-9361f9bf3a87'],
  ['phuket', 'verify_location', 'photo-1589394815804-964ed0be2eb5'],
  ['queenstown', 'wrong_destination', 'photo-1506973035872-a4ec16b8e8d9'],
  ['reykjavik', 'verify_location', 'photo-1504893524553-b855bce32c67'],
  ['san-diego', 'wrong_destination', 'photo-1538097304804-2a1b932466a9'],
  ['sao-paulo', 'wrong_destination', 'photo-1576485375217-d6a95e34d043'],
  ['seoul', 'verify_location', 'photo-1538485399081-7191377e8241'],
  ['seville', 'wrong_destination', 'photo-1555881400-74d7acaacd8b'],
  ['shanghai', 'wrong_destination', 'photo-1537531383496-f4749b8032cf'],
  ['shenzhen', 'non_destination_stock', 'photo-1508807526345-15e9b5f4eaff'],
  ['st-petersburg', 'wrong_destination', 'photo-1560969184-10fe8719e047'],
  ['tampa', 'verify_location', 'photo-1673574672395-5f8bd3c2ed5a'],
  ['washington-dc', 'non_destination_stock', 'photo-1562777717-dc6984f65a63'],
]
const PHOTO_PATTERN = /^\/photo-\d+-[a-zA-Z0-9]+$/

async function readCatalog() {
  const source = ts.createSourceFile('destinationGuides.ts', await readFile(new URL('../src/data/destinationGuides.ts', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true)
  assert.equal(source.parseDiagnostics.length, 0, 'catalog TypeScript must parse')
  const declarations = source.statements.filter(ts.isVariableStatement)
    .flatMap(statement => [...statement.declarationList.declarations])
    .filter(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === 'DESTINATION_GUIDES')
  assert.equal(declarations.length, 1, 'read the actual DESTINATION_GUIDES declaration')
  const array = declarations[0].initializer
  assert.ok(array && ts.isArrayLiteralExpression(array), 'DESTINATION_GUIDES must be a literal array')
  // Read only needed fields; unrelated affiliate calls, arrays, booleans, etc.
  // must not be evaluated or forced into a string-only parser.
  return array.elements.map(element => {
    assert.ok(ts.isObjectLiteralExpression(element), 'guide must be an object literal')
    return Object.fromEntries(['id', 'slug', 'heroImage'].map(key => {
      const properties = element.properties.filter(property => ts.isPropertyAssignment(property) && property.name.text === key)
      assert.equal(properties.length, 1, `exactly one ${key} property`)
      assert.ok(ts.isStringLiteral(properties[0].initializer), `${key} must be a string literal`)
      return [key, properties[0].initializer.text]
    }))
  })
}

function imageIdentity(value, label) {
  assert.equal(typeof value, 'string', `${label}: image URL is required`)
  const url = new URL(value)
  assert.equal(url.protocol, 'https:', label)
  assert.equal(url.hostname, 'images.unsplash.com', `${label}: free Unsplash image host only`)
  assert.equal(url.username + url.password + url.port + url.hash, '', label)
  assert.match(url.pathname, PHOTO_PATTERN, `${label}: photo-* only, never profile/plus assets`)
  assert.equal(url.search, IMAGE_QUERY, `${label}: preserve approved image sizing/format query`)
  return url.pathname.slice(1)
}

function meaningful(value, label, minLength, minWords = 1) {
  assert.equal(typeof value, 'string', `${label}: required text`)
  assert.ok(value.trim().length >= minLength, `${label}: meaningful text required`)
  assert.ok(value.trim().split(/\s+/u).length >= minWords, `${label}: describe the evidence`)
  assert.match(value, /\p{L}/u, `${label}: text, not punctuation`)
  assert.doesNotMatch(value, /^(?:tbd|todo|pending|unknown|n\/?a|none|unverified|placeholder|https?:\/\/.*)[.!\s]*$/i, `${label}: not a placeholder or bare URL`)
}

function assertRecord(record, [id, category, previousPhotoId], guide) {
  assert.equal(record.id, id)
  assert.equal(record.auditCategory, category, `${id}: frozen audit category`)
  assert.ok(guide, `${id}: known source destination required`)
  assert.equal(record.previousImageUrl, `https://images.unsplash.com/${previousPhotoId}${IMAGE_QUERY}`, `${id}: frozen baseline URL`)
  const approvedPhoto = imageIdentity(record.imageUrl, `${id}: approved`)
  assert.equal(guide.heroImage, record.imageUrl, `${id}: catalog must use the approved evidence image URL`)
  assert.equal(imageIdentity(guide.heroImage, `${id}: catalog`), approvedPhoto)
  assert.ok(['replace', 'retain'].includes(record.action), `${id}: explicit replace/retain decision`)
  if (category !== 'verify_location') assert.equal(record.action, 'replace', `${id}: wrong/stock photos must be replaced`)
  if (record.action === 'replace') assert.notEqual(approvedPhoto, previousPhotoId, `${id}: query changes do not replace a photo`)
  else {
    assert.equal(approvedPhoto, previousPhotoId, `${id}: retain must keep the original asset`)
    assert.equal(record.imageUrl, record.previousImageUrl, `${id}: retain must preserve its URL`)
  }
  assert.equal(typeof record.sourceUrl, 'string', `${id}: source URL is required`)
  const source = new URL(record.sourceUrl)
  assert.equal(source.protocol, 'https:', `${id}: HTTPS source required`)
  assert.equal(source.hostname, 'unsplash.com', `${id}: Unsplash photo page required`)
  assert.equal(source.username + source.password + source.port + source.hash, '', `${id}: canonical source URL`)
  assert.match(source.pathname, /^\/photos\/[a-zA-Z0-9_-]+\/?$/, `${id}: public photo page, not search/profile/collection`)
  assert.equal(record.licenseUrl, 'https://unsplash.com/license', `${id}: free Unsplash license`)
  meaningful(record.creator, `${id}: creator`, 2)
  meaningful(record.locationEvidence, `${id}: location evidence`, 25, 4)
  meaningful(record.visualEvidence, `${id}: visual evidence`, 25, 4)
  assert.equal(typeof record.checkedAt, 'string', `${id}: checkedAt required`)
  assert.match(record.checkedAt, /^\d{4}-\d{2}-\d{2}$/, `${id}: date-only YYYY-MM-DD`)
  const checkedAt = new Date(`${record.checkedAt}T00:00:00.000Z`)
  assert.ok(Number.isFinite(checkedAt.getTime()), `${id}: valid check date`)
  assert.equal(checkedAt.toISOString().slice(0, 10), record.checkedAt, `${id}: real calendar date, not normalized overflow`)
}

const guides = await readCatalog()

test('photo regression inventory covers all 100 unique source destinations', () => {
  assert.equal(guides.length, 100)
  assert.equal(new Set(guides.map(guide => guide.id)).size, 100)
  assert.equal(new Set(guides.map(guide => guide.slug)).size, 100)
  assert.equal(AUDITED.length, 38)
  assert.equal(new Set(AUDITED.map(([id]) => id)).size, 38)
  assert.deepEqual(Object.fromEntries(['wrong_destination', 'non_destination_stock', 'verify_location'].map(category => [category, AUDITED.filter(row => row[1] === category).length])), {
    wrong_destination: 10, non_destination_stock: 12, verify_location: 16,
  })
  for (const [id] of AUDITED) assert.ok(guides.some(guide => guide.id === id), `${id}: audited ID must exist`)
})

test('all 100 catalog destinations use distinct free-photo asset identities', () => {
  const owners = new Map()
  const duplicates = []
  for (const guide of guides) {
    const photo = imageIdentity(guide.heroImage, guide.id)
    if (owners.has(photo)) duplicates.push(`${owners.get(photo)} / ${guide.id}: ${photo}`)
    else owners.set(photo, guide.id)
  }
  assert.deepEqual(duplicates, [], `Reused destination photos: ${duplicates.join('; ')}`)
})

test('approved evidence manifest resolves exactly the frozen 38 audit findings', async t => {
  const manifestUrl = new URL('../src/data/destinationPhotoEvidence.json', import.meta.url)
  let raw
  try {
    raw = await readFile(manifestUrl, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    assert.fail('Missing approved photo evidence: src/data/destinationPhotoEvidence.json; all 38 audit findings require an explicit documented decision')
  }
  const manifest = JSON.parse(raw)
  assert.equal(manifest.schemaVersion, 1)
  assert.equal(manifest.baselineCommit, BASELINE)
  assert.ok(Array.isArray(manifest.records), 'manifest records array required')
  assert.equal(manifest.records.length, 38, 'exactly 38 reviewed records required')
  const records = new Map(manifest.records.map(record => [record.id, record]))
  assert.equal(records.size, 38, 'duplicate evidence IDs are forbidden')
  assert.deepEqual([...records.keys()].sort(), AUDITED.map(([id]) => id).sort(), 'reject unknown or missing destination IDs')
  // These assertions enforce documentation/asset consistency, not geographic truth
  // or GPS certification. Source and visual claims still require human review.
  for (const row of AUDITED) {
    await t.test(`${row[0]}: category, decision, provenance and approved catalog identity`, () => {
      assertRecord(records.get(row[0]), row, guides.find(guide => guide.id === row[0]))
    })
  }
})
