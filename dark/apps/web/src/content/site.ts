/** Marka i nawigacja. Podmień przy starcie nowej aplikacji (razem z landing.ts i tokenami w styles.css). */
export const site = {
  name: "Notatnik",
  description: "Notatki w przeglądarce, na Androidzie i iOS — jedno konto, te same notatki wszędzie.",
  nav: [
    { label: "O projekcie", href: "/about" },
    { label: "Zaloguj się", href: "/login" },
  ],
  appCta: { label: "Otwórz aplikację", href: "/app" },
  footer: {
    note: "Zbudowane z factory-template: Bun, Hono, Solid i Capacitor.",
    links: [
      { label: "O projekcie", href: "/about" },
      { label: "Załóż konto", href: "/register" },
    ],
  },
} as const;
