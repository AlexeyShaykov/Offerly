import { defineConfig, devices } from '@playwright/test';

const PORT = 3200;
const E2E_DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  'postgresql://offerly:offerly@localhost:5432/offerly_test?schema=public';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  // One shared test database, so tests run one after another.
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: `http://localhost:${PORT}`,
    storageState: 'e2e/.auth/user.json',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node_modules/.bin/next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: E2E_DATABASE_URL,
      E2E_TEST_MODE: 'true',
      NEXT_DIST_DIR: '.next-e2e',
      AUTH_SECRET: 'e2e-only-secret-not-used-anywhere-else',
      AUTH_TRUST_HOST: 'true',
      AUTH_GITHUB_ID: 'e2e-unused',
      AUTH_GITHUB_SECRET: 'e2e-unused',
    },
  },
});
