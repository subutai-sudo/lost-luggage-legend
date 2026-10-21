import assert from 'node:assert/strict'
import { test } from 'node:test'

// This suite POSTs only to a loopback server explicitly started with empty
// RESEND_API_KEY and RESEND_AUDIENCE_ID. Never run it against a hosted site.
const base = new URL(process.env.SEO_BASE_URL || 'http://127.0.0.1:3031')
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Newsletter test target must be loopback')
assert.equal(process.env.TEST_NEWSLETTER_UNCONFIGURED, '1', 'Explicitly opt into the unconfigured local-server test')

for (const email of ['', 'not-an-email', 123, ['audit@example.com']]) {
  await test(`rejects malformed email input ${JSON.stringify(email)}`, async () => {
    const response = await fetch(new URL('/api/newsletter', base), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    assert.equal(response.status, 400)
    assert.equal((await response.json()).error, 'Valid email required')
  })
}

await test('unconfigured local newsletter fails closed instead of claiming a subscription', async () => {
  const response = await fetch(new URL('/api/newsletter', base), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'audit@example.com' }),
  })
  assert.equal(response.status, 503)
  const result = await response.json()
  assert.equal(result.success, undefined)
  assert.equal(result.error, 'Newsletter is temporarily unavailable. Please try again later.')
})
