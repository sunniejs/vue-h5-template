const { defineConfig, devices } = require('@playwright/test')
const port = Number(process.env.H5_E2E_PORT || 9020)
const baseURL = `http://127.0.0.1:${port}`
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE

module.exports = defineConfig({
  testDir: './e2e',
  use: { ...devices['Pixel 7'], baseURL, launchOptions: { executablePath } },
  webServer: {
    command: `pnpm dev --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
