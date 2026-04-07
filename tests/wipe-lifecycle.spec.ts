import { expect, test } from '@playwright/test';

test.describe('Page Transition Wipe Lifecycle', () => {
  // Pre-warm the /blog route to avoid first-hit dev compile races
  test.beforeEach(async ({ request }) => {
    await request.get('/blog/');
  });

  test('locks engage during nav and clear after reveal', async ({ page }) => {
    await page.goto('/');
  // Ensure animations are enabled so overlay engages
  await page.emulateMedia({ reducedMotion: 'no-preference' });

    // Click Blog from the primary nav (nav simplified)
    const blogLink = page.locator('nav[aria-label="Primary"] a', { hasText: 'BLOG' });
    await expect(blogLink).toBeVisible();
  await blogLink.click();
  // Wait for navigation to begin to ensure the click wasn't intercepted
  await page.waitForURL(/\/blog\//, { timeout: 3000 });

    // Quickly verify that locks engaged
    await expect.poll(async () => {
      return page.evaluate(() => ({
        noEvents: document.body.classList.contains('pt-no-events'),
        scrollLock: document.body.classList.contains('pt-disable-scroll'),
        cursorHide: document.body.classList.contains('cursor-hide-transition'),
        overlayActive: document.querySelector('svg.pt-blob-svg')?.getAttribute('data-active') === '1',
      }));
  }, { timeout: 1500 }).toMatchObject({ noEvents: true, scrollLock: true, cursorHide: true, overlayActive: true });

  // Wait for network to settle, then the overlay to complete within acceptance window
  await page.waitForLoadState('networkidle');
  await expect.poll(async () => {
      return page.evaluate(() => document.querySelector('svg.pt-blob-svg')?.getAttribute('data-active'));
  }, { timeout: 4000 }).toBe('0');

    // Locks should be cleared deterministically
    const locks = await page.evaluate(() => ({
      noEvents: document.body.classList.contains('pt-no-events'),
      scrollLock: document.body.classList.contains('pt-disable-scroll'),
      cursorHide: document.body.classList.contains('cursor-hide-transition'),
    }));
    expect(locks.noEvents).toBeFalsy();
    expect(locks.scrollLock).toBeFalsy();
    expect(locks.cursorHide).toBeFalsy();

  await expect(page).toHaveURL(/\/blog\//);
  });
});
