import { defineConfig, devices } from '@playwright/test';

// The older specs are preserved as historical mock-era evidence. RC tests use the
// current Caddy/API stack and environment-provided credentials only.
export default defineConfig({
  testDir: './tests',
  testMatch: '**/release-candidate.spec.ts',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost',
    connectOptions: process.env.WS_URL ? { wsEndpoint: process.env.WS_URL } : undefined,
    ...devices['Desktop Chrome'],
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
