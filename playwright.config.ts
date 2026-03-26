import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  // Run tests sequentially, not fully in parallel
  fullyParallel: false,

  // Fail the build on CI if test.only was left accidentally
  forbidOnly: !!process.env.CI,

  // Retry failed tests only on CI
  retries: process.env.CI ? 2 : 0,

  // Use 1 worker on CI
  workers: process.env.CI ? 1 : undefined,

  // HTML report
  reporter: 'html',

  // Shared settings for all tests
use: {
  baseURL: 'https://qauto.forstudy.space',
  httpCredentials: {
    username: 'guest',
    password: 'welcome2qauto',
  },
  video: 'retain-on-failure',
  screenshot: 'on-first-failure',
  trace: 'retain-on-failure',
},

  // Keep only one browser project
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});