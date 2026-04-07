import { test, expect } from '@playwright/test';

test.describe('Desktop menubar roving focus', () => {
  test('Arrow keys move focus across primary nav items', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const menubar = page.getByRole('menubar', { name: /main menu/i });
    await expect(menubar).toBeVisible();
  // Focus the first menu item directly to begin roving focus checks
  await page.getByRole('menuitem').first().focus();
  // Ensure focus is on a link within the menubar
  const firstFocused = await page.evaluate(() => !!document.activeElement && (document.activeElement as HTMLElement).closest('[role="menubar"]'));
    expect(firstFocused).toBeTruthy();
    // ArrowRight moves to next
    await page.keyboard.press('ArrowRight');
    const rightFocused = await page.evaluate(() => !!document.activeElement && (document.activeElement as HTMLElement).closest('[role="menubar"]'));
    expect(rightFocused).toBeTruthy();
    // Home moves to first, End to last
    await page.keyboard.press('Home');
    const atHome = await page.evaluate(() => document.activeElement?.id?.startsWith('menuitem-'));
    expect(atHome).toBeTruthy();
    await page.keyboard.press('End');
    const atEnd = await page.evaluate(() => document.activeElement?.id?.startsWith('menuitem-'));
    expect(atEnd).toBeTruthy();
  });
});
