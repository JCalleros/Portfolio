import { test, expect } from '@playwright/test';

// Use BASE_URL if you prefer: BASE_URL=http://localhost:4321 npm run test
const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`);
  });

  test('has title and hero CTAs', async ({ page }) => {
    await expect(page).toHaveTitle(/jorge|calleros|software engineer/i);

    const nav = page.locator('#site-nav');
    const hero = page.locator('#hero');

    // Contact link in NAV
    const navContact = nav.getByRole('link', { name: /^contact$/i });
    await expect(navContact).toHaveAttribute('href', '#contact');

    // Contact + CV links in HERO
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

    // Next (button or data-next)
    const nextBtn = page.locator('[data-next], button[aria-label="Next project"]');
    await nextBtn.first().click();

    await expect.poll(getActiveIndex).not.toBe(before);

    // Keyboard left
    await page.locator('#stage').focus();
    const afterClick = await getActiveIndex();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(getActiveIndex).not.toBe(afterClick);

    // Dots exist
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
});
