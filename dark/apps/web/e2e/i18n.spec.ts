import { expect, test } from "@app/testing/playwright";
import { en, pl } from "./messages";

/** i18n (Paraglide, strategia url): / = angielski (domyślny), /pl/... = polski. */
test("each language has its own prerendered HTML with lang, title and content", async ({ request }) => {
  const plHtml = await (await request.get("/pl/")).text();
  expect(plHtml).toContain('<html lang="pl"');
  expect(plHtml).toContain(`<title>${pl.meta_home_title}</title>`);
  expect(plHtml).toContain(pl.hero_lead);
  const plAbout = await (await request.get("/pl/about/")).text();
  expect(plAbout).toContain(pl.about_body);
});

test("language switcher keeps the page and switches the language", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("navigation", { name: en.language_label }).getByRole("link", { name: "PL" }).click();
  await expect(page).toHaveURL(/\/pl\/about\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(pl.about_title!);

  await page.getByRole("navigation", { name: pl.language_label }).getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.about_title!);
});

test("the app works in Polish: sign-up and notes stay under /pl", async ({ page }) => {
  await page.goto("/pl/app");
  await expect(page).toHaveURL(/\/pl\/login$/);
  await page.getByRole("link", { name: pl.auth_goto_register }).click();
  await expect(page).toHaveURL(/\/pl\/register$/);

  await page.getByLabel(pl.auth_email!).fill("pl@example.test");
  await page.getByLabel(pl.auth_password!).fill("password123");
  await page.getByRole("button", { name: pl.auth_submit_register }).click();
  await expect(page).toHaveURL(/\/pl\/app\/?$/);
  await expect(page.getByRole("heading", { name: pl.notes_title })).toBeVisible();
  await expect(page.getByText(pl.notes_empty!)).toBeVisible();
  await expect(page).toHaveTitle(pl.meta_app_title!);
});
