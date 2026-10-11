import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const reviewDir = path.join(root, '.impeccable', 'review')
await mkdir(reviewDir, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
})

const consoleErrors = []
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 })
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
})
page.on('pageerror', (error) => consoleErrors.push(error.message))

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Manila' }).waitFor({ timeout: 15000 })

const dailyRows = await page.locator('.daily-row').count()
const tracePoints = await page.locator('.trace-point').count()
const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)

await page.screenshot({ path: path.join(reviewDir, 'desktop.png'), fullPage: true })

const search = page.getByRole('combobox', { name: 'Search for a city or place' })
await search.fill('Cebu')
await page.locator('.search-results button').first().waitFor({ timeout: 10000 })
const resultCount = await page.locator('.search-results button').count()
await page.locator('.search-results button').first().click()
await page.waitForLoadState('networkidle')
await page.getByRole('button', { name: '°F' }).click()
await page.waitForTimeout(800)
const fahrenheitActive = await page.getByRole('button', { name: '°F' }).getAttribute('aria-pressed')

await page.setViewportSize({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle' })
await page.locator('.current-section').waitFor({ timeout: 15000 })
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
await page.screenshot({ path: path.join(reviewDir, 'mobile.png'), fullPage: true })

console.log(JSON.stringify({
  dailyRows,
  tracePoints,
  resultCount,
  fahrenheitActive,
  horizontalOverflow,
  mobileOverflow,
  consoleErrors,
}, null, 2))

await browser.close()
