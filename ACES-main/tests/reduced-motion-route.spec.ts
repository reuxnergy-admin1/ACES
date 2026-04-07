import { test, expect } from '@playwright/test';

test('route transitions skip blob overlay when reduced motion is preferred', async ({ page, context }) => {
  await context.addInitScript(() => {
    // Force prefers-reduced-motion
    const mql = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
    const orig: typeof window.matchMedia = window.matchMedia.bind(window);
    (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = (q: string) => (
      q.includes('prefers-reduced-motion') ? mql : orig(q)
    );
  });
  await page.goto('/');
  // Click an internal nav link if present, otherwise fall back to home logo
  const navLink = page.locator('nav[aria-label="Primary"] a[href^="/"]').first();
  if (await navLink.count()) {
    await navLink.click();
  } else {
    const home = page.locator('a[href="/"]').first();
    if (await home.count()) await home.click();
  }
  // Blob overlay should not be active
  const active = await page.evaluate(() => document.querySelector('.pt-blob-svg')?.getAttribute('data-active'));
  expect(active === '0' || active == null).toBeTruthy();
});
