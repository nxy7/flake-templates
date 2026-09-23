import { expect, test } from "@app/testing/playwright";
import type { Page } from "@playwright/test";

/** Kryteria akceptacji auth: rejestracja, wylogowanie, ochrona /app, logowanie, błędne hasło. */
const register = async (page: Page, email: string, password = "password123") => {
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Hasło").fill(password);
  await page.getByRole("button", { name: "Utwórz konto" }).click();
  await expect(page.getByRole("heading", { name: "Twoje notatki" })).toBeVisible();
};

test("wylogowanie zamyka dostęp do /app, ponowne logowanie przywraca notatki", async ({ page }) => {
  await register(page, "cykl@example.test");
  await page.getByLabel("Tytuł").fill("Przetrwa wylogowanie");
  await page.getByRole("button", { name: "Dodaj notatkę" }).click();
  await expect(page.getByRole("heading", { name: "Przetrwa wylogowanie" })).toBeVisible();

  await page.getByRole("button", { name: "Wyloguj" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill("cykl@example.test");
  await page.getByLabel("Hasło").fill("password123");
  await page.getByRole("button", { name: "Zaloguj" }).click();
  await expect(page.getByRole("heading", { name: "Przetrwa wylogowanie" })).toBeVisible();
});

test("błędne hasło pokazuje komunikat i nie wpuszcza", async ({ page }) => {
  await register(page, "zle@example.test");
  await page.getByRole("button", { name: "Wyloguj" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill("zle@example.test");
  await page.getByLabel("Hasło").fill("niepoprawne1");
  await page.getByRole("button", { name: "Zaloguj" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("/app bez sesji przekierowuje do logowania", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Zaloguj się" })).toBeVisible();
});
