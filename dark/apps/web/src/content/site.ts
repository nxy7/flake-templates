import { m } from "../paraglide/messages.js";

/**
 * Marka i nawigacja. Nazwa marki jest stała (nie tłumaczymy jej); teksty idą przez Paraglide
 * (messages/<locale>.json). Funkcja, bo komunikaty zależą od bieżącego języka.
 */
export const BRAND = "Notebook";

export const site = () => ({
  name: BRAND,
  description: m.site_description(),
  nav: [
    { label: m.nav_about(), href: "/about" },
    { label: m.nav_login(), href: "/login" },
  ],
  appCta: { label: m.nav_open_app(), href: "/app" },
  footer: {
    note: m.footer_note(),
    links: [
      { label: m.nav_about(), href: "/about" },
      { label: m.footer_register(), href: "/register" },
    ],
  },
});
