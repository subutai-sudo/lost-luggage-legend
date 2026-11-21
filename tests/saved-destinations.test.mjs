import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const cache = new Map()
function load(relative) {
  if (cache.has(relative)) return cache.get(relative)
  const file = new URL(`../src/${relative}`, import.meta.url)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText
  const module = { exports: {} }
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file.pathname })(id => {
    if (id.endsWith('.module.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) }
    if (id.startsWith('@/')) return load(`${id.slice(2)}${id.includes('components/') ? '.tsx' : '.ts'}`)
    if (id === './SeasonalReason') return load('components/SeasonalReason.tsx')
    return require(id)
  }, module, module.exports)
  cache.set(relative, module.exports)
  return module.exports
}
const api = () => load('lib/savedDestinations.ts')
const allowed = ['kyoto', 'lisbon', 'bali', 'tokyo']
const envelope = items => JSON.stringify({ version: 1, items })
const plain = value => JSON.parse(JSON.stringify(value))
function fixture(options = {}) {
  let raw = options.raw ?? null
  let reads = 0
  let writes = 0
  const storage = {
    getItem(key) { assert.equal(key, 'lll-saved-destinations-v1'); reads++; if (options.readThrows) throw Error('denied'); return raw },
    setItem(key, value) { assert.equal(key, 'lll-saved-destinations-v1'); writes++; if (options.writeThrows) throw Error('quota'); raw = value },
  }
  const store = api().createSavedDestinationsStore(allowed, {
    getStorage: () => { if (options.accessThrows) throw Error('denied'); return options.missing ? null : storage },
    onPersist: options.onPersist,
  })
  return { store, storage, raw: () => raw, reads: () => reads, writes: () => writes,
    externalUpdate(value) { raw = value; store.receive(value) } }
}

test('storage key and explicit version stay stable', () => {
  assert.equal(api().SAVED_DESTINATIONS_KEY, 'lll-saved-destinations-v1')
  assert.equal(api().MAX_SAVED_DESTINATIONS, 3)
})
test('strict parser preserves allowlisted distinct IDs, exact months and order', () => {
  assert.deepEqual(plain(api().parseSavedDestinations(envelope([{ id: 'bali', month: 12 }, { id: 'kyoto', month: 1 }]), allowed)), [{ id: 'bali', month: 12 }, { id: 'kyoto', month: 1 }])
  assert.deepEqual(plain(api().parseSavedDestinations(null, allowed)), [])
})
const invalid = {
  'malformed JSON': '{', 'legacy array': '[]', 'null JSON': 'null',
  'wrong version': '{"version":2,"items":[]}', 'string version': '{"version":"1","items":[]}',
  'extra envelope key': '{"version":1,"items":[],"x":true}', 'missing items': '{"version":1}',
  'nonarray items': '{"version":1,"items":{}}',
  'unknown ID': envelope([{ id: 'invented', month: 1 }]),
  'unsafe ID': envelope([{ id: '../kyoto', month: 1 }]),
  'duplicate ID with another month': envelope([{ id: 'kyoto', month: 1 }, { id: 'kyoto', month: 2 }]),
  'excess items': envelope(allowed.map(id => ({ id, month: 1 }))),
  'zero month': envelope([{ id: 'kyoto', month: 0 }]),
  'month thirteen': envelope([{ id: 'kyoto', month: 13 }]),
  'fraction month': envelope([{ id: 'kyoto', month: 1.5 }]),
  'string month': envelope([{ id: 'kyoto', month: '1' }]),
  'missing month': envelope([{ id: 'kyoto' }]), 'null item': envelope([null]),
  'extra record key': envelope([{ id: 'kyoto', month: 1, title: 'Injected' }]),
  'oversized payload': `${' '.repeat(4097)}${envelope([])}`,
}
for (const [name, raw] of Object.entries(invalid)) test(`rejects ${name} as a whole, not a partial salvage`, () => {
  assert.equal(api().parseSavedDestinations(raw, allowed), null)
})
test('initialization and server snapshot never access storage; hydration is explicit and idempotent', () => {
  const f = fixture({ raw: envelope([{ id: 'kyoto', month: 3 }]) })
  assert.equal(f.reads(), 0)
  assert.equal(f.store.getSnapshot().persistence, 'pending')
  assert.deepEqual(plain(f.store.getServerSnapshot().items), [])
  f.store.hydrate(); f.store.hydrate()
  assert.equal(f.reads(), 1)
  assert.deepEqual(plain(f.store.getSnapshot().items), [{ id: 'kyoto', month: 3 }])
  assert.deepEqual(plain(f.store.getServerSnapshot().items), [])
  assert.equal(f.writes(), 0)
})
test('save persists original month; duplicate save does not reorder or overwrite it', () => {
  const f = fixture(); f.store.hydrate()
  assert.equal(f.store.save('kyoto', 3), 'saved')
  assert.equal(f.store.save('lisbon', 10), 'saved')
  assert.equal(f.store.save('kyoto', 4), 'already-saved')
  assert.deepEqual(JSON.parse(f.raw()), { version: 1, items: [{ id: 'kyoto', month: 3 }, { id: 'lisbon', month: 10 }] })
  assert.equal(f.writes(), 2)
})
test('fourth distinct save refuses without evicting or writing', () => {
  const f = fixture(); f.store.hydrate()
  for (const id of allowed.slice(0, 3)) assert.equal(f.store.save(id, 7), 'saved')
  const before = f.raw()
  assert.equal(f.store.save('tokyo', 9), 'limit')
  assert.equal(f.raw(), before)
  assert.equal(f.writes(), 3)
})
test('invalid saves and pre-hydration actions fail closed', () => {
  const f = fixture()
  assert.equal(f.store.save('kyoto', 3), 'not-ready')
  f.store.hydrate()
  for (const [id, month] of [['invented', 1], ['kyoto', NaN], ['kyoto', 0], ['kyoto', 13], ['kyoto', 2.5], ['kyoto', '3']]) assert.equal(f.store.save(id, month), 'invalid')
  assert.equal(f.writes(), 0)
})
test('remove, resave and clear preserve insertion order and write an empty versioned envelope', () => {
  const f = fixture(); f.store.hydrate()
  f.store.save('kyoto', 3); f.store.save('lisbon', 10); f.store.remove('kyoto'); f.store.save('kyoto', 4)
  assert.deepEqual(plain(f.store.getSnapshot().items), [{ id: 'lisbon', month: 10 }, { id: 'kyoto', month: 4 }])
  f.store.clear()
  assert.deepEqual(JSON.parse(f.raw()), { version: 1, items: [] })
})
test('reload restores exactly the saved records', () => {
  const a = fixture(); a.store.hydrate(); a.store.save('bali', 8)
  const b = fixture({ raw: a.raw() }); b.store.hydrate()
  assert.deepEqual(plain(b.store.getSnapshot().items), [{ id: 'bali', month: 8 }])
})
for (const failure of ['missing', 'accessThrows', 'readThrows', 'writeThrows']) test(`${failure}: storage failure retains usable memory state`, () => {
  const f = fixture({ [failure]: true }); f.store.hydrate(); f.store.save('kyoto', 3)
  assert.equal(f.store.getSnapshot().persistence, 'unavailable')
  assert.deepEqual(plain(f.store.getSnapshot().items), [{ id: 'kyoto', month: 3 }])
  f.store.remove('kyoto'); assert.equal(f.store.getSnapshot().items.length, 0)
})
test('invalid persisted payload is rejected without an automatic rewrite', () => {
  const f = fixture({ raw: envelope([{ id: 'unknown', month: 1 }]) }); f.store.hydrate()
  assert.equal(f.store.getSnapshot().invalidData, true)
  assert.equal(f.store.getSnapshot().items.length, 0)
  assert.equal(f.writes(), 0)
  assert.equal(f.store.save('kyoto', 3), 'saved')
  assert.equal(f.store.getSnapshot().persistence, 'unavailable')
  assert.equal(f.store.getSnapshot().invalidData, true)
  assert.deepEqual(plain(f.store.getSnapshot().items), [{ id: 'kyoto', month: 3 }])
  assert.equal(f.writes(), 0, 'invalid storage is not replaced by a memory-only edit')
})
test('external updates sync subscribers without echo writes, including clear and invalid payloads', () => {
  const f = fixture(); f.store.hydrate()
  let notifications = 0; const unsubscribe = f.store.subscribe(() => notifications++)
  f.externalUpdate(envelope([{ id: 'lisbon', month: 5 }]))
  assert.deepEqual(plain(f.store.getSnapshot().items), [{ id: 'lisbon', month: 5 }])
  f.externalUpdate(null); assert.equal(f.store.getSnapshot().items.length, 0)
  f.externalUpdate('broken'); assert.equal(f.store.getSnapshot().invalidData, true)
  assert.equal(f.writes(), 0); assert.equal(notifications, 3)
  unsubscribe(); f.externalUpdate(envelope([])); assert.equal(notifications, 3)
})
test('successful writes announce same-document updates; denied writes do not announce false persistence', () => {
  const events = []; const a = fixture({ onPersist: raw => events.push(raw) })
  a.store.hydrate(); a.store.save('kyoto', 3)
  assert.deepEqual(events, [envelope([{ id: 'kyoto', month: 3 }])])
  const b = fixture(); b.store.hydrate(); b.externalUpdate(events[0])
  assert.deepEqual(plain(b.store.getSnapshot().items), [{ id: 'kyoto', month: 3 }])
  const denied = fixture({ writeThrows: true, onPersist: raw => events.push(raw) })
  denied.store.hydrate(); denied.store.save('bali', 8); assert.equal(events.length, 1)
})
test('snapshots cannot be mutated by consumers and no-op reads retain identity', () => {
  const f = fixture(); f.store.hydrate(); f.store.save('kyoto', 3)
  const snapshot = f.store.getSnapshot(); assert.equal(snapshot, f.store.getSnapshot())
  assert.throws(() => snapshot.items.push({ id: 'tokyo', month: 4 }))
  assert.throws(() => { snapshot.items[0].month = 9 })
})
const guides = allowed.map(id => ({ id, slug: id, title: id === 'kyoto' ? 'Kyoto' : id === 'lisbon' ? 'Lisbon' : id, subtitle: '', excerpt: 'Editorial excerpt', image: '', months: [3, 10] }))
const catalog = {
  sources: [{ id: 'official', title: 'Official seasonal source', publisher: 'Publisher', url: 'https://example.org/seasonal', checkedAt: '2026-04-01' }],
  notes: [
    { destinationId: 'kyoto', month: 3, why: 'Kyoto March sourced reason', tradeoff: 'Kyoto March sourced trade-off', sourceIds: ['official'] },
    { destinationId: 'lisbon', month: 10, why: 'Lisbon October sourced reason', tradeoff: 'Lisbon October sourced trade-off', sourceIds: ['official'] },
  ],
}
test('server render is empty and hydration-safe, with explicit browser-only disclosure', () => {
  const { SavedDestinationsProvider, SavedDestinationsPanel, SaveDestinationButton } = load('components/SavedDestinations.tsx')
  const markup = renderToStaticMarkup(React.createElement(SavedDestinationsProvider, { guides },
    React.createElement(React.Fragment, null,
      React.createElement(SaveDestinationButton, { destinationId: 'kyoto', title: 'Kyoto', month: 3 }),
      React.createElement(SavedDestinationsPanel, { guides, seasonalCatalog: catalog }))))
  assert.match(markup, /aria-label="Saved destinations"/)
  assert.match(markup, /Your saved places/)
  assert.match(markup, /Saved on this browser only\. No account required\./)
  assert.match(markup, /aria-label="Save Kyoto"/)
  assert.match(markup, /aria-pressed="false"/)
  assert.match(markup, /role="status"/)
  assert.match(markup, /disabled=""[^>]*>Compare saved places/)
  assert.doesNotMatch(markup, /data-destination-comparison/)
})
test('comparison renders exact saved months and real reasons, trade-offs and source links', () => {
  const { SavedDestinationComparison } = load('components/SavedDestinations.tsx')
  const markup = renderToStaticMarkup(React.createElement(SavedDestinationComparison, { guides, seasonalCatalog: catalog, items: [{ id: 'kyoto', month: 3 }, { id: 'lisbon', month: 10 }] }))
  for (const text of ['March', 'October', 'Kyoto March sourced reason', 'Kyoto March sourced trade-off', 'Lisbon October sourced reason', 'Lisbon October sourced trade-off', 'Sources &amp; checks', 'https://example.org/seasonal', '/guides/kyoto?month=3', '/guides/lisbon?month=10']) assert.ok(markup.includes(text), text)
  assert.match(markup, /data-destination-comparison/)
  assert.doesNotMatch(markup, /<table|[?&](?:from|departure|checkin|date)=/)
})
test('comparison never fabricates missing destination-month evidence', () => {
  const { SavedDestinationComparison } = load('components/SavedDestinations.tsx')
  const markup = renderToStaticMarkup(React.createElement(SavedDestinationComparison, { guides, seasonalCatalog: catalog, items: [{ id: 'kyoto', month: 4 }, { id: 'lisbon', month: 10 }] }))
  assert.match(markup, /Seasonal context is not available for this saved month/)
  assert.doesNotMatch(markup, /Kyoto March sourced reason|Editorial excerpt/)
})
