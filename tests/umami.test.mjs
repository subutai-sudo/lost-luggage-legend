import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import ts from 'typescript'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const sourceUrl = new URL('../src/components/UmamiAnalytics.tsx', import.meta.url)

async function render(env) {
  const source = await readFile(sourceUrl, 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  } }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', 'process', output)(require, module, module.exports, { env })
  return renderToStaticMarkup(createElement(module.exports.default))
}

test('production renders exactly one non-blocking tracker for the existing LLL registration', async () => {
  const html = await render({ VERCEL_ENV: 'production', NODE_ENV: 'production' })
  assert.equal((html.match(/<script\b/g) || []).length, 1)
  assert.match(html, /src="https:\/\/umami\.scheduledloss\.com\/script\.js"/)
  assert.match(html, /data-website-id="0da19096-85a8-4489-b246-9151fa113f5b"/)
  assert.match(html, /\bdefer=""/)
  assert.match(html, /data-domains="lostluggagelegend\.com,www\.lostluggagelegend\.com"/)
  assert.match(html, /data-do-not-track="true"/)
  assert.match(html, /data-exclude-search="true"/)
  assert.match(html, /data-exclude-hash="true"/)
  assert.doesNotMatch(html, /data-errors|data-performance|APP_SECRET|DATABASE_URL/)
})

for (const value of [undefined, 'preview', 'development', 'test', 'Production']) {
  test(`non-production environment ${String(value)} renders no tracker, even with NODE_ENV=production`, async () => {
    assert.equal(await render({ VERCEL_ENV: value, NODE_ENV: 'production' }), '')
  })
}

test('shared root mounts the tracker once and ships no second provider', async () => {
  const layout = await readFile(new URL('../src/app/layout.tsx', import.meta.url), 'utf8')
  assert.equal((layout.match(/<UmamiAnalytics\s*\/>/g) || []).length, 1)
  // A second provider double-counted every visit; the markup must stay single-source.
  assert.doesNotMatch(layout, /plausible\.io/)
  assert.doesNotMatch(layout, /window\.plausible/)
})

test('routine browser tests isolate the Umami origin too', async () => {
  const fixture = await readFile(new URL('./browser-fixture.mjs', import.meta.url), 'utf8')
  assert.match(fixture, /['"]umami\.scheduledloss\.com['"]/)
})
