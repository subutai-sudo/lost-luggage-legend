import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import {
  approval, followupApproval, followupBase, followupBytes, followupChangedPaths,
  followupFixturePath, followupPaths, followupTestPath, validateFollowup,
  verifyFollowupInventory, verifyPublishedInventory, assertScopeInventory,
  normalizeApproved, publishedBytes, sha256,
} from './helpers/trip-planning-approval.mjs'

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root))
const home = 'src/components/GoldilocksHome.tsx'

test('all three native shortlist guide Links disable prefetch, with identical hrefs and no other product delta', async () => {
  const current = await read(home)
  const before = followupBytes(home, current)
  assert.equal(followupBase, '96a74ea328c898daf798c776a13c4f94b765810d')
  const insertion = ' prefetch={false}'
  const source = current.toString()
  assert.equal(source.split(insertion).length - 1, 3)
  assert.equal(source.replaceAll(insertion, ''), before.toString(), 'exactly three additions; no design, media, data, URLs, CTA or timing delta')
  const links = [...source.matchAll(/<Link\b[^>]*>/g)].map(match => match[0])
  const guideLinks = links.filter(link => link.includes('href={`/guides/${guide.slug}?month=${month}`}'))
  assert.equal(guideLinks.length, 3)
  for (const link of guideLinks) assert.ok(link.includes('prefetch={false}'))
  assert.ok(guideLinks.some(link => link.includes("styles['image-link']")))
  assert.ok(guideLinks.some(link => link === '<Link prefetch={false} href={`/guides/${guide.slug}?month=${month}`}>'))
  assert.ok(guideLinks.some(link => link.includes("styles['read-guide']")))
  assert.deepEqual([...source.matchAll(/href=\{[^\n]+?\}(?=[ >])/g)].map(m => m[0]), [...before.toString().matchAll(/href=\{[^\n]+?\}(?=[ >])/g)].map(m => m[0]))
  const edits = followupApproval.changes[home].edits
  assert.equal(edits.length, 3)
  for (const edit of edits) {
    assert.equal(Buffer.from(edit.before, 'base64').length, 0)
    assert.equal(Buffer.from(edit.after, 'base64').toString(), insertion)
  }
})

test('complete 307-file published baseline and all latest noncyclic pins are enforced before the legacy chain', async () => {
  assert.deepEqual(await verifyFollowupInventory(), { published: 307, changed: 3, added: 2 })
  assert.deepEqual(await verifyPublishedInventory(), { published: 273, added: 33, immutableFixtures: 10 })
  const files = followupApproval.independentPublishedManifest.files
  assert.equal(Object.keys(files).length, 307)
  assert.deepEqual(Object.keys(followupApproval.addedFiles), [followupTestPath])
  assert.ok(!Object.hasOwn(files, followupFixturePath))
  assert.ok(!Object.hasOwn(followupApproval.changes, followupFixturePath))
  assert.ok(!Object.hasOwn(followupApproval.addedFiles, followupFixturePath))
  const paths = [...Object.keys(files), ...followupPaths]
  assert.equal(paths.length, 309)
  assertScopeInventory(paths)
  for (const path of paths) {
    assert.throws(() => assertScopeInventory(paths.filter(p => p !== path)), `${path}: missing shipping path`)
    assert.throws(() => assertScopeInventory([...paths, path]), `${path}: duplicate shipping path`)
  }
  for (const path of ['.env.local', 'docs/research.json', 'src/unreviewed.ts']) assert.throws(() => assertScopeInventory([...paths, path]))
})

test('each changed file reverses exactly to 96a74ea and rejects old/new interchange, mutation and truncation', async () => {
  for (const path of followupChangedPaths) {
    const bytes = await read(path)
    const restored = followupBytes(path, bytes)
    const entry = followupApproval.independentPublishedManifest.files[path]
    assert.equal(sha256(restored), entry.sha256, path)
    assert.equal(restored.length, entry.bytes, path)
    assert.throws(() => followupBytes(path, restored), `${path}: old is not latest`)
    for (const bad of [Buffer.concat([bytes, Buffer.from('unapproved')]), bytes.subarray(0, -1), Buffer.from(bytes).fill(0, 0, 1)]) {
      assert.throws(() => followupBytes(path, bad), path)
      assert.throws(() => publishedBytes(path, bad), `${path}: legacy caller cannot bypass latest pin`)
    }
    assert.throws(() => publishedBytes(path, restored), `${path}: published reconstruction also demands latest bytes`)
  }
  for (const path of [home, 'tests/helpers/trip-planning-approval.mjs']) {
    const bytes = await read(path)
    normalizeApproved(path, bytes)
    assert.throws(() => normalizeApproved(path, followupBytes(path, bytes)), `${path}: direct prior-overlay caller also fails closed`)
  }
  const added = await read(followupTestPath)
  assert.equal(sha256(added), followupApproval.addedFiles[followupTestPath].afterHash)
  for (const bad of [added.subarray(0, -1), Buffer.concat([added, Buffer.from('unapproved')])]) assert.throws(() => followupBytes(followupTestPath, bad))
})

test('missing, foreign and self-referential claims cannot broaden this follow-up or alter its independent baseline', () => {
  validateFollowup()
  for (const [kind, paths] of [['changes', followupChangedPaths], ['addedFiles', [followupTestPath]]]) {
    for (const path of paths) {
      const missing = structuredClone(followupApproval)
      delete missing[kind][path]
      assert.throws(() => validateFollowup(missing), path)
    }
    for (const path of ['src/unreviewed.ts', followupFixturePath]) {
      const unknown = structuredClone(followupApproval)
      unknown[kind][path] = structuredClone(Object.values(unknown[kind])[0])
      assert.throws(() => validateFollowup(unknown), path)
    }
  }
  for (const path of followupChangedPaths) {
    const stale = structuredClone(followupApproval)
    stale.changes[path].beforeHash = '0'.repeat(64)
    assert.throws(() => validateFollowup(stale), `${path}: cannot reset chain`)
  }
  const rebaseline = structuredClone(followupApproval)
  rebaseline.independentPublishedManifest.files[home].sha256 = '0'.repeat(64)
  assert.throws(() => validateFollowup(rebaseline))
  assert.equal(followupApproval.changes[home].beforeHash, approval.changes[home].afterHash)
})
