import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4321';
const SLUG = 'buildinhub';

test.describe('/projects/[slug] detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-ignore - provide a minimal clipboard impl for the page
      globalThis.navigator.clipboard = { writeText: async () => {} };
    });
    await page.goto(`${BASE}/projects/${SLUG}`);
  });

  test('renders hero + gallery rail', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: /buildinhub/i })).toBeVisible();
    await expect(page.locator('#main-media')).toBeVisible();
    const thumbs = page.locator('#thumbs .thumb');
    expect(await thumbs.count()).toBeGreaterThan(0);
  });

  test('clicking a thumbnail swaps the main image and updates active state', async ({ page }) => {
    const main = page.locator('#main-media');
    const thumbs = page.locator('#thumbs .thumb');
    const count = await thumbs.count();
    expect(count).toBeGreaterThan(0);

    const first = thumbs.nth(0);
    await expect(first).toHaveClass(/is-active/);

    if (count > 1) {
      const beforeSrc = await main.getAttribute('src');
      const second = thumbs.nth(1);

      await second.click();

      const afterSrc = await main.getAttribute('src');
      expect(afterSrc).not.toBe(beforeSrc);

      await expect(second).toHaveClass(/is-active/);
      await expect(first).not.toHaveClass(/is-active/);
    }
  });

  test('prev/next navigation cards (if present) go to other case studies', async ({ page }) => {
    const nextCard = page.locator('a.card:has-text("Next")').first();
    const prevCard = page.locator('a.card:has-text("Previous")').first();
    if (await nextCard.count()) {
      const href = await nextCard.getAttribute('href');
      expect(href).toMatch(/^\/projects\/.+/);
      await nextCard.click();
      await expect(page).toHaveURL(/\/projects\/.+/);
    } else if (await prevCard.count()) {
      const href = await prevCard.getAttribute('href');
      expect(href).toMatch(/^\/projects\/.+/);
      await prevCard.click();
      await expect(page).toHaveURL(/\/projects\/.+/);
    }
  });
});
