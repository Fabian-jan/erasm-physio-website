import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    // `astro preview` (Astro 7) se détache en arrière-plan et rend la main immédiatement,
    // ce qui casse la gestion de process de Playwright : on sert dist/ avec un serveur
    // statique dédié qui reste au premier plan.
    command: 'npm run serve:dist',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
