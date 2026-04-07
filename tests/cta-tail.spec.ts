import { expect, test } from '@playwright/test';

test.describe('CTA tail keeps last word + arrow together', () => {
  test('hero secondary (Speak to a Specialist)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    const link = page.getByRole('link', { name: /Speak to a Specialist/i });
    await expect(link).toBeVisible();
    const tail = link.locator('.btn-tail');
    await expect(tail).toBeVisible();
    // Arrow and final word should be on same row (similar top values)
    const sameRow = await tail.evaluate((el) => {
      const arrow = el.querySelector('.arrow') as HTMLElement | null;
      const label = el.querySelector('span:not(.arrow)') as HTMLElement | null;
      if (!arrow || !label) return false;
      const aTop = Math.round(arrow.getBoundingClientRect().top);
      const lTop = Math.round(label.getBoundingClientRect().top);
      return Math.abs(aTop - lTop) <= 1;
    });
    expect(sameRow).toBeTruthy();
  });

  test('sector CTA (Specialist Call)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    const link = page.getByRole('link', { name: /Specialist Call/i });
    await expect(link).toBeVisible();
    const tail = link.locator('.btn-tail');
    await expect(tail).toBeVisible();
    const sameRow = await tail.evaluate((el) => {
      const arrow = el.querySelector('.arrow') as HTMLElement | null;
      const label = el.querySelector('span:not(.arrow)') as HTMLElement | null;
      if (!arrow || !label) return false;
      const aTop = Math.round(arrow.getBoundingClientRect().top);
      const lTop = Math.round(label.getBoundingClientRect().top);
      return Math.abs(aTop - lTop) <= 1;
    });
    expect(sameRow).toBeTruthy();
  });
});

