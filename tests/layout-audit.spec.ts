import { test, expect } from '@playwright/test';

const breakpoints = [360, 390, 414, 640, 768, 1024, 1280, 1440, 1600, 1920];
const routes = [
  '/',
  '/(examples)/home-example',
  '/(examples)/work-index-example',
  '/(examples)/case-study-example',
  '/(examples)/blog-index-example',
  '/(examples)/blog-post-example',
  '/(examples)/about-example',
  '/(examples)/careers-example',
  '/(examples)/contact-example',
];

test.describe('Layout audit', () => {
  for (const width of breakpoints) {
    for (const route of routes) {
      test(`${route} at ${width}px has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1200 });
        await page.goto(route);
        await page.waitForLoadState('domcontentloaded');
        // ensure reduced motion to stabilize screenshots
        await page.emulateMedia({ reducedMotion: 'reduce' });

        const hasOverflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth > doc.clientWidth + 1;
        });
        expect.soft(hasOverflow, 'no horizontal overflow').toBeFalsy();

        // Soft checks for container variables if present
        const cssVars = await page.evaluate(() => {
          const cs = getComputedStyle(document.documentElement);
          return {
            container: cs.getPropertyValue('--container-max').trim() || null,
            containerWide: cs.getPropertyValue('--container-max-wide').trim() || null,
            gutter: cs.getPropertyValue('--grid-gutter').trim() || null,
          };
        });
        if (cssVars.container) expect.soft(cssVars.container).toMatch(/rem|px|ch/);
        if (cssVars.containerWide) expect.soft(cssVars.containerWide).toMatch(/rem|px|ch/);
        if (cssVars.gutter) expect.soft(cssVars.gutter).toMatch(/rem|px/);

        // Screenshot for visual regression (mask animated background and debug overlays)
        const masks = await page.locator('[data-vrt-mask], [data-debug-overlay], canvas[aria-hidden], [data-bg-fallback]');
        await expect(page).toHaveScreenshot({
          fullPage: false, // viewport-only to keep height stable across runs
          mask: [masks],
          timeout: 15000,
        });
      });
    }
  }
});
