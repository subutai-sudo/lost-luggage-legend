import { test as base, expect } from '@playwright/test'

// App regressions must not create analytics traffic or trigger affiliate
// popunders. Real map data, images and local image optimization remain enabled.
// Monetization-script behavior needs its own separately authorized integration
// test; it is intentionally outside this suite's assertions.
const marketingHosts = new Set(['scripts.stay22.com', 'plausible.io'])

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(url => marketingHosts.has(url.hostname), route => route.abort())
    await use(page)
  },
})

export { expect }
