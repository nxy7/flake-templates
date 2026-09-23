import type { CompilerOptions } from "@inlang/paraglide-js";

/**
 * Jedyna konfiguracja Paraglide: używa jej plugin Vite (vite.config.ts) i kompilacja
 * przed typecheckiem/E2E (scripts/i18n.ts).
 *  - url: /about = angielski (baseLocale), /pl/about = polski
 *  - baseLocale: wszystko bez prefiksu to angielski
 */
export const paraglide = {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  strategy: ["url", "baseLocale"],
  emitTsDeclarations: true,
  isServer: "import.meta.env.SSR",
} satisfies CompilerOptions;
