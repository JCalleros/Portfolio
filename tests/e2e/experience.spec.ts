import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('/ (ExperienceTimeline)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    const section = page.locator('#experience');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await page.waitForSelector('#experience .timeline .timeline-item');
  });

  test('renders entries with heading, date range and bullets', async ({ page }) => {
    const items = page.locator('#experience .timeline .timeline-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      await expect(item.locator('h3')).toBeVisible();
      const hasYear = await item.locator('span', { hasText: /\b20\d{2}\b/ }).first().isVisible();
      expect(hasYear).toBeTruthy();
      const bullets = item.locator('ul > li');
      expect(await bullets.count()).toBeGreaterThan(0);
    }
  });

  test('each entry shows a logo image OR an initials avatar; tags/metrics render when present', async ({ page }) => {
    const items = page.locator('#experience .timeline .timeline-item');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const logoCount = await item.locator('img[alt=""]').count();
      const initialsCount = await item.locator('[aria-hidden="true"]').count();
      expect(logoCount + initialsCount).toBeGreaterThan(0);
      const tags = item.locator('.tag');
      if (await tags.count()) {
        await expect(tags.first()).toBeVisible();
      }
      const dts = item.locator('dl dt');
      const dds = item.locator('dl dd');
      const dtN = await dts.count();
      const ddN = await dds.count();
      if (dtN || ddN) {
        expect(dtN).toBeGreaterThan(0);
        expect(dtN).toBe(ddN);
        await expect(dts.first()).toBeVisible();
        await expect(dds.first()).toBeVisible();
      }
    }
  });
});
