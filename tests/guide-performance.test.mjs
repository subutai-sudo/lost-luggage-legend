import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const frozen = JSON.parse(await readFile(new URL('./fixtures/guide-performance-baseline.json', import.meta.url), 'utf8'))
const pagePath = 'src/app/guides/[slug]/page.tsx'
const oldSizes = '(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw'
const correctedSizes = '(max-width: 639px) calc(103.5vw - 41.4px), (max-width: 959px) calc(51.75vw - 45.54px), (min-width: 1344px) 411.24px, calc(34.5vw - 52.44px)'
const field = /(?<=src=\{r\.heroImage\}[\s\S]{0,200}sizes=")[^"]+(?=")/g
const source = await readFile(new URL(pagePath, root), 'utf8')

test('related image sizes describe gutters, gaps and the capped container', () => {
  assert.deepEqual([...source.matchAll(field)].map(match => match[0]), [correctedSizes])
})

test('only the approved related Image sizes field differs from the frozen full source', () => {
  assert.equal([...source.matchAll(field)].length, 1, 'normalize exactly one related field, never all sizes props')
  const normalized = source.replace(field, oldSizes)
  assert.equal(createHash('sha256').update(normalized).digest('hex'), frozen.hashes[pagePath])
})

test('all other baseline source, data, assets, styles, configuration and dependencies are byte-frozen', async () => {
  assert.equal(frozen.baseline, '70a91debd34c83c9b35e856c845ce7c4e641da69')
  for (const [path, hash] of Object.entries(frozen.hashes)) {
    if (path === pagePath) continue
    assert.equal(createHash('sha256').update(await readFile(new URL(path, root))).digest('hex'), hash, path)
  }
})
