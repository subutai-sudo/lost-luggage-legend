import { defineConfig } from '@playwright/test'
import base from './playwright.config.mjs'

// Separate opt-in suite: do not let the standard marketing-blocked UI fixture
// stand in for verification of the real third-party initializer.
export default defineConfig({
  ...base,
  testMatch: '**/stay22.live.test.mjs',
  workers: 1,
})
