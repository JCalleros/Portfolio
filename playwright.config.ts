import { defineConfig, devices } from '@playwright/test';

const IS_CI = !!process.env.CI;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4321';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: IS_CI ? 60_000 : 30_000,
  expect: { timeout: IS_CI ? 10_000 : 5_000 },
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 3 : undefined,
  forbidOnly: IS_CI,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: BASE,
    actionTimeout: IS_CI ? 15_000 : 0,
    navigationTimeout: IS_CI ? 30_000 : 15_000,
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: { slowMo: IS_CI ? 50 : 0 },
      },
    },
  ],
});
