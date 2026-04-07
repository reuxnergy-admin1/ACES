import { test, expect } from '@playwright/test';

test.describe('Mobile nav accessibility', () => {
  test('focus stays inside menu when open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
    // Open menu
    await page.getByRole('button', { name: /menu/i }).click();
    const dialog = page.getByRole('dialog', { name: /menu/i });
    await expect(dialog).toBeVisible();
    // Tab a few times and ensure focus remains within the dialog
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const inDialog = await page.evaluate(() => !!document.activeElement?.closest('dialog[open]'));
      expect(inDialog).toBeTruthy();
    }
    // Escape closes
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('skip to content reveals link and moves focus', async ({ page }) => {
  await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /skip to content/i });
    await expect(skip).toBeVisible();
    await skip.press('Enter');
    const mainFocused = await page.evaluate(() => document.activeElement?.id === 'main-content');
    expect(mainFocused).toBeTruthy();
  });
});
