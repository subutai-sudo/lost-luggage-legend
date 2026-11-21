import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root), 'utf8')
const compile = (source, module = ts.ModuleKind.ESNext) => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText
const core = await import(`data:text/javascript;base64,${Buffer.from(compile(await read('src/lib/tripContext.ts'))).toString('base64')}`)
const dates = await import(`data:text/javascript;base64,${Buffer.from(compile(await read('src/lib/bookingDates.ts'))).toString('base64')}`)

function sourceArray(source, name) {
  const ast = ts.createSourceFile('inventory.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const declaration = ast.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.getText(ast) === name)
  assert.ok(declaration?.initializer && ts.isArrayLiteralExpression(declaration.initializer))
  return declaration.initializer.elements.map(node => Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).filter(p => ts.isStringLiteral(p.initializer)).map(p => [p.name.getText(ast).replace(/^['"]|['"]$/g, ''), p.initializer.text])))
}
const catalog = sourceArray(await read('src/data/destinationGuides.ts'), 'DESTINATION_GUIDES')
const airports = sourceArray(await read('src/components/ComparePricesSection.tsx'), 'AIRPORTS')

for (const [path, expectedCount, expectedHash] of [
  ['src/components/PriceComparison.tsx', 5, 'cfcb43b8e5fcb30545d2ecfa6258442e7f0540282225b49eb92a0ea1fd85e938'],
  ['src/components/ComparePricesSection.tsx', 11, '0f184705fd0f9f85dff7607c16f3f7351a12de5e9310791a0a6a3fb9c6583e71'],
]) {
  test(`${path}: supplier URL builders and URL derivation preserve baseline affiliate semantics exactly`, async () => {
    // Independently frozen from origin/main 3d4af2c before changes; includes the
    // original flight-form fallback, but not the separately built context URL.
    const ast = ts.createSourceFile(path, await read(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const functions = []
    function walk(node) {
      if (ts.isPropertyAssignment(node) && ['url', 'buildUrl'].includes(node.name.getText(ast))) functions.push(node.initializer.getText(ast))
      ts.forEachChild(node, walk)
    }
    walk(ast)
    assert.equal(functions.length, expectedCount)
    assert.equal(createHash('sha256').update(JSON.stringify(functions)).digest('hex'), expectedHash)
  })
}

test('slim trip catalog covers every known slug and title exactly, without raw guide imports', async () => {
  assert.deepEqual(core.TRIP_DESTINATIONS, catalog.map(({ slug, title }) => ({ slug, title })))
  assert.equal(new Set(core.TRIP_DESTINATIONS.map(d => d.slug)).size, catalog.length)
  assert.doesNotMatch(await read('src/lib/tripContext.ts'), /import .*destinationGuides/)
})

test('all catalog destinations survive guide → planner with all twelve months', () => {
  for (const { slug, title } of catalog) for (let month = 1; month <= 12; month++) {
    assert.equal(core.buildGuideHref(slug, month), `/guides/${slug}?month=${month}`)
    const href = core.buildPlanHref(slug, month)
    assert.equal(href, `/plan?destination=${slug}&month=${month}#compare-prices`)
    assert.deepEqual(core.readTripContext(new URL(href, 'https://example.test').search), { destination: { slug, title }, month })
  }
})

test('month parsing rejects missing, duplicate and noncanonical values independently', () => {
  for (const search of ['', '?month=', '?month=0', '?month=13', '?month=01', '?month=1.0', '?month=+1', '?month=1e1', '?month=%201', '?month=1&month=1', '?month=1&month=2', '?month=%3Cscript%3E']) {
    assert.equal(core.readTripContext(search).month, null, search)
    assert.equal(core.readTripContext(`${search || '?'}${search ? '&' : ''}destination=maldives`).destination.slug, 'maldives')
  }
})

test('destinations reject duplicate, unknown, malformed and unsafe values without normalization', () => {
  for (const destination of ['', 'Maldives', 'maldives/', '../maldives', '//evil.example', 'https://evil.example', '<img src=x>', '__proto__', 'constructor', ' maldives']) {
    assert.equal(core.readTripContext(`?destination=${encodeURIComponent(destination)}&month=4`).destination, null, destination)
  }
  for (const search of ['?destination=maldives&destination=tokyo', '?destination=maldives&destination=maldives']) assert.equal(core.readTripContext(search).destination, null)
  assert.equal(core.buildPlanHref('//evil.example', 4), '/plan?month=4#compare-prices')
  assert.equal(core.buildGuideHref('../x', 4), '/guides?month=4')
})

test('native contextual links allow only known local routes and never forward arbitrary query data', () => {
  assert.equal(core.withTripMonth('/guides/tokyo', 4), '/guides/tokyo?month=4')
  assert.equal(core.withTripMonth('/', 4), '/?month=4')
  assert.equal(core.withTripMonth('/guides', 4), '/guides?month=4')
  assert.equal(core.withTripMonth('/plan?destination=maldives&tracking=no#compare-prices', 4), '/plan?destination=maldives&month=4#compare-prices')
  assert.equal(core.withTripMonth('/guides/tokyo?month=3', null), '/guides/tokyo')
  for (const href of ['//evil.example', 'https://evil.example', 'javascript:alert(1)', '/guides/unknown', '/guides/../plan', '/plan#unexpected']) assert.equal(core.withTripMonth(href, 4), '/?month=4')
})

test('planner seeds known destinations only and never invents origin or dates', () => {
  for (const { slug, title } of catalog) {
    const seed = core.plannerDestination(core.readTripContext(`?destination=${slug}&month=4`), airports)
    assert.equal(seed.hotelDestination, title)
    assert.equal(seed.origin, '')
    assert.equal(seed.departDate, '')
    assert.equal(seed.returnDate, '')
    for (const code of seed.airportCodes) assert.ok(airports.some(a => a.code === code))
  }
  assert.deepEqual(core.plannerDestination(core.readTripContext(''), airports).airportCodes, [])
})

test('Maldives explicitly uses the existing Male MLE gateway, not a fabricated code', async () => {
  const seed = core.plannerDestination(core.readTripContext('?destination=maldives'), airports)
  assert.deepEqual(seed.airportCodes, ['MLE'])
  assert.match(seed.flightDestination, /Male.*MLE/)
  assert.match(seed.gatewayNote, /gateway.*Maldives/i)
  const existing = await read('src/components/FlightSearch.tsx')
  assert.match(existing, /maldives: 'MLE'/)
  assert.match(existing, /iata: 'MLE', name: 'Velana International', city: 'Male', country: 'Maldives'/)
})

test('broad regions and multi-airport cities request selection instead of silently picking the first airport', () => {
  for (const slug of ['patagonia', 'maasai-mara', 'amalfi-coast', 'iceland', 'kyoto', 'tokyo', 'london']) {
    const seed = core.plannerDestination(core.readTripContext(`?destination=${slug}`), airports)
    assert.deepEqual(seed.airportCodes, [], slug)
    assert.match(seed.gatewayNote, /choose.*airport/i)
  }
  const lisbon = core.plannerDestination(core.readTripContext('?destination=lisbon'), airports)
  assert.deepEqual(lisbon.airportCodes, ['LIS'])
})

// A deterministic hook-level component harness: no browser/build/server needed.
// It exercises the shipped handlers and effects, not a duplicate form model.
function componentHarness(source, imports = {}) {
  const states = [], effects = [], refs = []
  let cursor = 0, pending = [], changed = false
  const hooks = {
    useState(initial) {
      const index = cursor++
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial
      return [states[index], next => { const value = typeof next === 'function' ? next(states[index]) : next; if (!Object.is(value, states[index])) { states[index] = value; changed = true } }]
    },
    useRef(initial) { const index = cursor++; return refs[index] ||= { current: initial } },
    useEffect(effect, deps) {
      const index = cursor++
      if (!effects[index] || !deps || deps.some((dep, i) => !Object.is(dep, effects[index].deps?.[i]))) pending.push(() => { effects[index]?.cleanup?.(); effects[index] = { deps, cleanup: effect() } })
    },
    useMemo(fn) { cursor++; return fn() },
    useCallback(fn) { cursor++; return fn },
  }
  const jsx = (type, props, key) => ({ type, props: props || {}, key })
  const exports = {}
  const mocks = {
    react: { ...hooks, default: hooks, Suspense: 'Suspense' },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    '@/components/CurrencyProvider': { useCurrency: () => ({ currency: 'USD' }) },
    '@/lib/tripContext': core,
    '@/lib/bookingDates': { ...dates, localDateString: () => '2030-01-10' },
    './TripContextLink': { TripContextSearchObserver: 'QueryObserver' },
    './TripContextNote': { TripContextNote: 'ContextNote' },
    ...imports,
  }
  new Function('require', 'exports', compile(source, ts.ModuleKind.CommonJS))(name => name.endsWith('.module.css') ? {} : (mocks[name] ?? require(name)), exports)
  return { exports, render(name, props = {}, flush = true) {
    let tree
    do { changed = false; cursor = 0; pending = []; tree = (typeof name === 'function' ? name : exports[name])(props); if (flush) pending.forEach(effect => effect()) } while (changed)
    return tree
  } }
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return []
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)]
}
const byId = (tree, id) => nodes(tree).find(node => node.props.id === id)
const button = (tree, label) => nodes(tree).find(node => node.type === 'button' && [node.props.children].flat(Infinity).includes(label))

test('planner query changes seed destinations; edits survive mode switches; new query clears stale supplier state', async () => {
  const previousWindow = globalThis.window, previousDocument = globalThis.document
  globalThis.window = { setInterval: () => 1, clearInterval() {} }
  globalThis.document = { addEventListener() {}, removeEventListener() {} }
  try {
    const harness = componentHarness(await read('src/components/ComparePricesSection.tsx'))
    let tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'flight-origin').props.value, '')
    const observer = nodes(tree).find(n => n.type === 'QueryObserver')
    assert.ok(observer, 'query observer integrates the real planner')
    observer.props.onChange('?destination=maldives&month=4')
    tree = harness.render('ComparePricesSection')
    assert.match(byId(tree, 'flight-destination').props.value, /Male.*MLE/)
    assert.equal(byId(tree, 'flight-origin').props.value, '')
    assert.equal(byId(tree, 'flight-depart').props.value, '')
    assert.equal(byId(tree, 'flight-return').props.value, '')
    byId(tree, 'flight-destination').props.onChange({ target: { value: 'My editable flight' } })
    button(tree, 'Hotels').props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'hotel-destination').props.value, 'Maldives')
    byId(tree, 'hotel-destination').props.onChange({ target: { value: 'My editable hotel' } })
    button(tree, 'Flights').props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'flight-destination').props.value, 'My editable flight')
    button(tree, 'Hotels').props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'hotel-destination').props.value, 'My editable hotel')
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('?destination=tokyo&month=10')
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'hotel-destination').props.value, 'Tokyo')
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('?destination=tokyo&month=10&month=11')
    tree = harness.render('ComparePricesSection')
    assert.equal(nodes(tree).find(n => n.type === 'ContextNote').props.context.month, null)
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('')
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'hotel-destination').props.value, '')
  } finally { globalThis.window = previousWindow; globalThis.document = previousDocument }
})

test('changing Maldives arrival to Lisbon keeps the original idea separate from the selected search airport', async () => {
  const previousWindow = globalThis.window, previousDocument = globalThis.document
  globalThis.window = { setInterval: () => 1, clearInterval() {} }
  globalThis.document = { addEventListener() {}, removeEventListener() {} }
  try {
    const harness = componentHarness(await read('src/components/ComparePricesSection.tsx'))
    let tree = harness.render('ComparePricesSection')
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('?destination=maldives&month=4')
    tree = harness.render('ComparePricesSection')
    const note = () => nodes(tree).find(n => n.type === 'ContextNote').props
    assert.match(note().gatewayNote, /MLE.*gateway.*Maldives/)
    byId(tree, 'flight-destination').props.onChange({ target: { value: 'Lisbon' } })
    tree = harness.render('ComparePricesSection')
    assert.match(note().gatewayNote, /No airport has been selected/)
    const suggestion = nodes(tree).find(n => n.type === 'button' && n.props.onMouseDown)
    assert.ok(suggestion, 'the native Lisbon suggestion is present')
    suggestion.props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'flight-destination').props.value, 'Lisbon (LIS)')
    assert.equal(note().context.destination.title, 'Maldives')
    assert.equal(note().context.month, 4)
    assert.match(note().gatewayNote, /Lisbon.*LIS.*selected (?:flight )?arrival/i)
    assert.match(note().gatewayNote, /Maldives.*inspiration only/i)
    assert.doesNotMatch(note().gatewayNote, /gateway|onward transfers/i)
    // Switching modes or changing only the reminder month must not relabel LIS.
    button(tree, 'Hotels').props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'hotel-destination').props.value, 'Maldives')
    button(tree, 'Flights').props.onClick()
    tree = harness.render('ComparePricesSection')
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('?destination=maldives&month=10')
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'flight-destination').props.value, 'Lisbon (LIS)')
    assert.doesNotMatch(note().gatewayNote, /gateway|onward transfers/i)
    // A new destination context legitimately reseeds the known relationship.
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('?destination=lisbon&month=10')
    tree = harness.render('ComparePricesSection')
    assert.match(note().gatewayNote, /LIS.*gateway.*Lisbon/)
  } finally { globalThis.window = previousWindow; globalThis.document = previousDocument }
})

test('guide flight CTA includes allowlisted guide slug and hydrated validated month', async () => {
  const harness = componentHarness(await read('src/components/PriceComparison.tsx'), { 'next/link': { default: 'NextLink' } })
  let tree = harness.render('PriceComparison', { guide: { slug: 'maldives', title: 'Maldives' }, destination: 'Maldives' })
  assert.ok(nodes(tree).some(n => n.props.href === '/plan?destination=maldives#compare-prices'))
  const observer = nodes(tree).find(n => n.type === 'QueryObserver')
  assert.ok(observer)
  observer.props.onChange('?month=4')
  tree = harness.render('PriceComparison', { guide: { slug: 'maldives', title: 'Maldives' }, destination: 'Maldives' })
  assert.ok(nodes(tree).some(n => n.props.href === '/plan?destination=maldives&month=4#compare-prices'))
  assert.doesNotMatch(JSON.stringify(tree), /Compare All Sites|Best price across|Real prices from each site/)
})

test('native links have safe no-JS defaults; observer callbacks update only validated context', async () => {
  const harness = componentHarness(await read('src/components/TripContextLink.tsx'), { 'next/navigation': { useSearchParams: () => new URLSearchParams('month=4') } })
  let tree = harness.render('TripContextLink', { href: '/guides/tokyo', children: 'Tokyo' }, false)
  assert.equal(tree.props.href, '/guides/tokyo')
  const observer = nodes(tree).find(n => n.type === harness.exports.TripContextSearchObserver)
  observer.props.onChange('?month=4')
  tree = harness.render('TripContextLink', { href: '/guides/tokyo', children: 'Tokyo' })
  assert.equal(tree.props.href, '/guides/tokyo?month=4')
  nodes(tree).find(n => n.type === harness.exports.TripContextSearchObserver).props.onChange('?month=4&month=5')
  tree = harness.render('TripContextLink', { href: '/guides/tokyo', children: 'Tokyo' })
  assert.equal(tree.props.href, '/guides/tokyo')
  assert.equal(tree.type, 'a')
})

test('Next query observer effects subscribe to changed search params, including back/forward values', async () => {
  let search = 'month=4'
  const seen = []
  const onChange = value => seen.push(value)
  const harness = componentHarness(await read('src/components/TripContextLink.tsx'), { 'next/navigation': { useSearchParams: () => new URLSearchParams(search) } })
  const boundary = harness.render('TripContextSearchObserver', { onChange })
  assert.equal(boundary.type, 'Suspense')
  const observer = boundary.props.children.type
  harness.render(observer, { onChange })
  search = 'month=10'
  harness.render(observer, { onChange })
  search = 'month=4'
  harness.render(observer, { onChange })
  harness.render(observer, { onChange })
  assert.deepEqual(seen, ['month=4', 'month=10', 'month=4'])
})

test('editing an airport or date after search removes invalid supplier links using real local-calendar validation', async () => {
  const previousWindow = globalThis.window, previousDocument = globalThis.document
  globalThis.window = { setInterval: () => 1, clearInterval() {} }
  globalThis.document = { addEventListener() {}, removeEventListener() {} }
  try {
    const harness = componentHarness(await read('src/components/ComparePricesSection.tsx'))
    let tree = harness.render('ComparePricesSection')
    nodes(tree).find(n => n.type === 'QueryObserver').props.onChange('?destination=maldives&month=4')
    tree = harness.render('ComparePricesSection')
    byId(tree, 'flight-origin').props.onChange({ target: { value: 'Lisbon' } })
    tree = harness.render('ComparePricesSection')
    const originSuggestion = nodes(tree).find(n => n.type === 'button' && n.props.onMouseDown)
    assert.ok(originSuggestion)
    originSuggestion.props.onClick()
    byId(tree, 'flight-depart').props.onChange({ target: { value: '2030-04-20' } })
    tree = harness.render('ComparePricesSection')
    const search = nodes(tree).find(n => n.type === 'button' && n.props.disabled === false)
    assert.ok(search)
    search.props.onClick()
    tree = harness.render('ComparePricesSection')
    const suppliers = value => nodes(value).filter(n => n.type === 'a' && n.props.target === '_blank')
    assert.equal(suppliers(tree).length, 3)
    assert.match(suppliers(tree)[0].props.href, /LIS-MLE\/2030-04-20/)
    byId(tree, 'flight-return').props.onChange({ target: { value: '2030-04-19' } })
    tree = harness.render('ComparePricesSection')
    assert.equal(suppliers(tree).length, 0)
    assert.match(JSON.stringify(tree), /Return cannot be before departure/)
    byId(tree, 'flight-return').props.onChange({ target: { value: '2030-04-20' } })
    tree = harness.render('ComparePricesSection')
    assert.equal(suppliers(tree).length, 3, 'same-day return flights remain supported')
    byId(tree, 'flight-origin').props.onChange({ target: { value: 'Unselected edit' } })
    tree = harness.render('ComparePricesSection')
    assert.equal(suppliers(tree).length, 0, 'an edited origin is not the previously selected airport')
    button(tree, 'Hotels').props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(byId(tree, 'hotel-destination').props.value, 'Maldives')
    assert.equal(byId(tree, 'hotel-checkin').props.value, '2030-04-20')
    assert.equal(byId(tree, 'hotel-checkout').props.value, '2030-04-20')
    assert.match(JSON.stringify(tree), /Check-out must be after check-in/)
    byId(tree, 'hotel-checkout').props.onChange({ target: { value: '2030-04-21' } })
    tree = harness.render('ComparePricesSection')
    nodes(tree).find(n => n.type === 'button' && n.props.disabled === false).props.onClick()
    tree = harness.render('ComparePricesSection')
    assert.equal(suppliers(tree).length, 6)
    byId(tree, 'hotel-checkin').props.onChange({ target: { value: '2030-04-22' } })
    tree = harness.render('ComparePricesSection')
    assert.equal(suppliers(tree).length, 0)
  } finally { globalThis.window = previousWindow; globalThis.document = previousDocument }
})

test('isolated query Suspense leaves the real native link and blank planner form in server HTML', async () => {
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const cache = new Map()
  const pendingQuery = new Promise(() => {})
  async function load(path) {
    if (cache.has(path)) return cache.get(path)
    const exports = {}
    const mocks = {
      react: React,
      'react/jsx-runtime': require('react/jsx-runtime'),
      'next/navigation': { useSearchParams() { throw pendingQuery } },
      'next/link': ({ children, ...props }) => React.createElement('a', props, children),
      '@/lib/tripContext': core,
      '@/lib/bookingDates': dates,
      '@/components/CurrencyProvider': { useCurrency: () => ({ currency: 'USD' }) },
    }
    if (!path.endsWith('TripContextLink.tsx')) mocks['./TripContextLink'] = await load('src/components/TripContextLink.tsx')
    if (path.endsWith('ComparePricesSection.tsx')) mocks['./TripContextNote'] = await load('src/components/TripContextNote.tsx')
    new Function('require', 'exports', compile(await read(path), ts.ModuleKind.CommonJS))(name => name.endsWith('.module.css') ? {} : (mocks[name] ?? require(name)), exports)
    cache.set(path, exports)
    return exports
  }
  const { TripContextLink } = await load('src/components/TripContextLink.tsx')
  assert.equal(renderToStaticMarkup(React.createElement(TripContextLink, { href: '/guides/tokyo' }, 'Tokyo')), '<a href="/guides/tokyo">Tokyo</a>')
  const { ComparePricesSection } = await load('src/components/ComparePricesSection.tsx')
  const html = renderToStaticMarkup(React.createElement(ComparePricesSection))
  for (const id of ['flight-origin', 'flight-destination', 'flight-depart', 'flight-return']) {
    assert.match(html, new RegExp(`<input[^>]*id="${id}"[^>]*value=""`))
  }
  assert.match(html, /<section id="compare-prices"/)
  assert.doesNotMatch(html, /data-trip-context/)
  const { PriceComparison } = await load('src/components/PriceComparison.tsx')
  const guideHTML = renderToStaticMarkup(React.createElement(PriceComparison, { guide: { slug: 'maldives', title: 'Maldives' }, destination: 'Maldives' }))
  assert.match(guideHTML, /href="\/plan\?destination=maldives#compare-prices"/)
})

test('context note is absent without context and a reminder, not fabricated dates, with context', async () => {
  const harness = componentHarness(await read('src/components/TripContextNote.tsx'))
  assert.equal(harness.render('TripContextNote', { context: core.readTripContext('') }), null)
  const tree = harness.render('TripContextNote', { context: core.readTripContext('?destination=maldives&month=4') })
  const text = JSON.stringify(tree)
  assert.match(text, /Maldives/)
  assert.match(text, /April/)
  assert.match(text, /exact dates/i)
  assert.doesNotMatch(text, /20\d\d|dangerouslySetInnerHTML/)
})
