// Regenerate browser icons from the exact same authored vector as the navbar.
// Uses the existing dev-only Playwright install; no image service/dependency.
const fs = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('@playwright/test')

async function main() {
  const directory = path.join(__dirname, '..', 'public', 'brand')
  const svg = await fs.readFile(path.join(directory, 'goldilocks-mark.svg'), 'utf8')
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  const browser = await chromium.launch()
  try {
    for (const { name, size, inset, background } of [
      { name: 'favicon-32.png', size: 32, inset: 0, background: 'transparent' },
      { name: 'apple-touch-icon.png', size: 180, inset: 12, background: '#f3f1e9' },
    ]) {
      const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
      await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:${background}}body{display:grid;place-items:center}img{display:block;width:${size - inset * 2}px;height:${size - inset * 2}px}</style><img src="${uri}" alt="">`)
      await page.locator('img').evaluate(image => image.decode())
      await page.screenshot({ path: path.join(directory, name), omitBackground: true })
      await page.close()
      console.log(`${name}: ${size} × ${size}, rendered from goldilocks-mark.svg`)
    }
  } finally {
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
