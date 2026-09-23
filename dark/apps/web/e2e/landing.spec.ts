import { expect, test } from "@app/testing/playwright";
import { landing } from "../src/content/landing";

/** Landing: treść pochodzi z content/landing.ts, więc test działa po podmianie treści. */
test("landing jest prerenderowany: treść, title i description są w HTML bez JS", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain(landing.hero.lead);
  expect(html).toContain(`<title>${landing.meta.title}</title>`);
  expect(html).toContain(`content="${landing.meta.description}"`);
  const about = await (await request.get("/about/")).text();
  expect(about).toContain("O projekcie");
});

test("landing: nagłówek, sekcje i CTA prowadzą do rejestracji", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(landing.hero.title);
  for (const title of [landing.features?.title, landing.steps?.title, landing.faq?.title]) {
    if (title) await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  const faq = landing.faq?.items[0];
  if (faq) {
    await page.getByText(faq.q).click();
    await expect(page.getByText(faq.a)).toBeVisible();
  }
  await page.getByRole("link", { name: landing.hero.primary.label }).first().click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page).toHaveTitle(/Załóż konto/);
});
