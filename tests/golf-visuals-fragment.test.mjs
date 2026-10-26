import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const source = await readFile(new URL('../src/components/GolfVisualsFragment.tsx', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
function mount({ hash = '#course-visuals', readyState = 'complete', missing = false } = {}) {
  let cleanup, resolveFonts
  const listeners = new Map(), frames = new Map(), calls = []
  const window = {
    location: { hash },
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type, fn) => { if (listeners.get(type) === fn) listeners.delete(type) },
  }
  const target = { focus: options => calls.push(['focus', options]), scrollIntoView: options => calls.push(['scroll', options]) }
  const document = { readyState, fonts: { ready: new Promise(resolve => { resolveFonts = resolve }) }, getElementById: id => { assert.equal(id, 'course-visuals'); return missing ? null : target } }
  let id = 0
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, require: name => { assert.equal(name, 'react'); return { useEffect: fn => { cleanup = fn() } } },
    window, document,
    requestAnimationFrame: fn => { frames.set(++id, fn); return id },
    cancelAnimationFrame: id => frames.delete(id),
  })
  assert.equal(exports.GolfVisualsFragment(), null)
  return {
    calls, window, listeners, frames, cleanup: () => cleanup(),
    settle: async () => { resolveFonts(); await Promise.resolve() },
    paint: () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()) },
    event: type => listeners.get(type)?.(),
  }
}

for (const hash of ['', '#playing-notes', '#course-visuals-heading', '#COURSE-VISUALS']) {
  test(`fragment helper never scrolls or autofocuses for ${hash || 'a normal guide URL'}`, async () => {
    const h = mount({ hash }); await h.settle(); h.paint()
    assert.equal(h.frames.size, 0); assert.deepEqual(h.calls, [])
    h.event('hashchange'); await h.settle(); h.paint()
    assert.deepEqual(h.calls, []); h.cleanup()
  })
}
test('cold fragment waits for document load, fonts and a frame, then focuses without implicit scrolling', async () => {
  const h = mount({ readyState: 'loading' })
  await h.settle(); h.paint(); assert.deepEqual(h.calls, [])
  h.event('load'); await h.settle(); assert.deepEqual(h.calls, [])
  h.paint()
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls)), [['focus', { preventScroll: true }], ['scroll', { behavior: 'instant', block: 'start' }]])
  h.cleanup()
})
test('same-page hashchange reveals only the exact visuals destination', async () => {
  const h = mount({ hash: '' }); await h.settle(); h.paint()
  h.window.location.hash = '#course-visuals'; h.event('hashchange'); await h.settle(); h.paint()
  assert.equal(h.calls.length, 2)
  h.window.location.hash = '#sources'; h.event('hashchange'); await h.settle(); h.paint()
  assert.equal(h.calls.length, 2); h.cleanup()
})
test('changing the hash during either pending fonts or pending frame cancels stale focus', async () => {
  for (const afterFonts of [false, true]) {
    const h = mount()
    if (afterFonts) await h.settle()
    h.window.location.hash = '#sources'
    await h.settle(); h.paint(); assert.deepEqual(h.calls, []); h.cleanup()
  }
})
test('unmount cancels listeners and pending frame or font work', async () => {
  for (const afterFonts of [false, true]) {
    const h = mount()
    if (afterFonts) await h.settle()
    h.cleanup(); await h.settle(); h.paint()
    assert.equal(h.listeners.size, 0); assert.equal(h.frames.size, 0); assert.deepEqual(h.calls, [])
  }
})
test('missing target is harmless; repeated events coalesce to one frame', async () => {
  const missing = mount({ missing: true }); await missing.settle(); missing.paint(); assert.deepEqual(missing.calls, []); missing.cleanup()
  const h = mount(); h.event('hashchange'); h.event('hashchange'); await h.settle()
  assert.equal(h.frames.size, 1); h.paint(); assert.equal(h.calls.length, 2); h.cleanup()
})
