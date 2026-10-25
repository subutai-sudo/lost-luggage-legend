import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const root = new URL('../', import.meta.url)
const fixtureBytes = await readFile(new URL('./fixtures/guide-performance-baseline.json', import.meta.url))
const frozen = JSON.parse(fixtureBytes)
// This is a reviewed acceptance overlay, NOT a replacement performance baseline.
// Neither oracle consults runtime git, external audit files, or generated output.
const approved = JSON.parse(await readFile(new URL('./fixtures/accessibility-approved-changes.json', import.meta.url), 'utf8'))
const pagePath = 'src/app/guides/[slug]/page.tsx'
const oldSizes = '(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw'
const correctedSizes = '(max-width: 639px) calc(103.5vw - 41.4px), (max-width: 959px) calc(51.75vw - 45.54px), (min-width: 1344px) 411.24px, calc(34.5vw - 52.44px)'
const field = /(?<=src=\{r\.heroImage\}[\s\S]{0,200}sizes=")[^"]+(?=")/g
const source = await readFile(new URL(pagePath, root), 'utf8')
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const read = path => readFile(new URL(path, root))

// Deliberately enumerate the reviewed scope separately from the manifest: adding
// a data/image/config path to the JSON cannot silently grant it an exception.
const approvedPaths = [
  'src/app/guides/[slug]/GuideArticle.module.css',
  pagePath,
  'src/app/plan/page.tsx',
  'src/components/ComparePricesSection.tsx',
  'src/components/FlightSearch.tsx',
  'src/components/GoldilocksHome.module.css',
  'src/components/PriceComparison.module.css',
  'src/components/PriceComparison.tsx',
  'src/components/SeasonalReason.tsx',
]
const addedPaths = [
  'src/app/plan/PlanIntro.module.css',
  'src/components/ComparePricesSection.module.css',
]
const businessDeclarations = {
  'src/components/FlightSearch.tsx': ['AIRPORTS', 'DEST_COORDS', 'haversineKm', 'estimateFlightHours', 'DEST_AIRPORTS', 'makeFlightUrl'],
  'src/components/ComparePricesSection.tsx': ['AIRPORTS', 'STAY22_AID', 'FLIGHT_SUPPLIERS', 'HOTEL_SUPPLIERS', 'getAirportsByCity', 'searchAirports', 'dateError', 'endDateMin', 'isFormValid', 'supplierLinks', 'handleSearch', 'formatDate', 'getDisplayCity'],
  'src/components/PriceComparison.tsx': ['STAY22_AID', 'SUPPLIERS'],
}
const legacyFixtureHash = '65a2692a2b7235011c15f3001da95bed9577c9731167fc77ca1e437567a9fbb3'
const expectedHash = path => approvedPaths.includes(path)
  ? approved.changes[path].afterHash
  : addedPaths.includes(path) ? approved.addedFiles[path].afterHash : frozen.hashes[path]
const accepts = (path, bytes) => sha256(bytes) === expectedHash(path)

test('accessibility-approved-change overlay names only the reviewed files and preserves the immutable legacy oracle', () => {
  assert.equal(sha256(fixtureBytes), legacyFixtureHash, 'never regenerate or edit the legacy performance fixture')
  assert.equal(frozen.baseline, '70a91debd34c83c9b35e856c845ce7c4e641da69')
  assert.equal(Object.keys(frozen.hashes).length, 155)
  assert.equal(approved.schemaVersion, 1)
  assert.equal(approved.kind, 'accessibility-approved-change')
  assert.equal(approved.accessibilityBaseline, '956713b3190c51e5edff5ab6a60147ce0e744eaa')
  assert.equal(approved.legacyPerformanceBaseline, frozen.baseline)
  assert.equal(approved.legacyFixtureSha256, legacyFixtureHash)
  assert.deepEqual(Object.keys(approved.changes).sort(), [...approvedPaths].sort())
  assert.deepEqual(Object.keys(approved.addedFiles).sort(), [...addedPaths].sort())
  for (const path of approvedPaths) {
    const entry = approved.changes[path]
    assert.equal(entry.beforeHash, frozen.hashes[path], `${path}: exception must start from the original freeze`)
    assert.match(entry.afterHash, /^[a-f0-9]{64}$/)
    assert.notEqual(entry.afterHash, entry.beforeHash, `${path}: no unnecessary exceptions`)
    assert.ok(entry.reason?.trim(), `${path}: explain the reviewed accessibility delta`)
  }
  for (const path of addedPaths) {
    assert.ok(!Object.hasOwn(frozen.hashes, path), `${path}: new scoped styles, not a rebaselined old file`)
    assert.equal(approved.addedFiles[path].beforeHash, null)
    assert.match(approved.addedFiles[path].afterHash, /^[a-f0-9]{64}$/)
    assert.ok(approved.addedFiles[path].reason?.trim())
  }
})

test('related image sizes still describe gutters, gaps, hover headroom and the capped container', () => {
  assert.deepEqual([...source.matchAll(field)].map(match => match[0]), [correctedSizes])
})

test('guide source accepts only the exact accessibility-approved change plus the prior related Image sizes correction', () => {
  assert.equal([...source.matchAll(field)].length, 1, 'normalize exactly one related field, never all sizes props')
  assert.ok(accepts(pagePath, source), 'exact approved article bytes, not an arbitrary accessibility edit')
  // Independently reconstruct the pre-accessibility source by reversing ONLY
  // the two reviewed fragment-focus changes. This retains the old full-source
  // oracle, including every image attribute and all unrelated article markup.
  const bookingLink = '<a href="#book" className={styles.bookingLink}>Explore booking options <span aria-hidden="true">↗</span></a>'
  const bookingTarget = '<div id="book" tabIndex={-1} className={styles.booking} data-guide-booking>'
  assert.equal(source.split(bookingLink).length - 1, 1)
  assert.equal(source.split(bookingTarget).length - 1, 1)
  const beforeAccessibility = source
    .replace(bookingLink, '<Link href="#book" className={styles.bookingLink}>Explore booking options <span aria-hidden="true">↗</span></Link>')
    .replace(bookingTarget, '<div id="book" className={styles.booking} data-guide-booking>')
  assert.equal(sha256(beforeAccessibility), approved.changes[pagePath].beforeAccessibilityHash)
  assert.equal(sha256(beforeAccessibility.replace(field, oldSizes)), frozen.hashes[pagePath], 'only the prior related sizes field is normalized for the legacy 70a91de hash')
})

test('all other baseline bytes stay frozen except exact explicitly approved accessibility after-hashes', async () => {
  for (const path of Object.keys(frozen.hashes)) {
    if (path === pagePath) continue
    assert.ok(accepts(path, await read(path)), `${path}: ${approvedPaths.includes(path) ? 'exact accessibility-approved-change afterHash' : 'original legacy byte freeze'}`)
  }
  for (const path of addedPaths) assert.ok(accepts(path, await read(path)), `${path}: exact new scoped accessibility stylesheet`)
})

test('accessibility acceptance never permits unapproved bytes, including inside an allowlisted file', async () => {
  // Negative control uses in-memory mutations only; never edit production files
  // to demonstrate a guard. Exercise every frozen path and both new styles.
  for (const path of [...Object.keys(frozen.hashes), ...addedPaths]) {
    const bytes = await read(path)
    assert.ok(accepts(path, bytes), `${path}: positive control`)
    assert.equal(accepts(path, Buffer.concat([bytes, Buffer.from('\n/* unapproved edit */\n')])), false, `${path}: reject even a one-file addition`)
    if (approvedPaths.includes(path)) {
      assert.notEqual(expectedHash(path), frozen.hashes[path], `${path}: exception is not a choice between old and new hashes`)
    }
  }
})

test('airport data, flight math, supplier definitions, date validation and URL derivation remain pre-accessibility exact', async () => {
  assert.deepEqual(Object.keys(approved.unchangedBusinessDeclarations).sort(), Object.keys(businessDeclarations).sort())
  for (const [path, names] of Object.entries(businessDeclarations)) {
    const hashes = approved.unchangedBusinessDeclarations[path]
    assert.deepEqual(Object.keys(hashes).sort(), [...names].sort(), `${path}: exact independently selected declaration inventory`)
    const tree = ts.createSourceFile(path, (await read(path)).toString(), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    for (const name of names) {
      const found = []
      function visit(node) {
        if ((ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) && node.name?.getText(tree) === name) found.push(node)
        ts.forEachChild(node, visit)
      }
      visit(tree)
      assert.equal(found.length, 1, `${path}: one ${name} declaration`)
      assert.equal(sha256(found[0].getText(tree)), hashes[name], `${path}: ${name} unchanged from 956713b`)
    }
  }
})
