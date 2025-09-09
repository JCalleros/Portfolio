import type { Locator, Page } from '@playwright/test';

export async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      * { transition: none !important; animation: none !important; }
      html, body { scroll-behavior: auto !important; }
    `,
  });
}

export async function bringIntoView(page: Page, locator: Locator, browserName: string, block: ScrollLogicalPosition = 'center') {
  if (browserName === 'webkit') {
    await locator.evaluate((el, b) => el?.scrollIntoView({ behavior: 'auto', block: b }), block);
    await locator.waitFor({ state: 'visible' });
  } else {
    // @ts-ignore available at runtime
    await locator.scrollIntoViewIfNeeded();
  }
}

export async function waitInViewport(page: Page, locator: Locator) {
  const handle = await locator.elementHandle();
  await page.waitForFunction(
    (el) => {
      if (!el) return false;
      const r = (el as HTMLElement).getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    },
    handle,
    { timeout: 10_000 }
  );
}
