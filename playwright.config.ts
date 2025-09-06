import { defineConfig, devices } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,

  reporter: process.env.CI ? [['html', { open: 'never' }], ['line']] : [['list']],

  use: {
    baseURL: BASE,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 },
  },

  // Start a server automatically unless you run your own.
  // Uses your production build (fast & matches Vercel).
  webServer: process.env.PLAYWRIGHT_NO_WEB_SERVER ? undefined : {
    command: 'npm run preview:test',      // builds + serves dist at 4321
    url: BASE,
    timeout: 120_000,
    reuseExistingServer: true,
  },

  // Cross-browser projects (Chromium/Firefox/WebKit)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
