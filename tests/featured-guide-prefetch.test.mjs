import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'
import {
  featuredApproval, featuredBase, featuredBytes, featuredChangedPaths,
  featuredFixturePath, featuredPaths, featuredTestPath, featuredBrowserPath, validateFeatured,
  followupApproval, followupBytes, verifyFeaturedInventory, verifyFollowupInventory,
  verifyPublishedInventory, assertScopeInventory, normalizeApproved, publishedBytes, sha256,
  themeBootFixturePath, themeBootApproval, themeBootChangedPaths, themeBootAddedPath, validateThemeBoot, themeBootBytes,
} from './helpers/trip-planning-approval.mjs'

function inverseLike(entry, input) {
  let restored = Buffer.from(input)
  let last = restored.length + 1
  for (const edit of [...entry.edits].reverse()) {
    const from = Buffer.from(edit.after, 'base64'), to = Buffer.from(edit.before, 'base64')
    assert.ok(edit.afterOffset + from.length <= last, 'non-overlapping offsets')
    last = edit.afterOffset
    assert.deepEqual(restored.subarray(edit.afterOffset, edit.afterOffset + from.length), from, 'exact after bytes')
    restored = Buffer.concat([restored.subarray(0, edit.afterOffset), to, restored.subarray(edit.afterOffset + from.length)])
  }
  assert.equal(sha256(restored), entry.beforeHash, 'restored to the pinned published hash')
  return restored
}

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root))
const home = 'src/components/GoldilocksHome.tsx'
const insertion = ' prefetch={false}'

function assertDetailLinks(source) {
  const file = ts.createSourceFile(home, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  assert.equal(file.parseDiagnostics.length, 0, 'valid JSX required')
  const detail = []
  function visit(node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(file) === 'Link') {
      const attrs = node.attributes.properties
      const hrefs = attrs.filter(attr => ts.isJsxAttribute(attr) && attr.name.getText(file) === 'href')
      assert.equal(hrefs.length, 1, 'every native Link retains one explicit href')
      const href = hrefs[0].initializer.getText(file)
      if (href.includes('/guides/')) {
        assert.ok(!attrs.some(ts.isJsxSpreadAttribute), 'detail Link cannot override false via spread')
        const prefetch = attrs.filter(attr => ts.isJsxAttribute(attr) && attr.name.getText(file) === 'prefetch')
        assert.equal(prefetch.length, 1, 'every destination-detail Link must explicitly disable auto-prefetch')
        assert.equal(prefetch[0].initializer?.getText(file), '{false}', 'no true, auto, bare or alternate prefetch value')
        detail.push({ href, opening: node.getText(file) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  assert.equal(detail.length, 4, 'all four detail Links, never just the three cards')
  const featured = detail.filter(link => link.href === '{`/guides/${featured.slug}?month=${month}`}')
  const cards = detail.filter(link => link.href === '{`/guides/${guide.slug}?month=${month}`}')
  assert.equal(featured.length, 1, 'exact featured destination/month identity')
  assert.ok(featured[0].opening.includes('data-feature-link'))
  assert.equal(cards.length, 3, 'exact shortlist destination/month identity')
  assert.equal(cards.filter(link => link.opening.includes("styles['image-link']")).length, 1)
  assert.equal(cards.filter(link => link.opening.includes("styles['read-guide']")).length, 1)
  assert.equal(cards.filter(link => link.opening === '<Link prefetch={false} href={`/guides/${guide.slug}?month=${month}`}>').length, 1, 'native title Link')
  assert.equal(source.split(insertion).length - 1, 4, 'no unrelated navigation prefetch is disabled')
  return detail
}

test('all four native detail Links disable prefetch and the GoldilocksHome TSX delta remains exactly the featured flag', async () => {
  const current = await read(home)
  const source = current.toString()
  const before = featuredBytes(home, current).toString()
  assert.equal(featuredBase, '6fafede9db46670fd95a99750c6cdc98416f611b')
  assertDetailLinks(source)
  const featured = '<Link prefetch={false} href={`/guides/${featured.slug}?month=${month}`} data-feature-link>'
  assert.equal(source.split(featured).length - 1, 1)
  const edits = featuredApproval.changes[home].edits
  assert.ok(edits.some(edit => {
    const from = Buffer.from(edit.before, 'base64').toString(), to = Buffer.from(edit.after, 'base64').toString()
    return to.split(insertion).length === 2 && to.replace(insertion, '') === from
  }), 'on its own line the featured flag is the only textual change')
  assert.ok(!/windowDimmer[^>]*>\s*<i/.test(source), 'the decorative shade-dot spans are gone, so the dimmer carries no indicator marks')
  const dimmerNow = '<span className={styles.windowDimmer} aria-hidden="true" />'
  const dimmerBefore = '<span className={styles.windowDimmer} aria-hidden="true"><i /><i /><i /><i /><i /></span>'
  assert.equal(source.split(dimmerNow).length - 1, 1, 'the dimmer is a single decoration-free element')
  assert.equal(before.split(dimmerBefore).length - 1, 1)
  assert.equal(source.replace(dimmerNow, dimmerBefore).replace(featured, featured.replace(insertion, '')), before, 'only the featured flag plus the dot removal differ from the published component')
})

test('all-four guard refuses each default/true/auto Link and changed destination/month identities', async () => {
  const source = (await read(home)).toString()
  const links = assertDetailLinks(source)
  for (const { opening } of links) {
    for (const value of ['', ' prefetch={true}', ' prefetch="auto"', ' prefetch', ' prefetch={false} {...props}', ' prefetch={false} prefetch={false}']) {
      assert.throws(() => assertDetailLinks(source.replace(opening, opening.replace(insertion, value))), opening)
    }
    assert.throws(() => assertDetailLinks(source.replace(opening, opening.replace('?month=${month}', '?month=3'))))
    assert.throws(() => assertDetailLinks(source.replace(opening, opening.replace('.slug}', '.id}'))))
  }
  assert.throws(() => assertDetailLinks(source + '\nconst extra = <Link href="/guides/kyoto">Guide</Link>'))
  assert.throws(() => assertDetailLinks(source + '\nconst extra = <Link prefetch={false} href="/guides/kyoto">Guide</Link>'))
})

test('both themes carry a dot-free shade control: no indicator rules survive anywhere in the stylesheet', async () => {
  const css = (await read('src/components/GoldilocksHome.module.css')).toString()
  assert.equal((css.match(/windowDimmer\s+i\b/g) || []).length, 0, 'no light or dark indicator-dot rule may remain')
  assert.ok(!/windowDimmer[^}]*>\s*<i/.test((await read('src/components/GoldilocksHome.tsx')).toString()), 'no dot markup may remain')
  const dark = css.slice(css.indexOf(':global(.dark) .hero'))
  assert.ok(dark.includes('.windowDimmer::before') && dark.includes('.windowDimmer::after'), 'dark mode still paints both rocker halves')
  assert.ok(!/windowDimmer[^{]*i\b/.test(dark), 'the dark block carries no dead dot selector')
})

test('published PR28 layer inverts to f892fd4 exactly and refuses mutation, interchange and truncation', async () => {
  validateThemeBoot()
  assert.equal(themeBootApproval.publishedBase, 'f892fd4aa03006ca03eb48b9e7a241c1e4c4791f')
  assert.equal(themeBootApproval.publishedHead, featuredBase)
  for (const path of themeBootChangedPaths) {
    const entry = themeBootApproval.changes[path]
    // Step back through this release's own layer first, so the PR28 layer is fed
    // exactly the published bytes it claims to describe.
    const published = featuredBytes(path, await read(path))
    assert.equal(sha256(published), entry.afterHash, `${path}: current published PR28 bytes`)
    const restored = themeBootBytes(path, published)
    assert.equal(sha256(restored), entry.beforeHash, `${path}: exact f892fd4 inverse`)
    const mutated = Buffer.concat([published, Buffer.from('\n')])
    assert.throws(() => themeBootBytes(path, mutated), `${path}: appended byte refused`)
    assert.throws(() => themeBootBytes(path, restored), `${path}: already-inverted bytes refused`)
    for (const edit of entry.edits) {
      // Truncate whichever side of the edit actually carries bytes.
      const side = Buffer.from(edit.after, 'base64').length ? 'after' : 'before'
      const broken = { ...entry, edits: entry.edits.map(e => e === edit ? { ...e, [side]: Buffer.from(edit[side], 'base64').subarray(0, -1).toString('base64') } : e) }
      assert.throws(() => inverseLike(broken, published), `${path}: truncated edit refused`)
    }
    const swapped = { ...entry, edits: entry.edits.map(e => ({ ...e, before: e.after, after: e.before })) }
    assert.throws(() => inverseLike(swapped, published), `${path}: interchange refused`)
  }
  const bootScript = await read(themeBootAddedPath)
  assert.equal(sha256(bootScript), themeBootApproval.addedFiles[themeBootAddedPath].afterHash)
  assert.throws(() => themeBootBytes(themeBootAddedPath, Buffer.concat([bootScript, Buffer.from('\n')])))
})

test('complete 310 -> 307 -> 273 published reconstruction retains twelve fixtures and exactly 314 shipping paths', async () => {
  assert.deepEqual(await verifyFeaturedInventory(), { published: 310, changed: 12, added: 3, immutableFixtures: 12 })
  assert.deepEqual(await verifyFollowupInventory(), { published: 307, changed: 3, added: 2 })
  assert.deepEqual(await verifyPublishedInventory(), { published: 273, added: 33, immutableFixtures: 10 })
  const files = featuredApproval.independentPublishedManifest.files
  const paths = [...Object.keys(files), ...featuredPaths, themeBootFixturePath]
  assert.equal(paths.length, 314)
  assert.equal(new Set(paths).size, 314)
  assertScopeInventory(paths)
  for (const path of paths) {
    assert.throws(() => assertScopeInventory(paths.filter(p => p !== path)), `${path}: missing path`)
    assert.throws(() => assertScopeInventory([...paths, path]), `${path}: duplicate path`)
  }
  for (const path of ['.env.local', 'docs/research.json', 'src/unreviewed.ts']) assert.throws(() => assertScopeInventory([...paths, path]))
  const fixtures = Object.keys(files).filter(path => path.startsWith('tests/fixtures/'))
  assert.equal(fixtures.length, 12)
  for (const path of fixtures) assert.equal(sha256(await read(path)), files[path].sha256, `${path}: published fixture bytes never edited`)
  assert.ok(!Object.hasOwn(featuredApproval.changes, featuredFixturePath))
  assert.ok(!Object.hasOwn(featuredApproval.addedFiles, featuredFixturePath))
})

test('latest exact pins refuse old/new interchange, byte mutation and truncation before inherited guards', async () => {
  for (const path of featuredChangedPaths) {
    const current = await read(path)
    const restored = featuredBytes(path, current)
    const entry = featuredApproval.independentPublishedManifest.files[path]
    assert.equal(sha256(restored), entry.sha256, path)
    assert.equal(restored.length, entry.bytes, path)
    assert.throws(() => featuredBytes(path, restored), `${path}: old bytes cannot masquerade as new`)
    assert.throws(() => followupBytes(path, restored), `${path}: inherited normalizer demands latest bytes`)
    for (const bad of [current.subarray(0, -1), Buffer.concat([current, Buffer.from('unapproved')]), Buffer.from(current).fill(0, 0, 1)]) {
      assert.throws(() => featuredBytes(path, bad), path)
      assert.throws(() => followupBytes(path, bad), path)
      assert.throws(() => publishedBytes(path, bad), path)
    }
  }
  for (const path of [home, 'tests/helpers/trip-planning-approval.mjs']) {
    const current = await read(path)
    normalizeApproved(path, current)
    const restored = featuredBytes(path, current)
    assert.throws(() => normalizeApproved(path, restored), `${path}: direct older-overlay caller also demands latest bytes`)
  }
  const guard = await read(featuredTestPath)
  assert.equal(sha256(guard), featuredApproval.addedFiles[featuredTestPath].afterHash)
  for (const bad of [guard.subarray(0, -1), Buffer.concat([guard, Buffer.from('unapproved')])]) assert.throws(() => featuredBytes(featuredTestPath, bad))
})

test('October readiness adds only three stronger assertions before unchanged disclosure geometry checks', async () => {
  const path = 'tests/seasonal-reasons.browser.test.mjs'
  const current = await read(path)
  const before = featuredBytes(path, current).toString()
  const assertions = [
    "      await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready', 'true')",
    "      await expect(page.locator('[data-selected-month]')).toHaveText('October')",
    `      await expect(page.locator('[data-seasonal-note][data-seasonal-month="10"]')).toHaveCount(6)`,
  ].join('\n') + '\n'
  const anchor = "      await page.goto('/?month=10')\n"
  assert.equal(before.split(anchor).length - 1, 1)
  assert.equal(current.toString(), before.replace(anchor, anchor + assertions), 'no removed geometry/source/keyboard/no-JS checks or deadline/retry changes')
  for (const line of assertions.trimEnd().split('\n')) {
    assert.throws(() => featuredBytes(path, Buffer.from(current.toString().replace(line + '\n', ''))), 'each readiness assertion is required')
  }
})

function presentationOnly(source) {
  const file = ts.createSourceFile('ComparePricesSection.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  assert.equal(file.parseDiagnostics.length, 0)
  const ranges = []
  function visit(node) {
    if (ts.isJsxAttribute(node) && ['style', 'className'].includes(node.name.getText(file))) {
      ranges.push([node.getFullStart(), node.end])
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) source = source.slice(0, start) + source.slice(end)
  return source
}
function assertPlannerPresentation(before, current) {
  const anchor = '\n  return (\n    <section id="compare-prices"'
  assert.equal(before.split(anchor).length, 2)
  assert.equal(current.split(anchor).length, 2)
  assert.equal(current.split(anchor)[0], before.split(anchor)[0], 'all state, validation, handlers and suppliers remain byte-identical')
  assert.equal(presentationOnly(current), presentationOnly(before), 'only JSX className/style fields may change; href, rel, event handlers, disabled states, dates and copy are immutable')
}

test('authorized planner changes are limited to presentation fields and reject behavior or supplier changes', async () => {
  const path = 'src/components/ComparePricesSection.tsx'
  const current = (await read(path)).toString()
  const before = featuredBytes(path, Buffer.from(current)).toString()
  assertPlannerPresentation(before, current)
  for (const [from, to] of [
    ['setSearchType(type)', "setSearchType('hotels')"],
    ['disabled={!isFormValid}', 'disabled={false}'],
    ['href={supplier.url}', 'href="https://unapproved.example"'],
    ['onClick={handleSearch}', 'onClick={() => {}}'],
    ['noopener noreferrer sponsored', 'noopener'],
    ['Check Prices', 'Guaranteed Cheapest'],
  ]) {
    assert.ok(current.includes(from), `negative control actually mutates ${from}`)
    const bad = current.replace(from, to)
    assert.throws(() => assertPlannerPresentation(before, bad), from)
    assert.throws(() => featuredBytes(path, Buffer.from(bad)), from)
  }
})

test('travel accent delta is exactly two variables and window browser retains inherited assertions and deadlines', async () => {
  const path = 'src/components/TravelTheme.module.css'
  const current = (await read(path)).toString()
  const before = featuredBytes(path, Buffer.from(current)).toString()
  const anchor = '  --color-ink-light: #e4edf1;\n  --color-muted: #c0d1d9;\n  --color-gold: #e0f29b;\n'
  assert.equal(before.split(anchor).length, 2)
  assert.equal(current, before.replace(anchor, anchor + '  --color-accent: #e0f29b;\n  --color-accent-light: #e0f29b;\n'))
  const browser = 'tests/window-seat-hero.browser.test.mjs'
  const original = featuredBytes(browser, await read(browser)).toString()
  const latest = (await read(browser)).toString()
  for (const line of original.split('\n').filter(line => /expect\(|test\(|setTimeout|timeout|retries|for \(const width/.test(line))) {
    assert.ok(latest.includes(line), `inherited check or deadline retained: ${line}`)
  }
  for (const path of [featuredTestPath, featuredBrowserPath]) {
    const current = await read(path)
    for (const bad of [current.subarray(0, -1), Buffer.concat([current, Buffer.from('unreviewed')])]) assert.throws(() => featuredBytes(path, bad), path)
  }
})

test('solid planner contrast oracle is the only repaired block, retains measured AA and refuses missing state/pointer checks', async () => {
  const path = 'tests/accessibility-plan.browser.test.mjs'
  const current = await read(path)
  const source = current.toString()
  const before = featuredBytes(path, current).toString()
  const replacement = [
    "      await expect(search).toHaveCSS('background-color', theme === 'dark' ? 'rgb(224, 242, 155)' : 'rgb(20, 44, 59)')",
    "      await expect(search).toHaveCSS('color', theme === 'dark' ? 'rgb(20, 44, 59)' : 'rgb(245, 241, 231)')",
    '      await settle(search)',
    '      const painted = await paint(search)',
    '      // The travel theme uses solid actions; measure their actual foreground',
    '      // and composited background rather than the retired cyan gradient.',
    "      expect(painted.backgroundImage).toBe('none')",
    "      expect(painted.background).toBe(theme === 'dark' ? 'rgb(224, 242, 155)' : 'rgb(20, 44, 59)')",
    "      expect(painted.color).toBe(theme === 'dark' ? 'rgb(20, 44, 59)' : 'rgb(245, 241, 231)')",
    '      expect.soft(painted.textContrast).toBeGreaterThanOrEqual(4.5)',
  ].join('\n') + '\n'
  const retiredStart = before.indexOf('      const painted = await paint(search)\n')
  assert.ok(retiredStart > 0)
  const retiredEnd = before.indexOf('    })', retiredStart)
  const retired = before.slice(retiredStart, retiredEnd)
  assert.ok(retired.includes('White text must meet AA at BOTH opaque gradient endpoints.'))
  assert.ok(retired.includes('expect(stops.length).toBeGreaterThanOrEqual(2)'))
  assert.equal(source.split(replacement).length - 1, 1)
  assert.equal(source.replace(replacement, retired), before, 'inverse only this block; painted-color parser, composition, every other assertion, native control, focus/error check and deadline unchanged')
  const assertions = replacement.split('\n').filter(line => line.trimStart().startsWith('expect')).join('\n')
  const oracle = new Function('expect', 'painted', 'theme', assertions)
  const strictExpect = actual => ({
    toBe: expected => assert.equal(actual, expected),
    toBeGreaterThanOrEqual: expected => assert.ok(actual >= expected),
  })
  strictExpect.soft = strictExpect
  const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
  const navy = [20, 44, 59]
  for (const [theme, ink] of [['light', [245, 241, 231]], ['dark', [224, 242, 155]]]) {
    const painted = {
      backgroundImage: 'none',
      background: theme === 'dark' ? 'rgb(224, 242, 155)' : 'rgb(20, 44, 59)',
      color: theme === 'dark' ? 'rgb(20, 44, 59)' : 'rgb(245, 241, 231)',
      textContrast: (luminance(ink) + .05) / (luminance(navy) + .05),
    }
    oracle(strictExpect, painted, theme)
    // Execute the actual assertion lines, not a second permissive validator.
    for (const bad of [
      { ...painted, textContrast: 4.49 },
      { ...painted, textContrast: 1 },
      { ...painted, backgroundImage: 'linear-gradient(white, white)' },
      { ...painted, background: 'rgb(255, 255, 255)' },
      { ...painted, color: 'rgb(255, 255, 255)' },
    ]) assert.throws(() => oracle(strictExpect, bad, theme))
    oracle(strictExpect, { ...painted, textContrast: 4.5 }, theme)
  }
  for (const declaration of [
    "for (const state of ['normal', 'hover', 'focus'])",
    "for (const activation of ['Enter', 'Space', 'mouse', 'touch'])",
    "await expect.soft(button).toHaveAttribute('aria-pressed', 'true')",
    'await suggestion(touch, \'London\').tap()',
    'expect.soft(painted.textContrast).toBeGreaterThanOrEqual(4.5)',
    "expect(painted.backgroundImage).toBe('none')",
  ]) {
    assert.ok(source.includes(declaration), `negative control actually removes ${declaration}`)
    assert.throws(() => featuredBytes(path, Buffer.from(source.replace(declaration, ''))), declaration)
  }
})

test('missing/foreign/self claims and rebaselining cannot broaden the new additive overlay', () => {
  validateFeatured()
  for (const [kind, paths] of [['changes', featuredChangedPaths], ['addedFiles', [featuredTestPath, featuredBrowserPath]]]) {
    for (const path of paths) {
      const missing = structuredClone(featuredApproval)
      delete missing[kind][path]
      assert.throws(() => validateFeatured(missing), path)
    }
    for (const path of ['src/unreviewed.ts', featuredFixturePath]) {
      const unknown = structuredClone(featuredApproval)
      unknown[kind][path] = structuredClone(Object.values(unknown[kind])[0])
      assert.throws(() => validateFeatured(unknown), path)
    }
  }
  for (const path of featuredChangedPaths) {
    const prior = followupApproval.changes[path] || followupApproval.addedFiles[path]
    assert.equal(featuredApproval.changes[path].beforeHash, prior ? prior.afterHash : featuredApproval.independentPublishedManifest.files[path].sha256)
    const stale = structuredClone(featuredApproval)
    stale.changes[path].beforeHash = '0'.repeat(64)
    assert.throws(() => validateFeatured(stale), path)
  }
  for (const path of Object.keys(featuredApproval.immutableFixtures)) {
    const changed = structuredClone(featuredApproval)
    changed.immutableFixtures[path] = '0'.repeat(64)
    assert.throws(() => validateFeatured(changed), path)
  }
  const rebaseline = structuredClone(featuredApproval)
  rebaseline.independentPublishedManifest.files[home].sha256 = '0'.repeat(64)
  assert.throws(() => validateFeatured(rebaseline))
})
