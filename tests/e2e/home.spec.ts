import { test, expect } from '@playwright/test';
import { disableAnimations, bringIntoView, waitInViewport } from './utils';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await disableAnimations(page);
  });

  test('has title and hero CTAs', async ({ page, browserName }) => {
    const hero = page.locator('#hero');
    await bringIntoView(page, hero, browserName, 'start');
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(hero.getByRole('link').first()).toBeVisible();
  });

  test('key sections are present', async ({ page, browserName }) => {
    for (const id of ['projects', 'skills', 'experience', 'contact']) {
      const section = page.locator(`#${id}`);
      await bringIntoView(page, section, browserName);
      await expect(section).toBeVisible();
    }
  });

  test('projects carousel: arrows + keyboard move active slide', async ({ page, browserName }) => {
    const section = page.locator('#projects');
    await bringIntoView(page, section, browserName);

    const centered = page.locator('.slide[data-pos="center"]').first();
    await centered.waitFor({ state: 'visible' });

    const getActiveIndex = async () =>
      page.locator('.slide[data-pos="center"]').getAttribute('data-i');

    const before = await getActiveIndex();

    if (browserName === 'webkit') {
      await page.locator('#stage').first().focus();
      await page.keyboard.press('ArrowRight');
    } else {
      await page.locator('[data-next], button[aria-label="Next project"]').first().click();
    }

    await expect.poll(getActiveIndex, { timeout: 5_000 }).not.toBe(before);

    const after = await getActiveIndex();
    await page.locator('#stage').first().focus();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(getActiveIndex, { timeout: 5_000 }).not.toBe(after);
  });

  test('achievements counters tick when visible (if present)', async ({ page, browserName }) => {
    const counters = page.locator('[data-counter]');
    const count = await counters.count();
    if (count === 0) test.skip(true, 'No counters on this build');

    const first = counters.first();
    await bringIntoView(page, first, browserName);
    await waitInViewport(page, first);
    await page.waitForTimeout(150);

    await expect
      .poll(async () => (await first.innerText()).trim(), { timeout: 7_000 })
      .not.toBe('0');
  });

  test('contact form exists', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact form')).toBeVisible();
  });

  test('CV button forces PDF download', async ({ page }) => {
    const hero = page.locator('#hero');
    const cv = hero.getByRole('link', { name: /download cv/i });
    await expect(cv).toHaveAttribute('href', '/cv.pdf');
    await expect(cv).toHaveAttribute('download', /.+\.pdf$/);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      cv.click(),
    ]);

    const name = download.suggestedFilename().toLowerCase();
    expect(name).toMatch(/\.pdf$/);
    expect(name).toContain('jorge');
  });
});
