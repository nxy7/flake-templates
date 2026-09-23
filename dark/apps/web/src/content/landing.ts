import type { IconName } from "../components/Icon";
import { m } from "../paraglide/messages.js";

/**
 * Struktura landingu. Teksty: messages/<locale>.json (Paraglide), tu tylko ich układ.
 * Sekcję wyłączasz, ustawiając ją na null. Bez wymyślonych liczb i opinii (PRODUCT.md).
 */
export type Landing = {
  meta: { title: string; description: string };
  hero: {
    title: string;
    /** Fragment tytułu podkreślony "atramentem". Musi występować w title (w każdym języku). */
    highlight: string;
    lead: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
    sampleLabel: string;
    /** Przykładowe notatki na "kartce" obok nagłówka (ilustracja, nie dane). */
    sample: { title: string; body: string }[];
    newNote: string;
  };
  features: { title: string; items: { icon: IconName; title: string; body: string }[] } | null;
  steps: { title: string; items: { title: string; body: string }[] } | null;
  faq: { title: string; items: { q: string; a: string }[] } | null;
  cta: { title: string; body: string; action: { label: string; href: string } } | null;
};

export const landing = (): Landing => ({
  meta: { title: m.meta_home_title(), description: m.meta_home_description() },
  hero: {
    title: m.hero_title(),
    highlight: m.hero_highlight(),
    lead: m.hero_lead(),
    primary: { label: m.hero_primary(), href: "/register" },
    secondary: { label: m.hero_secondary(), href: "/login" },
    sampleLabel: m.hero_sample_label(),
    sample: [
      { title: m.hero_sample_1_title(), body: m.hero_sample_1_body() },
      { title: m.hero_sample_2_title(), body: m.hero_sample_2_body() },
    ],
    newNote: m.hero_new_note(),
  },
  features: {
    title: m.features_title(),
    items: [
      { icon: "devices", title: m.feature_1_title(), body: m.feature_1_body() },
      { icon: "lock", title: m.feature_2_title(), body: m.feature_2_body() },
      { icon: "pen", title: m.feature_3_title(), body: m.feature_3_body() },
    ],
  },
  steps: {
    title: m.steps_title(),
    items: [
      { title: m.step_1_title(), body: m.step_1_body() },
      { title: m.step_2_title(), body: m.step_2_body() },
      { title: m.step_3_title(), body: m.step_3_body() },
    ],
  },
  faq: {
    title: m.faq_title(),
    items: [
      { q: m.faq_1_q(), a: m.faq_1_a() },
      { q: m.faq_2_q(), a: m.faq_2_a() },
      { q: m.faq_3_q(), a: m.faq_3_a() },
    ],
  },
  cta: { title: m.cta_title(), body: m.cta_body(), action: { label: m.cta_action(), href: "/register" } },
});
