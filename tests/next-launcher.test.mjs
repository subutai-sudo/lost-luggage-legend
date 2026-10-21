import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const root = fileURLToPath(new URL('..', import.meta.url))
function launch(env) {
  return spawnSync(process.execPath, ['scripts/next.mjs', '--version'], {
    cwd: root, env: { ...process.env, ...env }, encoding: 'utf8', timeout: 15_000,
  })
}

test('launcher starts the installed Next CLI without disabling TLS', () => {
  const result = launch({ NODE_TLS_REJECT_UNAUTHORIZED: '1' })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Next.js v16\./)
})

test('launcher refuses insecure TLS verification bypass', () => {
  const result = launch({ NODE_TLS_REJECT_UNAUTHORIZED: '0' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Refusing to start Next with TLS certificate verification disabled/)
  assert.doesNotMatch(result.stdout, /Next.js v/)
})
