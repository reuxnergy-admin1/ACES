import { expect, test } from '@playwright/test';

test.describe('Reveals and Button Targets', () => {
  test('home blur-stagger reveals in view', async ({ page }) => {
    await page.goto('/');
  // Reduce motion to stabilize reveal timings
  await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForSelector('[data-reveal-blur-stagger]');
    const grid = page.locator('[data-reveal-blur-stagger]').first();
    await expect(grid).toBeVisible();
    // Pre-warm should mark container as in view, or it will shortly after IO fires
  await expect.poll(async () => {
      return grid.evaluate((el) => el.classList.contains('is-inview'));
  }, { timeout: 3000 }).toBeTruthy();
  });

  test('hero CTA meets 44px min target and arrow affordance', async ({ page }) => {
    await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
    const main = page.locator('main#main-content');
    const cta = main.getByRole('link', { name: 'Request a Quote' }).first();
    await expect(cta).toBeVisible();
    const h = await cta.evaluate((el) => Math.round((el as HTMLElement).getBoundingClientRect().height));
    expect(h).toBeGreaterThanOrEqual(44);
    // Arrow affordance present
    await expect(cta.locator('.arrow')).toBeVisible();
  });
});
