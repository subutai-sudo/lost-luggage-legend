import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const css = await readFile(new URL('../src/components/GolfGuide.module.css', import.meta.url), 'utf8')
function assertProvenanceFloor(source) {
  const rules = [...source.matchAll(/\.heroFoot\s*\{([^}]+)\}/g)]
  assert.ok(rules.length, 'the guide hero provenance has a dedicated rule')
  const sizes = rules.flatMap(rule => [...rule[1].matchAll(/font-size\s*:\s*([\d.]+)px/g)].map(m => Number(m[1])))
  assert.ok(sizes.length, 'an explicit provenance font size is required')
  for (const size of sizes) assert.ok(size >= 13, `provenance must be at least 13px, got ${size}px`)
}

test('course-guide photo credits and unavailable-photo disclosure have a 13px floor at every breakpoint', () => {
  assertProvenanceFloor(css)
})

test('the provenance guard refuses both a small base font and a phone-only override', () => {
  assert.throws(() => assertProvenanceFloor('.heroFoot { font-size: 11px; }'))
  assert.throws(() => assertProvenanceFloor('.heroFoot { font-size: 13px; } @media (max-width:480px) { .heroFoot {font-size: 10px;} }'))
  assertProvenanceFloor('.heroFoot { font-size: 13px; }')
})
