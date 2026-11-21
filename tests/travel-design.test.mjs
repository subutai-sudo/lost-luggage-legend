import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
function component(name) {
  const source = read(`src/components/${name}.tsx`)
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const module = { exports: {} }
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`)(id => {
    if (id.endsWith('.module.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) }
    if (id === '@/components/AviationMark' || id === './AviationMark') return component('AviationMark')
    if (id === 'next/link') return { default: ({ children, ...props }) => React.createElement('a', props, children) }
    if (id === 'next/image') return { default: ({ fill, sizes, fetchPriority, ...props }) => React.createElement('img', props) }
    if (id === '@/components/Navbar') return { Navbar: () => React.createElement('nav', { 'data-native-nav': true }) }
    if (id === '@/components/NewsletterSignup') return { NewsletterSignup: () => React.createElement('form', { 'data-newsletter': true }) }
    if (id === '@/components/SeasonalReason') return { SeasonalReason: ({ destinationId, month }) => React.createElement('div', { 'data-note': destinationId, 'data-note-month': month }, 'Sources & checks') }
    if (id === '@/components/SavedDestinations') return {
      SavedDestinationsProvider: ({ children }) => React.createElement(React.Fragment, null, children),
      SaveDestinationButton: ({ destinationId, month }) => React.createElement('button', { 'data-save': destinationId, 'data-save-month': month }, 'Save'),
      SavedDestinationsPanel: () => React.createElement('section', { 'data-saved-panel': true }),
    }
    if (id === '@/lib/goldilocksDiscovery') return {
      MONTH_NAMES: months, discoveryImage: image => image, readTravelMonth: () => 4,
      getMonthPreviews: guides => guides,
      getMonthSelection: guides => ({ featured: guides[0], shortlist: guides.slice(0, 6), total: guides.length }),
    }
    return require(id)
  }, module, module.exports)
  return module.exports
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const guides = months.map((_, index) => ({ id: `place-${index}`, slug: `place-${index}`, title: `Destination ${index}`, subtitle: 'Destination region', image: `/photo-${index}.jpg`, excerpt: 'Editorial text' }))

test('original aviation marks are decorative, inert SVGs without external assets or invented route data', () => {
  const { AviationMark } = component('AviationMark')
  for (const variant of ['plane', 'flight-path']) {
    const markup = renderToStaticMarkup(React.createElement(AviationMark, { variant, className: 'test-mark' }))
    assert.match(markup, /<svg[^>]*aria-hidden="true"/)
    assert.match(markup, /focusable="false"/)
    assert.match(markup, /pointer-events="none"/)
    assert.match(markup, /<path/)
    assert.doesNotMatch(markup, /<image|<text|https?:|tabindex|role="img"/)
  }
})

test('shared travel theme is a scoped content wrapper, not a replacement for navigation or page semantics', () => {
  const { TravelTheme } = component('TravelTheme')
  const markup = renderToStaticMarkup(React.createElement(TravelTheme, { className: 'host' }, React.createElement('main', null, 'Existing page')))
  assert.match(markup, /data-travel-theme/)
  assert.match(markup, /data-design-edition="travel"/)
  assert.match(markup, /class="[^"]*host/)
  assert.match(markup, /<main>Existing page<\/main>/)
  assert.doesNotMatch(markup, /<nav|<h1/)
})

test('aviation home retains twelve native month buttons, six guide/save pairs, source notes and month URLs', () => {
  const { GoldilocksHome } = component('GoldilocksHome')
  const markup = renderToStaticMarkup(React.createElement(GoldilocksHome, { guides, initialMonth: 4, year: 2026, seasonalCatalog: {} }))
  assert.match(markup.replace(/<br\s*\/?\s*>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' '), /Take the window seat\./)
  assert.match(markup, /data-design-edition="travel"/)
  assert.match(markup, /data-aircraft-window/)
  assert.match(markup, /data-window-well[\s\S]*data-hero-image/)
  assert.match(markup, /data-window-sill[^>]*aria-hidden="true"/)
  assert.match(markup, /Editorial travel inspiration/)
  assert.match(markup, /Not a booking/)
  assert.match(markup, /data-travel-ticket/)
  assert.equal((markup.match(/data-month="\d+"/g) || []).length, 12)
  assert.equal((markup.match(/data-save="place-/g) || []).length, 6)
  assert.equal((markup.match(/data-save-month="4"/g) || []).length, 6)
  assert.equal((markup.match(/data-note-month="4"/g) || []).length, 6)
  for (let index = 0; index < 6; index++) assert.match(markup, new RegExp(`href="/guides/place-${index}\\?month=4"`))
  assert.match(markup, /data-feature-title="true">Destination 0/)
  assert.match(markup, /Explore the guide/)
  assert.match(markup, /data-saved-panel/)
  assert.match(markup, /href="#month-picker"/)
  assert.match(markup, /<dialog/)
  assert.match(markup, /Not live travel conditions/)
  assert.match(markup, /data-hero-scene[\s\S]*<\/section><div class="calendarBand" data-calendar-band/)
})

test('scoped theme and native-control contracts include dark forms, focus and reduced motion', () => {
  const theme = read('src/components/TravelTheme.module.css')
  const home = read('src/components/GoldilocksHome.module.css')
  assert.match(theme, /:global\(\.dark\) \.root/)
  assert.match(theme, /color-scheme: dark/)
  assert.match(theme, /height: 44px/)
  assert.match(theme, /focus-visible/)
  assert.match(theme, /prefers-reduced-motion/)
  assert.match(home, /data-seasonal-note/)
  assert.match(home, /font-size: 13px/)
  assert.match(home, /prefers-reduced-motion/)
})
