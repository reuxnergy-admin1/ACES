import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Reference site routes to crawl
const base = 'https://riseatseven.com';
const routes = [
  '/',
  '/services',
  '/work',
  // A representative case study; if 404 occurs, test logs and continues
  '/work/ikea-uk',
  '/blog',
  // A representative blog post; if 404 occurs, test logs and continues
  '/blog/ai-seo-content-automation',
  '/about',
  '/careers',
  '/contact'
];

const breakpoints = [360, 390, 414, 640, 768, 1024, 1280, 1440, 1600, 1920];

type Metrics = {
  route: string;
  width: number;
  overflow: boolean;
  containerMax?: number;
  paddingLeft?: number;
  paddingRight?: number;
  gutterHeuristic?: number;
};

const resultsDir = path.join(process.cwd(), 'test-results');
const metricsPath = path.join(resultsDir, 'reference-metrics.json');

test.describe('External reference audit (riseatseven.com)', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(resultsDir, { recursive: true });
  });

  for (const width of breakpoints) {
    for (const route of routes) {
      test(`audit ${route} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1200 });
        const url = base + route;
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        if (!response || !response.ok()) {
          test.info().annotations.push({ type: 'note', description: `Navigation issue: ${response?.status()} ${url}` });
        }

        // Give layout a moment to settle (fonts, CLS mitigations)
        await page.waitForTimeout(500);

        // Compute metrics in page context
        const metrics = await page.evaluate(() => {
          function px(n: string) {
            const v = parseFloat(n || '0');
            return Number.isFinite(v) ? v : 0;
          }
          const doc = document.documentElement;
          const overflow = doc.scrollWidth > doc.clientWidth + 1;

          const all = Array.from(document.querySelectorAll<HTMLElement>('body *'));
          let containerMax = 0;
          let paddingLeft = 0;
          let paddingRight = 0;
          let gutterHeuristic = 0;

          for (const el of all) {
            const cs = getComputedStyle(el);
            const w = el.clientWidth;
            // centered via auto margins or equal margins and within viewport
            const ml = px(cs.marginLeft);
            const mr = px(cs.marginRight);
            const isCentered = (cs.marginLeft === 'auto' && cs.marginRight === 'auto') || Math.abs(ml - mr) < 0.5;
            if (isCentered && w <= doc.clientWidth && w > containerMax) {
              containerMax = w;
              paddingLeft = px(cs.paddingLeft);
              paddingRight = px(cs.paddingRight);
            }
            // gutter heuristic: take max of gaps from grids/flex with gap
            const gap = px(cs.gap) || Math.max(px(cs.columnGap), px(cs.rowGap));
            if (gap > gutterHeuristic) gutterHeuristic = gap;
          }

          return { overflow, containerMax, paddingLeft, paddingRight, gutterHeuristic };
        });

        const record: Metrics = { route, width, ...metrics };

        // Persist screenshot
        const safeRoute = route.replace(/\//g, '_') || '_';
        const shotName = `reference${safeRoute}-${width}.png`;
        await page.screenshot({ path: path.join(resultsDir, shotName), fullPage: true, animations: 'disabled' });

        // Append metrics to JSON file
        let data: Metrics[] = [];
        if (fs.existsSync(metricsPath)) {
          try { data = JSON.parse(fs.readFileSync(metricsPath, 'utf8')) as Metrics[]; } catch {}
        }
        data.push(record);
        fs.writeFileSync(metricsPath, JSON.stringify(data, null, 2), 'utf8');

        // Always pass; this is an audit collector
        expect(true).toBeTruthy();
      });
    }
  }
});
