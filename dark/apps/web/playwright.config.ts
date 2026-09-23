import { defineConfig, devices } from "@playwright/test";

/**
 * E2E: front = statyczny build (ten sam co produkcja, z prerenderem) serwowany przez vite preview.
 * API = osobny proces per worker (fixture w @app/testing/playwright).
 * Baza: PGlite w pamięci; w CI E2E_DATABASE_URL=postgres://... (osobna baza per worker).
 */
const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "bun run build && bun run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
