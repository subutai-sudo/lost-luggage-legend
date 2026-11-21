import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// Independent reproduction: real production store, shared backing value, and
// deliberately queued notifications (not an auto-synchronizing fixture).
const source = readFileSync(new URL('../src/lib/savedDestinations.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022,
} }).outputText
const { createSavedDestinationsStore } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const known = ['maldives', 'cape-town', 'tokyo', 'kyoto']
const record = (id, month) => ({ id, month })
const envelope = items => JSON.stringify({ version: 1, items })
function tabs(items) {
  let raw = envelope(items), writes = 0, denied = false
  const queued = []
  const storage = {
    getItem() { if (denied) throw Error('read denied'); return raw },
    setItem(key, value) { writes++; raw = value },
  }
  const make = () => createSavedDestinationsStore(known, { getStorage: () => storage, onPersist: value => queued.push(value) })
  const a = make(), b = make()
  a.hydrate(); b.hydrate()
  return { a, b, queued, raw: () => raw, writes: () => writes,
    replace: value => { raw = value }, deny: () => { denied = true } }
}

test('delayed storage delivery cannot make a sequential fourth save evict the third', () => {
  const initial = [record('maldives', 1), record('cape-town', 2)]
  const f = tabs(initial)
  assert.equal(f.a.save('tokyo', 3), 'saved')
  assert.equal(f.b.save('kyoto', 4), 'limit')
  assert.equal(f.writes(), 1)
  const expected = [...initial, record('tokyo', 3)]
  assert.deepEqual(JSON.parse(f.raw()).items, expected)
  assert.deepEqual(f.b.getSnapshot().items, expected)
  f.b.receive(f.queued[0])
  assert.deepEqual(f.b.getSnapshot().items, JSON.parse(f.raw()).items)
})

test('sequential saves merge current persisted order/months and old events cannot roll either tab back', () => {
  const initial = [record('maldives', 1)]
  const f = tabs(initial)
  assert.equal(f.a.save('tokyo', 3), 'saved')
  assert.equal(f.b.save('kyoto', 4), 'saved')
  const expected = [...initial, record('tokyo', 3), record('kyoto', 4)]
  assert.deepEqual(JSON.parse(f.raw()).items, expected)
  f.b.receive(f.queued[0])
  f.a.receive(f.queued[1])
  f.a.receive(f.queued[0])
  assert.deepEqual(f.a.getSnapshot().items, expected)
  assert.deepEqual(f.b.getSnapshot().items, expected)
  assert.equal(f.writes(), 2, 'notifications never echo a write')
})

test('a queued event payload alone cannot roll back the current persistent list', () => {
  const initial = [record('maldives', 1)]
  const f = tabs(initial)
  const latest = [...initial, record('tokyo', 3)]
  f.replace(envelope(latest))
  f.b.receive(envelope(initial))
  assert.deepEqual(f.b.getSnapshot().items, latest)
  assert.equal(f.writes(), 0)
})

test('a stale duplicate save preserves the first tab original month without another write', () => {
  const f = tabs([])
  f.a.save('tokyo', 3)
  assert.equal(f.b.save('tokyo', 9), 'already-saved')
  assert.deepEqual(f.b.getSnapshot().items, [record('tokyo', 3)])
  assert.equal(f.writes(), 1)
})

test('remove rebases on storage without losing a different tab newly saved place', () => {
  const f = tabs([record('maldives', 1)])
  f.a.save('tokyo', 3)
  f.b.remove('maldives')
  assert.deepEqual(JSON.parse(f.raw()).items, [record('tokyo', 3)])
  f.b.receive(f.queued[0])
  assert.deepEqual(f.b.getSnapshot().items, [record('tokyo', 3)])
})

test('remove and clear revalidate even when the target or list was absent in the stale snapshot', () => {
  for (const action of ['remove', 'clear']) {
    const f = tabs([])
    f.a.save('tokyo', 3)
    if (action === 'remove') f.b.remove('tokyo')
    else f.b.clear()
    assert.deepEqual(JSON.parse(f.raw()).items, [], action)
    f.b.receive(f.queued[0])
    assert.deepEqual(f.b.getSnapshot().items, [], action)
  }
})

test('a read denied after hydration keeps memory usable but never overwrites an unseen list', () => {
  const f = tabs([record('maldives', 1)])
  f.a.save('tokyo', 3)
  const before = f.raw()
  f.deny()
  assert.equal(f.b.save('kyoto', 4), 'saved')
  assert.equal(f.raw(), before)
  assert.equal(f.writes(), 1)
  assert.equal(f.b.getSnapshot().persistence, 'unavailable')
  assert.deepEqual(f.b.getSnapshot().items, [record('maldives', 1), record('kyoto', 4)])
  f.b.receive(f.queued[0])
  assert.deepEqual(f.b.getSnapshot().items, [record('maldives', 1), record('kyoto', 4)])
})

test('invalid or unknown-ID storage discovered before mutation remains untouched; edits are memory-only', () => {
  for (const bad of ['{', envelope([record('unknown', 1)]), '{"version":2,"items":[]}']) {
    const f = tabs([])
    f.replace(bad)
    assert.equal(f.b.save('kyoto', 4), 'saved')
    assert.equal(f.raw(), bad)
    assert.equal(f.writes(), 0)
    assert.equal(f.b.getSnapshot().persistence, 'unavailable')
    assert.equal(f.b.getSnapshot().invalidData, true)
    assert.deepEqual(f.b.getSnapshot().items, [record('kyoto', 4)])
  }
})
