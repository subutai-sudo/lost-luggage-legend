import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const origin = 'https://lostluggagelegend.com'
const base = new URL(process.env.SEO_BASE_URL || 'http://127.0.0.1:3031')
const staticPaths = ['/', '/guides', '/privacy-policy', '/terms-of-service', '/affiliate-disclosure']

async function get(path) {
  const response = await fetch(new URL(path, base), {
    redirect: 'manual',
    signal: AbortSignal.timeout(30_000),
    headers: { 'User-Agent': 'LostLuggageLegend-SEO-Regression/1.0' },
  })
  return { response, html: await response.text() }
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map(([, key, , value]) => [key.toLowerCase(), value]))
  )
}

function verifyPage(path, response, html) {
  assert.equal(response.status, 200, `${path}: HTTP 200`)
  assert.deepEqual(
    tags(html, 'link').filter((tag) => tag.rel === 'canonical').map((tag) => new URL(tag.href).href),
    [new URL(path, origin).href],
    `${path}: exactly one self-referencing canonical`
  )
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ''
  assert.equal((title.match(/Lost Luggage Legend/g) || []).length, 1, `${path}: brand appears exactly once in title`)
  const meta = tags(html, 'meta')
  const socialUrl = meta.find((tag) => tag.property === 'og:url')?.content
  assert.ok(socialUrl, `${path}: Open Graph URL exists`)
  assert.equal(new URL(socialUrl).href, new URL(path, origin).href, `${path}: matching Open Graph URL`)
  assert.ok(meta.find((tag) => tag.name === 'description')?.content, `${path}: description exists`)
  assert.ok(/<h1\b/i.test(html), `${path}: H1 exists`)
  assert.ok(!meta.some((tag) => /^(robots|googlebot)$/.test(tag.name || '') && /noindex/i.test(tag.content || '')), `${path}: no unintended noindex meta`)
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${path}: no unintended noindex header`)
}

// Parse the independent source inventory without executing affiliate or app code.
// Discovering expected pages solely from the index would miss guides dropped from
// both that index and the sitemap at the same time.
const inventoryText = await readFile(new URL('../src/data/destinationGuides.ts', import.meta.url), 'utf8')
const inventory = ts.createSourceFile('destinationGuides.ts', inventoryText, ts.ScriptTarget.Latest, true)
const declaration = inventory.statements.filter(ts.isVariableStatement)
  .flatMap((statement) => [...statement.declarationList.declarations])
  .find((item) => ts.isIdentifier(item.name) && item.name.text === 'DESTINATION_GUIDES')
assert.ok(declaration?.initializer && ts.isArrayLiteralExpression(declaration.initializer), 'Guide inventory must be an explicit source array')
const expectedGuidePaths = declaration.initializer.elements.map((element) => {
  assert.ok(ts.isObjectLiteralExpression(element), 'Every guide must be an object')
  const slug = element.properties.find((property) =>
    ts.isPropertyAssignment(property) &&
    (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
    property.name.text === 'slug'
  )
  assert.ok(slug && ts.isStringLiteral(slug.initializer), 'Every guide must have a literal slug')
  return `/guides/${slug.initializer.text}`
}).sort()
assert.ok(expectedGuidePaths.length > 0, 'Source guide inventory must not be empty')
assert.equal(new Set(expectedGuidePaths).size, expectedGuidePaths.length, 'Guide slugs must be unique')

const index = await get('/guides')
const guidePaths = [...new Set(tags(index.html, 'a').map((tag) => tag.href).filter((href) => /^\/guides\/[^/?#]+$/.test(href || '')))].sort()
assert.deepEqual(guidePaths, expectedGuidePaths, 'Index must expose every source-inventory guide as a crawlable link')
const expectedPaths = [...staticPaths, ...expectedGuidePaths].sort()

await test('robots advertises the real-host sitemap and preserves API exclusion', async () => {
  const { response, html } = await get('/robots.txt')
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type') || '', /text\/plain/)
  assert.match(html, /^User-Agent:\s*\*$/im)
  assert.match(html, /^Allow:\s*\/$/im)
  assert.match(html, /^Disallow:\s*\/api\/$/im)
  const sitemapLines = [...html.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1])
  assert.deepEqual(sitemapLines, [`${origin}/sitemap.xml`])
})

await test('sitemap contains each real guide and static route once, on the correct origin', async () => {
  const { response, html } = await get('/sitemap.xml')
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type') || '', /xml/)
  assert.match(html, /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/)
  const urls = [...html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  assert.equal(new Set(urls).size, urls.length, 'No duplicate sitemap URLs')
  for (const url of urls) {
    const parsed = new URL(url)
    assert.equal(parsed.origin, origin)
    assert.equal(parsed.search, '')
    assert.equal(parsed.hash, '')
    assert.ok(parsed.pathname === '/' || !parsed.pathname.endsWith('/'), 'Normalized trailing slash')
  }
  assert.deepEqual(urls.map((url) => new URL(url).pathname).sort(), expectedPaths)
  console.log(`Verified ${urls.length} sitemap entries including ${guidePaths.length} guide URLs`)
})

await test('home, guide index and legal routes have unique route-specific metadata', async (t) => {
  for (const path of staticPaths) {
    await t.test(path, async () => {
      const { response, html } = await get(path)
      verifyPage(path, response, html)
    })
  }
})

await test('every linked guide returns 200 with unique canonical, title and social URL', async () => {
  const failures = []
  for (let offset = 0; offset < guidePaths.length; offset += 8) {
    await Promise.all(guidePaths.slice(offset, offset + 8).map(async (path) => {
      try {
        const { response, html } = await get(path)
        verifyPage(path, response, html)
      } catch (error) {
        failures.push({ path, message: error.message })
      }
    }))
  }
  assert.deepEqual(failures, [], 'Every destination must pass the same metadata assertions')
  console.log(`Verified all ${guidePaths.length} linked destination guides`)
})

await test('homepage footer links to the real guide index', async () => {
  const { html } = await get('/')
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || ''
  assert.match(footer, /<a\b[^>]*href="\/guides"[^>]*>\s*All Guides\s*<\/a>/i)
  assert.ok(!footer.includes('href="#guides"'))
})

await test('unknown guide keeps a real 404 and does not inherit a homepage canonical', async () => {
  const { response, html } = await get('/guides/this-guide-does-not-exist-seo-regression')
  assert.equal(response.status, 404)
  assert.ok(!tags(html, 'link').some((tag) => tag.rel === 'canonical'), 'Unknown pages must not masquerade as the homepage')
})
