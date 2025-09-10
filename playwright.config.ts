import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  globalSetup: './tests/setup/global-setup.ts',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  viewport: { width: 1280, height: 900 },
  },
  webServer: {
  // Use production server for deterministic snapshots (no dev overlays, stable rendering)
  command: 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  timeout: 180_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
});
