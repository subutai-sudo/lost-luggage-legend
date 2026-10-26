import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const root = new URL('../', import.meta.url)
const fixtureBytes = await readFile(new URL('./fixtures/guide-performance-baseline.json', import.meta.url))
const frozen = JSON.parse(fixtureBytes)

// Reviewed acceptance overlays, NOT replacement baselines. Each named change set
// lists its own paths in code below, so a JSON or manifest edit alone can never
// grant an exception. Neither oracle consults runtime git or generated output.
const overlays = [
  {
    name: 'accessibility',
    kind: 'accessibility-approved-change',
    baselineKey: 'accessibilityBaseline',
    baseline: '956713b3190c51e5edff5ab6a60147ce0e744eaa',
    doc: JSON.parse(await readFile(new URL('./fixtures/accessibility-approved-changes.json', import.meta.url), 'utf8')),
    paths: [
      'src/app/guides/[slug]/GuideArticle.module.css',
      'src/app/guides/[slug]/page.tsx',
      'src/app/plan/page.tsx',
      'src/components/ComparePricesSection.tsx',
      'src/components/FlightSearch.tsx',
      'src/components/GoldilocksHome.module.css',
      'src/components/PriceComparison.module.css',
      'src/components/PriceComparison.tsx',
      'src/components/SeasonalReason.tsx',
    ],
    added: [
      'src/app/plan/PlanIntro.module.css',
      'src/components/ComparePricesSection.module.css',
    ],
  },
  {
    name: 'golf',
    kind: 'golf-approved-change',
    baselineKey: 'golfBaseline',
    baseline: '663f60951f978de497e641a9c44512d716fddc67',
    doc: JSON.parse(await readFile(new URL('./fixtures/golf-approved-changes.json', import.meta.url), 'utf8')),
    paths: [
      'src/components/Navbar.tsx',
      'src/lib/site.ts',
      'tests/seo.integration.test.mjs',
      'tests/navbar.browser.test.mjs',
    ],
    // Exact new vertical inventory; JSON alone cannot grant an exception.
    added: [
      'src/app/golf/page.tsx',
      'src/components/GolfReason.module.css',
      'src/components/GolfReason.tsx',
      'src/components/GolfZone.module.css',
      'src/components/GolfZone.tsx',
      'src/data/golfCourseNotes.json',
      'src/data/golfCourseReview.json',
      'src/data/golfCourses.ts',
      'src/data/golfSources.json',
      'src/lib/golfDiscovery.ts',
    ],
  },
]

const pagePath = 'src/app/guides/[slug]/page.tsx'
const oldSizes = '(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw'
const correctedSizes = '(max-width: 639px) calc(103.5vw - 41.4px), (max-width: 959px) calc(51.75vw - 45.54px), (min-width: 1344px) 411.24px, calc(34.5vw - 52.44px)'
const field = /(?<=src=\{r\.heroImage\}[\s\S]{0,200}sizes=")[^"]+(?=")/g
const source = await readFile(new URL(pagePath, root), 'utf8')
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const read = path => readFile(new URL(path, root))

const owner = new Map()
for (const overlay of overlays) {
  for (const path of overlay.paths) {
    assert.ok(!owner.has(path), `${path}: claimed by two overlays`)
    owner.set(path, { overlay, kind: 'changes' })
  }
  for (const path of overlay.added) {
    assert.ok(!owner.has(path), `${path}: claimed by two overlays`)
    owner.set(path, { overlay, kind: 'addedFiles' })
  }
}

// The article also carries the earlier related-image sizes correction, which is
// why its exception lives in the accessibility overlay and is normalized below.
// The course-guide repair is a separate, exact-byte follow-up, not a
// regeneration of either the legacy freeze or the original golf approval.
const courseGuidePaths = ['src/components/GolfZone.tsx', 'src/app/sitemap.ts', 'tests/seo.integration.test.mjs', 'src/data/golfCourseNotes.json', 'src/data/golfCourseReview.json', 'src/data/golfSources.json']
const courseGuideAdded = ['src/app/golf/[slug]/page.tsx', 'src/components/GolfGuide.module.css', 'src/lib/golfGuides.ts', 'src/data/golfGuideDetails.json', 'src/data/golfOperationalNotices.ts']
const courseGuideApproval = JSON.parse(await readFile(new URL('./fixtures/golf-guides-approved-changes.json', import.meta.url), 'utf8'))
const previousHash = path => {
  const claim = owner.get(path)
  return claim ? claim.overlay.doc[claim.kind][path].afterHash : frozen.hashes[path]
}
// Course-media follow-up: a separate named overlay that chains onto the
// course-guide approval rather than replacing or rebaselining it. Its inventory
// is enumerated in code here as well as in the JSON, so a JSON-only edit cannot
// grant an exception.
const mediaPaths = ['src/app/golf/[slug]/page.tsx']
const mediaApproval = JSON.parse(await readFile(new URL('./fixtures/golf-media-approved-changes.json', import.meta.url), 'utf8'))
const mediaAdded = Object.keys(mediaApproval.addedFiles)
const courseGuideHash = path => {
  if (courseGuidePaths.includes(path)) return courseGuideApproval.changes[path].afterHash
  if (courseGuideAdded.includes(path)) return courseGuideApproval.addedFiles[path].afterHash
  return previousHash(path)
}
const mediaHash = path => {
  if (mediaPaths.includes(path)) return mediaApproval.changes[path].afterHash
  if (mediaAdded.includes(path)) return mediaApproval.addedFiles[path].afterHash
  return courseGuideHash(path)
}
// Finder display follow-up. Keep all earlier fixtures immutable; a path already
// owned by a prior overlay chains from its last approved hash, never the legacy
// bytes. Test harness files predate no overlay, so pin their exact merge bytes.
const finderPaths = [
  'src/app/golf/page.tsx', 'src/components/GolfZone.tsx', 'src/components/GolfZone.module.css',
  'src/components/GolfCourseMedia.tsx',
  'tests/golf-core.test.mjs', 'tests/golf-zone.browser.test.mjs', 'tests/guide-performance.test.mjs',
]
const finderAdded = [
  'src/lib/golfFinderMedia.ts', 'tests/golf-finder-media.test.mjs', 'tests/golf-finder-media.browser.test.mjs',
  'src/components/GolfVisualsFragment.tsx', 'tests/golf-visuals-fragment.test.mjs', 'tests/golf-visuals-fragment.browser.test.mjs',
]
const finderPriorHarnessHashes = {
  'tests/golf-core.test.mjs': '1c04f7ac53a1611c22f88b46179f66e2e12f3743b6c4b2a6455069640b7abadb',
  'tests/golf-zone.browser.test.mjs': '3f650aeea9b3dd403ca23fb480f40db3cefd3cbdf37737102da063bacfe048b7',
  'tests/guide-performance.test.mjs': 'a621dce81926f7fea00e2d6c97c1f150da7100e0d6962d7e127d830928ec6629',
}
const finderApproval = JSON.parse(await readFile(new URL('./fixtures/golf-finder-media-approved-changes.json', import.meta.url), 'utf8'))
const expectedHash = path => {
  if (finderPaths.includes(path)) return finderApproval.changes[path].afterHash
  if (finderAdded.includes(path)) return finderApproval.addedFiles[path].afterHash
  return mediaHash(path)
}
const accepts = (path, bytes) => sha256(bytes) === expectedHash(path)

const businessDeclarations = {
  'src/components/FlightSearch.tsx': ['AIRPORTS', 'DEST_COORDS', 'haversineKm', 'estimateFlightHours', 'DEST_AIRPORTS', 'makeFlightUrl'],
  'src/components/ComparePricesSection.tsx': ['AIRPORTS', 'STAY22_AID', 'FLIGHT_SUPPLIERS', 'HOTEL_SUPPLIERS', 'getAirportsByCity', 'searchAirports', 'dateError', 'endDateMin', 'isFormValid', 'supplierLinks', 'handleSearch', 'formatDate', 'getDisplayCity'],
  'src/components/PriceComparison.tsx': ['STAY22_AID', 'SUPPLIERS'],
}
const legacyFixtureHash = '65a2692a2b7235011c15f3001da95bed9577c9731167fc77ca1e437567a9fbb3'

test('every acceptance overlay names only its reviewed files and preserves the immutable legacy oracle', () => {
  assert.equal(sha256(fixtureBytes), legacyFixtureHash, 'never regenerate or edit the legacy performance fixture')
  assert.equal(frozen.baseline, '70a91debd34c83c9b35e856c845ce7c4e641da69')
  assert.equal(Object.keys(frozen.hashes).length, 155)
  for (const overlay of overlays) {
    const doc = overlay.doc
    assert.equal(doc.schemaVersion, 1, `${overlay.name}: schema version`)
    assert.equal(doc.kind, overlay.kind, `${overlay.name}: kind`)
    assert.equal(doc[overlay.baselineKey], overlay.baseline, `${overlay.name}: stated baseline`)
    assert.equal(doc.legacyPerformanceBaseline, frozen.baseline, `${overlay.name}: legacy baseline`)
    assert.equal(doc.legacyFixtureSha256, legacyFixtureHash, `${overlay.name}: legacy fixture hash`)
    assert.deepEqual(Object.keys(doc.changes).sort(), [...overlay.paths].sort(), `${overlay.name}: change inventory`)
    assert.deepEqual(Object.keys(doc.addedFiles).sort(), [...overlay.added].sort(), `${overlay.name}: added inventory`)
    for (const path of overlay.paths) {
      const entry = doc.changes[path]
      assert.equal(entry.beforeHash, frozen.hashes[path], `${overlay.name}/${path}: exception starts from the original freeze`)
      assert.match(entry.afterHash, /^[a-f0-9]{64}$/)
      assert.notEqual(entry.afterHash, entry.beforeHash, `${overlay.name}/${path}: no unnecessary exceptions`)
      assert.ok(entry.reason?.trim(), `${overlay.name}/${path}: explain the reviewed delta`)
    }
    for (const path of overlay.added) {
      assert.ok(!Object.hasOwn(frozen.hashes, path), `${overlay.name}/${path}: new file, not a rebaselined old one`)
      assert.equal(doc.addedFiles[path].beforeHash, null)
      assert.match(doc.addedFiles[path].afterHash, /^[a-f0-9]{64}$/)
      assert.ok(doc.addedFiles[path].reason?.trim())
    }
  }
})

test('course-guide follow-up permits only exact approved deltas, with negative controls', async () => {
  assert.equal(courseGuideApproval.baseline, 'cf0c66d')
  assert.deepEqual(Object.keys(courseGuideApproval.changes).sort(), [...courseGuidePaths].sort())
  assert.deepEqual(Object.keys(courseGuideApproval.addedFiles).sort(), [...courseGuideAdded].sort())
  for (const path of courseGuidePaths) {
    const entry = courseGuideApproval.changes[path]
    assert.equal(entry.beforeHash, previousHash(path), `${path}: preserve prior approved oracle`)
    assert.notEqual(entry.afterHash, entry.beforeHash)
    assert.match(entry.afterHash, /^[a-f0-9]{64}$/)
    assert.ok(entry.reason?.trim())
  }
  for (const path of courseGuideAdded) {
    assert.equal(previousHash(path), undefined)
    assert.equal(courseGuideApproval.addedFiles[path].beforeHash, null)
    assert.ok(courseGuideApproval.addedFiles[path].reason?.trim())
  }
  for (const path of [...courseGuidePaths, ...courseGuideAdded]) {
    const bytes = await read(path)
    assert.ok(accepts(path, bytes), path)
    assert.equal(accepts(path, Buffer.concat([bytes, Buffer.from('\n/* unapproved */')])), false, path)
  }
})

test('course-media follow-up names only its reviewed files, chains onto the prior approval and rejects additions', async () => {
  assert.equal(mediaApproval.schemaVersion, 1)
  assert.equal(mediaApproval.kind, 'golf-media-approved-change')
  assert.equal(mediaApproval.golfMediaBaseline, 'a9fee50102b72d17c025c103adec07b96dcd2afe')
  assert.equal(mediaApproval.legacyFixtureSha256, legacyFixtureHash)
  assert.deepEqual(Object.keys(mediaApproval.changes).sort(), [...mediaPaths].sort())
  for (const path of mediaPaths) {
    const entry = mediaApproval.changes[path]
    // The point of the chain: the media overlay starts from the bytes the
    // course-guide overlay approved, not from the legacy freeze.
    assert.equal(entry.beforeHash, courseGuideHash(path), `${path}: must chain onto the prior approved bytes`)
    assert.notEqual(entry.afterHash, entry.beforeHash)
    assert.match(entry.afterHash, /^[a-f0-9]{64}$/)
    assert.ok(entry.reason?.trim())
  }
  assert.ok(mediaAdded.length, 'the media overlay must enumerate its added files')
  for (const path of mediaAdded) {
    assert.ok(!Object.hasOwn(frozen.hashes, path), `${path}: new file, not a rebaselined old one`)
    assert.equal(mediaApproval.addedFiles[path].beforeHash, null)
    assert.match(mediaApproval.addedFiles[path].afterHash, /^[a-f0-9]{64}$/)
    assert.ok(mediaApproval.addedFiles[path].reason?.trim())
    const bytes = await read(path)
    assert.ok(accepts(path, bytes), path)
    // Negative control: appended bytes in an approved file must be refused.
    assert.equal(accepts(path, Buffer.concat([bytes, Buffer.from('\n/* unapproved */')])), false, path)
  }
})

test('finder media follow-up accepts only its exact named files and the last approved chain', async () => {
  assert.equal(finderApproval.schemaVersion, 1)
  assert.equal(finderApproval.kind, 'golf-finder-media-approved-change')
  assert.equal(finderApproval.golfFinderMediaBaseline, 'ebd3e1f92f6313718b7c10df9b286308730a1548')
  assert.equal(finderApproval.legacyFixtureSha256, legacyFixtureHash)
  assert.deepEqual(Object.keys(finderApproval.changes).sort(), [...finderPaths].sort())
  assert.deepEqual(Object.keys(finderApproval.addedFiles).sort(), [...finderAdded].sort())
  for (const path of finderPaths) {
    const entry = finderApproval.changes[path]
    assert.equal(entry.beforeHash, mediaHash(path) ?? finderPriorHarnessHashes[path], `${path}: chain to last accepted bytes`)
    assert.notEqual(entry.afterHash, entry.beforeHash)
    assert.match(entry.afterHash, /^[a-f0-9]{64}$/)
    assert.ok(entry.reason?.trim())
  }
  for (const path of finderAdded) {
    assert.equal(mediaHash(path), undefined, `${path}: genuinely new`)
    assert.equal(finderApproval.addedFiles[path].beforeHash, null)
    assert.match(finderApproval.addedFiles[path].afterHash, /^[a-f0-9]{64}$/)
    assert.ok(finderApproval.addedFiles[path].reason?.trim())
  }
  for (const path of [...finderPaths, ...finderAdded]) {
    const bytes = await read(path)
    assert.ok(accepts(path, bytes), path)
    assert.equal(accepts(path, Buffer.concat([bytes, Buffer.from('\n/* unapproved */')])), false, path)
    // Never accept either pre-change bytes or post-change bytes interchangeably.
    if (finderPaths.includes(path)) assert.notEqual(expectedHash(path), finderApproval.changes[path].beforeHash)
  }
  assert.equal(expectedHash('src/data/golfCourseMedia.json'), mediaApproval.addedFiles['src/data/golfCourseMedia.json'].afterHash)
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
  const accessibility = overlays.find(overlay => overlay.name === 'accessibility')
  assert.equal(sha256(beforeAccessibility), accessibility.doc.changes[pagePath].beforeAccessibilityHash)
  assert.equal(sha256(beforeAccessibility.replace(field, oldSizes)), frozen.hashes[pagePath], 'only the prior related sizes field is normalized for the legacy 70a91de hash')
})

test('all other baseline bytes stay frozen except exact explicitly approved after-hashes', async () => {
  for (const path of Object.keys(frozen.hashes)) {
    if (path === pagePath) continue
    const claim = owner.get(path)
    assert.ok(accepts(path, await read(path)), `${path}: ${claim ? `exact ${claim.overlay.name}-approved-change afterHash` : 'original legacy byte freeze'}`)
  }
  const added = overlays.flatMap(overlay => overlay.added)
  for (const path of added) assert.ok(accepts(path, await read(path)), `${path}: exact approved new file`)
})

test('an acceptance overlay never permits unapproved bytes, including inside an allowlisted file', async () => {
  // Negative control uses in-memory mutations only; never edit production files
  // to demonstrate a guard. Exercise every frozen path and every approved file.
  const added = overlays.flatMap(overlay => overlay.added)
  for (const path of [...Object.keys(frozen.hashes), ...added]) {
    const bytes = await read(path)
    assert.ok(accepts(path, bytes), `${path}: positive control`)
    assert.equal(accepts(path, Buffer.concat([bytes, Buffer.from('\n/* unapproved edit */\n')])), false, `${path}: reject even a one-file addition`)
    const claim = owner.get(path)
    if (claim && claim.kind === 'changes') {
      assert.notEqual(expectedHash(path), frozen.hashes[path], `${path}: exception is not a choice between old and new hashes`)
    }
  }
})

test('airport data, flight math, supplier definitions, date validation and URL derivation remain pre-accessibility exact', async () => {
  const accessibility = overlays.find(overlay => overlay.name === 'accessibility')
  assert.deepEqual(Object.keys(accessibility.doc.unchangedBusinessDeclarations).sort(), Object.keys(businessDeclarations).sort())
  for (const [path, names] of Object.entries(businessDeclarations)) {
    const hashes = accessibility.doc.unchangedBusinessDeclarations[path]
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
