import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const root = new URL('../', import.meta.url)
const expected = ['cape-town', 'kyoto', 'maldives', 'marrakech', 'mexico-city', 'seville', 'tokyo']
const dataText = await readFile(new URL('src/data/practicalGuideNotes.ts', root), 'utf8')
const compiled = ts.transpileModule(dataText, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
const data = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`)
const componentText = await readFile(new URL('src/components/PracticalGuideNotes.tsx', root), 'utf8')
const componentCode = ts.transpileModule(componentText, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
const module = { exports: {} }
new Function('require', 'module', 'exports', componentCode)(name => {
  if (name.includes('practicalGuideNotes')) return data
  if (name.endsWith('.module.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) }
  return require(name)
}, module, module.exports)
const { PracticalGuideNotes } = module.exports

function textOf(note) { return note.sections.map(section => section.body).join(' ') }

test('the first sourced editorial batch is exactly seven existing destination IDs', () => {
  assert.deepEqual(Object.keys(data.PRACTICAL_GUIDE_NOTES).sort(), expected)
})

test('all seven have substantive unique planning, movement, courtesy/access and commitment notes', () => {
  const bodies = []
  for (const id of expected) {
    const note = data.getPracticalGuideNotes(id)
    assert.equal(note.guideId, id)
    assert.equal(note.sections.length, 4, id)
    assert.deepEqual(note.sections.map(section => section.kind), ['short-visit', 'getting-around', 'respect-and-access', 'before-booking'])
    assert.ok(textOf(note).split(/\s+/).length >= 200, `${id}: useful depth`)
    for (const section of note.sections) {
      assert.ok(section.title.trim() && section.body.trim(), id)
      assert.ok(section.sourceIds.length > 0, `${id}: paragraph evidence`)
      assert.equal(new Set(section.sourceIds).size, section.sourceIds.length)
      for (const sourceId of section.sourceIds) assert.ok(note.sources.some(source => source.id === sourceId), `${id}: source ${sourceId}`)
      bodies.push(section.body)
    }
  }
  assert.equal(new Set(bodies).size, bodies.length, 'no interchangeable duplicate paragraphs')
})

test('readable official source labels and real checked dates accompany every enriched guide', () => {
  for (const id of expected) {
    const note = data.getPracticalGuideNotes(id)
    assert.ok(note.sources.length >= 2, id)
    assert.equal(new Set(note.sources.map(source => source.id)).size, note.sources.length)
    for (const source of note.sources) {
      assert.equal(new URL(source.url).protocol, 'https:')
      assert.ok(['www.museofridakahlo.org.mx', 'boletos.museofridakahlo.org.mx', 'kyoto.travel', 'www.visitmorocco.com', 'www.jardinmajorelle.com', 'tickets.jardinmajorelle.com', 'www.gov.uk', 'www.gotokyo.org', 'alcazarsevilla.org', 'visitasevilla.es', 'www.capetown.travel', 'www.tablemountain.net', 'visitmaldives.com', 'transmaldivian.com'].includes(new URL(source.url).hostname), `${id}: official publisher`)
      assert.ok(note.sections.some(section => section.sourceIds.includes(source.id)), `${id}: source must support a section`)
      assert.ok(source.label.length >= 12)
      assert.equal(source.checkedOn, '2026-11-20')
    }
    const html = renderToStaticMarkup(React.createElement(PracticalGuideNotes, { guideId: id }))
    assert.match(html, /data-practical-guide-notes/)
    assert.ok(html.includes(`data-practical-guide-id="${id}"`))
    assert.match(html, /<h2[^>]*>Practical field notes<\/h2>/)
    assert.match(html, /Sources &amp; checks/)
    assert.match(html, /Checked on/)
    assert.match(html, /datetime="2026-11-20"/i)
    for (const source of note.sources) {
      assert.ok(html.includes(`href="${source.url.replaceAll('&', '&amp;')}"`), `${id}: ${source.url}`)
      assert.ok(html.includes(source.label.replaceAll('&', '&amp;')), source.label)
    }
  }
})

test('source disclosure is scoped to these new practical notes, not certification of inherited copy', () => {
  for (const id of expected) {
    const html = renderToStaticMarkup(React.createElement(PracticalGuideNotes, { guideId: id }))
    assert.match(html, /Sources for these practical notes/)
    assert.doesNotMatch(html, /fact.checked|audit|HTTP 200|retriev|evidence manifest/i)
  }
})

test('other guides are not presented as sourced and the component stays independent', () => {
  assert.equal(data.getPracticalGuideNotes('lisbon'), undefined)
  assert.equal(data.getPracticalGuideNotes('__proto__'), undefined)
  assert.equal(data.getPracticalGuideNotes('constructor'), undefined)
  assert.equal(renderToStaticMarkup(React.createElement(PracticalGuideNotes, { guideId: 'lisbon' })), '')
  assert.doesNotMatch(componentText, /getArticleContent|guides\/\[slug\]|use client/)
})

test('specific pitfalls remain repaired in the sourced notes', () => {
  assert.match(textOf(data.getPracticalGuideNotes('kyoto')), /do not eat while walking/i)
  assert.match(textOf(data.getPracticalGuideNotes('tokyo')), /last train/i)
  assert.match(textOf(data.getPracticalGuideNotes('marrakech')), /non-refundable/i)
  assert.match(textOf(data.getPracticalGuideNotes('cape-town')), /bad weather/i)
  assert.match(textOf(data.getPracticalGuideNotes('maldives')), /TMA/)
  assert.match(textOf(data.getPracticalGuideNotes('mexico-city')), /no in-person ticket sales/i)
  assert.match(textOf(data.getPracticalGuideNotes('seville')), /winter/i)
  for (const id of expected) assert.doesNotMatch(textOf(data.getPracticalGuideNotes(id)), /\d+\s*(?:%|USD|EUR)|[$€¥]|guaranteed|nuts.*permitted/i)
})

test('the server guide renders practical notes before downstream flight and supplier tools', async () => {
  const page = await readFile(new URL('src/app/guides/[slug]/page.tsx', root), 'utf8')
  const mount = page.indexOf('<PracticalGuideNotes guideId={guide.id}')
  assert.ok(mount > 0)
  assert.ok(mount < page.indexOf('<FlightSearch'))
  assert.ok(mount < page.indexOf('<PriceComparison'))
  assert.match(page, /href="#practical-field-notes"/)
})
