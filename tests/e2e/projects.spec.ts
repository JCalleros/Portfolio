import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('/projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/projects`, { waitUntil: 'load' });
  });

  test('renders H1 and featured block', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /case studies|projects/i })
    ).toBeVisible();

    const featuredLink = page.locator('section a[aria-label^="Open "]').first();
    await expect(featuredLink).toHaveAttribute('href', /\/projects\/.+/);
  });

  test('progressive reveal: expands, scrolls to first extra, and collapses', async ({ page }) => {
    const gallery = page.locator('#gallery');
    const btn = page.locator('#reveal-more');

    await expect(gallery).toHaveAttribute('data-expanded', 'false');

    const { initial, extrasCount } = await page.evaluate(() => {
      const g = document.getElementById('gallery')!;
      const init = Number(g.getAttribute('data-initial') || '0');
      const total = g.children.length;
      return { initial: init, extrasCount: Math.max(0, total - init) };
    });

    test.skip(extrasCount === 0, 'No extras to reveal on this dataset');

    const collapsedCount = async () =>
      page.evaluate(() => {
        const g = document.getElementById('gallery')!;
        const init = Number(g.getAttribute('data-initial') || '0');
        const children = Array.from(g.children);
        const extras = children.slice(init) as HTMLElement[];
        return extras.filter((el) => el.offsetHeight === 0).length;
      });

    await expect.poll(collapsedCount, { timeout: 3000 }).toBe(extrasCount);
    await btn.click();
    await expect(gallery).toHaveAttribute('data-expanded', 'true');
    await expect(btn).toHaveText(/show less/i);
    await expect.poll(collapsedCount, { timeout: 3000 }).toBe(0);
    const firstExtraInView = await page.evaluate(() => {
      const g = document.getElementById('gallery')!;
      const init = Number(g.getAttribute('data-initial') || '0');
      const firstExtra = g.children[init] as HTMLElement | undefined;
      if (!firstExtra) return false;
      const r = firstExtra.getBoundingClientRect();
      return r.top < innerHeight - 24;
    });
    expect(firstExtraInView).toBeTruthy();
    await btn.click();
    await expect(gallery).toHaveAttribute('data-expanded', 'false');
    await expect(btn).toHaveText(/show \d+ more/i);
    await expect.poll(collapsedCount, { timeout: 3000 }).toBe(extrasCount);
  });

  test('clicking a gallery card opens the case study', async ({ page }) => {
    const firstCardLink = page.locator('#gallery a[href^="/projects/"]').first();
    await expect(firstCardLink).toBeVisible();
    const href = await firstCardLink.getAttribute('href');
    await firstCardLink.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });
});
