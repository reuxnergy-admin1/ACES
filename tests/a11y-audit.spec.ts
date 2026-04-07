import { test } from '@playwright/test';

// Lightweight a11y collector using axe-core from CDN.
// Intentionally does not fail CI — logs violations for manual triage.
const routes = ['/', '/about/history/', '/products/', '/services/', '/blog/'];

test.describe('A11y audit (axe-core)', () => {
  for (const route of routes) {
    test(`axe audit ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');
      // inject axe from CDN
      await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js' });
      const results = await page.evaluate(async () => {
        // @ts-ignore
        const axe = (window as any).axe;
        if (!axe) return null;
        const r = await axe.run(document, { resultTypes: ['violations'] });
        return { violations: r.violations?.map((v: any) => ({ id: v.id, impact: v.impact, nodes: v.nodes?.length || 0 })) || [] };
      });
      if (results?.violations?.length) {
        // eslint-disable-next-line no-console
        console.warn('[a11y]', route, results.violations);
      }
    });
  }
});

