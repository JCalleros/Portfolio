import { test, expect } from '@playwright/test';
import { disableAnimations } from './utils';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await disableAnimations(page);
  });

  test('has title and hero CTAs', async ({ page }) => {
    await expect(page).toHaveTitle(/jorge|calleros|software engineer/i);

    const nav = page.locator('#site-nav');
    const hero = page.locator('#hero');
    const navContact = nav.getByRole('link', { name: /^contact$/i });
    await expect(navContact).toHaveAttribute('href', '#contact');
    const heroContact = hero.getByRole('link', { name: /^contact$/i });
    const cv = hero.getByRole('link', { name: /download cv/i });
    await expect(heroContact).toHaveAttribute('href', '#contact');
    await expect(cv).toHaveAttribute('href', '/cv.pdf');
  });

  test('key sections are present', async ({ page }) => {
    for (const [id, name] of [
      ['projects', /projects/i],
      ['experience', /experience/i],
      ['skills', /skills/i],
      ['contact', /let.?s work together/i],
    ] as const) {
      const s = page.locator(`#${id}`);
      await expect(s).toBeVisible();
      await expect(s.getByRole('heading', { name })).toBeVisible();
    }
  });

  test('projects carousel: arrows + keyboard move active slide', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();

    const getActiveIndex = async () =>
      await page.locator('.slide[data-pos="center"]').getAttribute('data-i');

    const before = await getActiveIndex();
    const nextBtn = page.locator('[data-next], button[aria-label="Next project"]');
    await nextBtn.first().click();
    await expect.poll(getActiveIndex).not.toBe(before);
    await page.locator('#stage').focus();
    const afterClick = await getActiveIndex();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(getActiveIndex).not.toBe(afterClick);

    const dotCount = await page.locator('.dots .dot').count();
    expect(dotCount).toBeGreaterThan(0);
  });

  test('achievements counters tick when visible (if present)', async ({ page }) => {
    const counters = page.locator('.counter');
    const count = await counters.count();
    if (count === 0) test.skip(true, 'No counters on this build');
    await counters.first().scrollIntoViewIfNeeded();

    await expect
      .poll(async () => (await counters.first().innerText()).trim())
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
