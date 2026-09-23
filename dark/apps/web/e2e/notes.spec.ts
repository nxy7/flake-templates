import { expect, test } from "@app/testing/playwright";

/**
 * Kryteria akceptacji przekroju "notes" (SPEC: scenariusze E2E).
 * Nowa funkcja = nowy plik *.spec.ts z kryteriów w SPEC.md, pisany PRZED implementacją.
 */
test("rejestracja -> dodanie notatki -> odświeżenie -> notatka jest", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Email").fill("e2e@example.test");
  await page.getByLabel("Hasło").fill("password123");
  await page.getByRole("button", { name: "Utwórz konto" }).click();

  await expect(page.getByRole("heading", { name: "Twoje notatki" })).toBeVisible();
  await expect(page.getByText("Brak notatek")).toBeVisible();

  await page.getByLabel("Tytuł").fill("Kupić mleko");
  await page.getByLabel("Treść").fill("2 litry");
  await page.getByRole("button", { name: "Dodaj notatkę" }).click();
  const list = page.getByRole("list", { name: "Notatki" });
  await expect(list.getByRole("heading", { name: "Kupić mleko" })).toBeVisible();

  await page.reload();
  await expect(list.getByRole("heading", { name: "Kupić mleko" })).toBeVisible();
  await expect(list.getByText("2 litry")).toBeVisible();
});

test("edycja i usunięcie notatki", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Email").fill("edit@example.test");
  await page.getByLabel("Hasło").fill("password123");
  await page.getByRole("button", { name: "Utwórz konto" }).click();

  await page.getByLabel("Tytuł").fill("Wersja 1");
  await page.getByRole("button", { name: "Dodaj notatkę" }).click();
  const list = page.getByRole("list", { name: "Notatki" });
  await list.getByRole("button", { name: "Edytuj" }).click();
  await list.getByLabel("Tytuł").fill("Wersja 2");
  await list.getByRole("button", { name: "Zapisz" }).click();
  await expect(list.getByRole("heading", { name: "Wersja 2" })).toBeVisible();

  await list.getByRole("button", { name: "Usuń" }).click();
  await expect(page.getByText("Brak notatek")).toBeVisible();
});
