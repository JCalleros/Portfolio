import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4321';

test.describe('/ (SkillsShowcase)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/#skills`);
  });

  test('renders section title and orbit', async ({ page }) => {
    const section = page.locator('#skills');
    await expect(section.getByRole('heading', { level: 2, name: /skills/i })).toBeVisible();
    await expect(section.locator('.skill-orbit')).toBeVisible();
    await expect(section.locator('.skill-orbit .center-label')).toHaveText('Full-Stack');
    const nodeCount = await section.locator('.skill-orbit .node').count();
    expect(nodeCount).toBe(12);
    await expect(section.locator('.skill-orbit .node').first()).toHaveAttribute('aria-label', /.+/);
  });

  test('orbit nodes are keyboard focusable', async ({ page }) => {
    const section = page.locator('#skills');
    const firstNode = section.locator('.skill-orbit .node').first();

    await firstNode.focus();
    await expect(firstNode).toBeFocused();

    await firstNode.press('Enter');
    await expect(firstNode).toBeFocused();
  });

  test('grid shows expected groups and chips', async ({ page }) => {
    const section = page.locator('#skills');

    const cards = section.locator('.skill-card');
    expect(await cards.count()).toBe(6);

    for (const title of [
      'Languages',
      'Frameworks',
      'Cloud & DevOps',
      'Data',
      'Testing & QA',
      'Tooling',
    ]) {
      await expect(section.getByRole('heading', { level: 3, name: title })).toBeVisible();
    }

    const chips = section.locator('.skill-card .skill-chip');
    expect(await chips.count()).toBeGreaterThan(2);
    await expect(chips.first()).toContainText(/\w/);
  });

  test('high-signal skills are visible (orbit or card)', async ({ page }) => {
    const section = page.locator('#skills');

    for (const label of ['React', 'Python', 'Django', 'Flas', 'AWS', 'Docker', 'MySQL', 'Postgres']) {
      const orbitMatches = await section
        .locator(`.skill-orbit .node[aria-label="${label}"]`)
        .count();

      const cardMatches = await section
        .locator('.skill-card .skill-chip', { hasText: label })
        .count();

      expect(orbitMatches + cardMatches).toBeGreaterThan(0);
    }
  });
});
