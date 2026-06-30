// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Serves the static site with Python's http.server (file:// is blocked by the
// browser), so tests can hit it over http. No build step required.
const PORT = 8123;
const BASE_URL = `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1200, height: 900 } },
    },
    {
      // Chromium with a phone-sized viewport (under the 768px breakpoint), so
      // the suite needs only one browser engine.
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
