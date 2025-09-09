// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const IS_CI = !!process.env.CI;
const HOST = '127.0.0.1';
const PORT = 4321;
const BASE = process.env.BASE_URL || `http://${HOST}:${PORT}`;

// Use "astro dev" locally (no build needed), "astro preview" on CI (built site)
const WEB_SERVER_CMD = IS_CI
  ? `npx astro preview --port ${PORT} --host ${HOST}`
  : `npx astro dev --port ${PORT} --host ${HOST}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: IS_CI ? 60_000 : 30_000,
  expect: { timeout: IS_CI ? 10_000 : 5_000 },
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 3 : undefined,
  forbidOnly: IS_CI,

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE,
    viewport: { width: 1280, height: 800 },
    actionTimeout: IS_CI ? 15_000 : 0,
    navigationTimeout: IS_CI ? 30_000 : 15_000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // helps with animation-related flakes
    contextOptions: { reducedMotion: 'reduce' },
  },

  webServer: {
    command: WEB_SERVER_CMD,
    url: BASE,
    reuseExistingServer: !IS_CI, // if you already have "astro dev" running locally, reuse it
    timeout: 90_000,
    env: { NODE_ENV: IS_CI ? 'production' : 'development' },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'], launchOptions: { slowMo: IS_CI ? 50 : 0 } } },
  ],
});
