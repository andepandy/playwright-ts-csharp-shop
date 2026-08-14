import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './api/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
