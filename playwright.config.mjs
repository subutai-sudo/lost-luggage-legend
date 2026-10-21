import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.browser.test.mjs',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 2,
  reporter: 'list',
  outputDir: './test-results',
  use: {
    baseURL: process.env.BROWSER_BASE_URL || 'http://localhost:3001',
    timezoneId: 'America/Vancouver',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone-webkit', use: { ...devices['iPhone 13'] } },
  ],
})
