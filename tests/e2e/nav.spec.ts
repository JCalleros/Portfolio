import { test, expect } from '@playwright/test';
const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Navigation', () => {
  test('Projects link routes to /projects from home', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    const nav = page.locator('#site-nav');
    await nav.getByRole('link', { name: /^projects$/i }).click();
    await expect(page).toHaveURL(/\/projects(?:\/)?$/);
  });

  test('cross-page: section links from project detail go back to home with hash', async ({ page }) => {
    await page.goto(`${BASE}/projects/buildinhub`, { waitUntil: 'domcontentloaded' });
    const nav = page.locator('#site-nav');
    await nav.getByRole('link', { name: /^skills$/i }).click();
    await expect(page).toHaveURL(/\/#skills$/);
    await expect(page.locator('#skills').getByRole('heading', { name: /skills/i })).toBeVisible();
  });

  test('mobile menu: opens and closes on link click', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    const openBtn = page.locator('#menu-btn');
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await expect(openBtn).toHaveAttribute('aria-expanded', 'true');
    await menu.getByRole('link', { name: /^contact$/i }).click();
    await expect(menu).toBeHidden();
    await expect(openBtn).toHaveAttribute('aria-expanded', 'false');
  });
});
