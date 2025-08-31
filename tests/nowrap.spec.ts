import { expect, test } from '@playwright/test';

test.describe('No-wrap controls', () => {
  test('hero CTA does not overflow at 360px (may wrap)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    const cta = page.locator('main#main-content').getByRole('link', { name: 'Request a Quote' }).first();
    await expect(cta).toBeVisible();
    // Should not horizontally overflow its own box
    const ok = await cta.evaluate((el) => (el as HTMLElement).scrollWidth <= (el as HTMLElement).clientWidth + 1);
    expect(ok).toBeTruthy();
  });

  test('blog chip labels are single-line and ellipsize if needed', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/blog/');
    const chip = page.locator('fieldset .chip').nth(1); // e.g., "Engineering"
    await expect(chip).toBeVisible();
    const h = await chip.evaluate((el) => (el as HTMLElement).getBoundingClientRect().height);
    expect(h).toBeLessThan(44);
    const ws = await chip.evaluate((el) => getComputedStyle(el).whiteSpace);
    expect(ws).toMatch(/nowrap/i);
  });
});
