import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import ts from 'typescript'
import postcss from 'postcss'

// Pure render tests: no server, browser, build or network. Framework-only stubs;
// the real selector, seasonal reasons, credits and decorative SVG execute.
const root = new URL('../', import.meta.url).pathname
const read = path => readFile(resolve(root, path), 'utf8')
const json = async path => JSON.parse(await read(path))
const inline = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const stubs = {
  react: 'export const useEffect=()=>{}; export const useMemo=fn=>fn(); export const useState=value=>[value,()=>{}]',
  'react/jsx-runtime': 'export const jsx=(type,props)=>typeof type==="function"?type(props):({type,props});export const jsxs=jsx;',
  'next/image': 'export default "Image"', 'next/link': 'export default "Link"',
  '@/components/Navbar': 'export const Navbar="Navbar"',
  '@/components/NewsletterSignup': 'export const NewsletterSignup="NewsletterSignup"',
}
const cache = new Map()
async function moduleUrl(path) {
  if (cache.has(path)) return cache.get(path)
  let source = await readFile(path, 'utf8')
  if (path.endsWith('.json')) return inline(`export default ${source}`)
  source = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
  for (const name of new Set([...source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)].map(match => match[1]))) {
    let url
    if (Object.hasOwn(stubs, name)) url = inline(stubs[name])
    else if (name.endsWith('.css')) url = inline('export default new Proxy({}, {get:(_,key)=>key})')
    else {
      let target = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name)
      if (!/\.(tsx?|json)$/.test(target)) {
        try { await readFile(`${target}.ts`); target += '.ts' }
        catch (error) { if (error.code !== 'ENOENT') throw error; target += '.tsx' }
      }
      url = await moduleUrl(target)
    }
    source = source.replaceAll(`'${name}'`, `'${url}'`).replaceAll(`"${name}"`, `"${url}"`)
  }
  const url = inline(source); cache.set(path, url); return url
}
const { GolfZone } = await import(await moduleUrl(resolve(root, 'src/components/GolfZone.tsx')))
const { GOLF_COURSES } = await import(await moduleUrl(resolve(root, 'src/data/golfCourses.ts')))
const { MONTHLY_GOLF_SHORTLISTS, MONTH_NAMES } = await import(await moduleUrl(resolve(root, 'src/lib/golfDiscovery.ts')))
const media = await json('src/data/golfCourseMedia.json')
const copy = await json('src/data/golfCourseCharacter.json')
const catalog = { notes: await json('src/data/golfCourseNotes.json'), sources: await json('src/data/golfSources.json') }
const courses = GOLF_COURSES.map(course => {
  const record = media.find(row => row.courseId === course.id)
  return { ...course, characterLine: copy[course.id], media: { photo: record.photos[0] ?? null, photoCount: record.photos.length, gallery: !!record.gallery, hasRoutingDiagram: !!record.map, layoutKind: record.layout?.kind ?? null } }
})
const nodes = node => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(nodes) : [node, ...nodes(node.props?.children)]
const text = node => node == null || node === false ? '' : Array.isArray(node) ? node.map(text).join(' ') : typeof node === 'object' ? text(node.props?.children) : String(node)
const has = (node, key) => Object.hasOwn(node.props ?? {}, key)
const render = month => GolfZone({ courses, catalog, initialMonth: month })

for (let month = 1; month <= 12; month++) test(`${MONTH_NAMES[month - 1]}: course identity, twelve native controls, six exact links, all photo and source credits retained`, () => {
  const tree = render(month), all = nodes(tree)
  assert.equal(tree.props['data-design-edition'], 'golf')
  const expected = MONTHLY_GOLF_SHORTLISTS[month - 1]
  const lead = courses.find(course => course.id === expected[0])
  const hero = all.find(node => has(node, 'data-golf-hero'))
  const heroNodes = nodes(hero)
  assert.equal(text(heroNodes.find(node => node.type === 'h1')), lead.name)
  assert.equal(text(heroNodes.find(node => has(node, 'data-golf-hero-character'))), lead.characterLine)
  const controls = all.filter(node => node.type === 'button' && has(node, 'data-golf-month'))
  assert.equal(controls.length, 12)
  assert.equal(controls.filter(node => node.props['aria-pressed']).length, 1)
  assert.equal(controls[month - 1].props['aria-pressed'], true)
  assert.ok(controls.every(node => typeof node.props.onClick === 'function'))
  assert.equal(heroNodes.filter(node => has(node, 'data-golf-month')).length, 0, 'calendar remains outside hero')
  const cards = all.filter(node => has(node, 'data-golf-card'))
  assert.deepEqual(cards.map(node => node.props['data-golf-card']), expected)
  for (const card of cards) {
    const id = card.props['data-golf-card'], course = courses.find(row => row.id === id), children = nodes(card)
    assert.ok(children.some(node => node.props?.href === `/golf/${id}`))
    assert.ok(children.some(node => node.props?.href === `/golf/${id}#course-visuals`))
    assert.equal(text(children.find(node => has(node, 'data-golf-figure-title'))), course.name)
    assert.equal(text(children.find(node => has(node, 'data-golf-figure-phrase'))), course.characterLine)
    const images = children.filter(node => node.type === 'Image')
    assert.equal(images.length, course.media.photo ? 1 : 0)
    if (course.media.photo) {
      assert.equal(images[0].props.src, course.media.photo.src)
      assert.equal(images[0].props.alt, course.media.photo.alt)
      assert.ok(images[0].props.fill); assert.ok(images[0].props.sizes)
      const credit = children.find(node => has(node, 'data-golf-photo-credit'))
      for (const value of [course.media.photo.author, course.media.photo.license, course.media.photo.modifications].filter(Boolean)) assert.ok(text(credit).includes(value))
      for (const href of [course.media.photo.sourcePage, course.media.photo.licenseUrl]) assert.ok(nodes(credit).some(node => node.props?.href === href))
    } else assert.match(text(card), /Course photo unavailable/)
    const note = catalog.notes.find(note => note.courseId === id && note.month === month)
    assert.equal(text(children.find(node => has(node, 'data-golf-why'))), note.why)
    assert.equal(text(children.find(node => has(node, 'data-golf-tradeoff'))), note.tradeoff)
    assert.equal(children.filter(node => has(node, 'data-golf-source')).length, note.sourceIds.length)
  }
})

test('golf identity is an original decorative flag and putting-ring emblem, not a course map or substitute photo', async () => {
  const { GolfEmblem } = await import(await moduleUrl(resolve(root, 'src/components/GolfEmblem.tsx')))
  const emblem = GolfEmblem({}), all = nodes(emblem)
  assert.equal(emblem.type, 'svg')
  assert.equal(emblem.props['aria-hidden'], 'true')
  assert.equal(emblem.props.focusable, 'false')
  assert.ok(has(emblem, 'data-golf-emblem'))
  assert.ok(has(emblem, 'data-golf-motif'))
  assert.ok(all.some(node => node.props?.['data-golf-flag'] !== undefined))
  assert.ok(all.filter(node => node.type === 'ellipse').length >= 3)
  assert.equal(all.filter(node => ['image', 'img', 'text', 'a', 'use'].includes(node.type)).length, 0)
  assert.doesNotMatch(await read('src/components/GolfEmblem.tsx'), /https?:|yardage|hole-\d|routing-map/)
  assert.ok(nodes(render(3)).some(node => has(node, 'data-golf-emblem')), 'no-photo lead still has a visible golf identity')
})

test('no-photo hero names the unavailable course, without presenting its decorative emblem as a photo', () => {
  for (const [month, name] of [[3, 'Royal Cape Golf Club'], [11, 'Steenberg Golf Club']]) {
    const hero = nodes(render(month)).find(node => has(node, 'data-golf-hero'))
    const note = nodes(hero).find(node => has(node, 'data-golf-hero-credit'))
    assert.ok(text(note).replace(/\s+/g, ' ').includes(`Course photo unavailable · ${name}`))
    assert.equal(nodes(hero).filter(node => node.type === 'Image').length, 0)
    assert.ok(nodes(hero).some(node => has(node, 'data-golf-motif')))
  }
})

test('printed calendar and field-note details belong to golf without adding unsupported playing facts', () => {
  const all = nodes(render(3))
  assert.ok(all.some(node => has(node, 'data-golf-edition')))
  assert.equal(all.filter(node => has(node, 'data-golf-card-imprint')).length, 6)
  assert.ok(all.some(node => has(node, 'data-golf-calendar-ledger')))
})

test('scoped finder and article CSS provide warm-gold golf tokens, readable sources, motion reduction and phone layout', async () => {
  for (const path of ['src/components/GolfZone.module.css', 'src/components/GolfGuide.module.css']) {
    const css = await read(path)
    assert.match(css, /--gold:\s*#e0bd78/)
    assert.match(css, /--forest:\s*#0d3028/)
    assert.match(css, /prefers-reduced-motion/)
    assert.match(css, /max-width:\s*639px|max-width:\s*480px/)
    assert.match(css, /\.golfEmblem/)
    assert.match(css, /font-size:\s*13px/)
    assert.match(css, /\.golfEmblem\s*\{[^}]*width:\s*76px;[^}]*height:\s*76px/)
    assert.doesNotThrow(() => postcss.parse(css))
  }
})

test('solid golf surfaces meet normal-text contrast in both theme token sets', async () => {
  const luminance = hex => {
    const rgb = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    return rgb.reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
  }
  for (const path of ['src/components/GolfZone.module.css', 'src/components/GolfGuide.module.css']) {
    const css = postcss.parse(await read(path)), palettes = []
    css.walkRules(rule => {
      if (!['.root', ':global(.dark) .root'].includes(rule.selector)) return
      const tokens = {}; rule.walkDecls(decl => { tokens[decl.prop] = decl.value })
      palettes.push(tokens)
    })
    const light = palettes[0], dark = { ...light, ...palettes[1] }
    for (const palette of [light, dark]) {
      for (const [foreground, background] of [['--ink', '--paper'], ['--muted', '--paper'], ['--muted', '--inset'], ['--gold', '--forest']]) {
        const [lo, hi] = [luminance(palette[foreground]), luminance(palette[background])].sort((a, b) => a - b)
        assert.ok((hi + .05) / (lo + .05) >= 4.5, `${path}: ${foreground} on ${background}`)
      }
    }
  }
})
