import { test, expect } from '@playwright/test';
const BASE = process.env.BASE_URL || 'http://localhost:4321';

const cardLinks = '#gallery a[href^="/projects/"], main a[href^="/projects/"], a[href^="/projects/"]';

test.describe('/projects list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('renders header and at least one case study link', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1, name: /projects|case stud|work/i });
    await expect(h1).toBeVisible();

    const links = page.locator(cardLinks);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a project card navigates to its case study', async ({ page }) => {
    const link = page.locator(cardLinks).first();
    await expect(link).toBeVisible();
    const href = (await link.getAttribute('href'))!;
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });
});
