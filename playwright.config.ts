import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  viewport: { width: 1280, height: 900 },
  },
  webServer: {
  command: 'npm run dev -- -p 3000',
  url: 'http://localhost:3000',
  reuseExistingServer: true,
  timeout: 180_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
});
