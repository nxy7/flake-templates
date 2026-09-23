import { expect, test } from "@app/testing/playwright";
import { en } from "./messages";

/** Landing (angielski, domyślny): treść z messages/en.json, więc test przeżywa zmianę tekstów. */
test("landing is prerendered: content, title and description are in the HTML without JS", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('<html lang="en"');
  expect(html).toContain(en.hero_lead);
  expect(html).toContain(`<title>${en.meta_home_title}</title>`);
  expect(html).toContain(`content="${en.meta_home_description}"`);
  const about = await (await request.get("/about/")).text();
  expect(about).toContain(en.about_body);
});

test("landing: heading, sections and CTA lead to sign-up", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.hero_title!);
  for (const title of [en.features_title, en.steps_title, en.faq_title]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await page.getByText(en.faq_1_q!).click();
  await expect(page.getByText(en.faq_1_a!)).toBeVisible();
  await page.getByRole("link", { name: en.hero_primary }).first().click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page).toHaveTitle(en.meta_register_title!);
});
