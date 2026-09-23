import { Router } from "@solidjs/router";
import { renderToString } from "solid-js/web";
import { Layout } from "./components/Layout";
import { routerBase } from "./lib/i18n";
import { type Locale, locales, overwriteGetLocale } from "./paraglide/runtime.js";
import { metaFor, prerenderPaths, routes } from "./routes";

/** Wejście build-time (vite build --ssr). Brak serwera SSR w runtime. */
export { locales, prerenderPaths, routerBase };

/** Renderuje ścieżkę (bez prefiksu) w danym języku; zwraca HTML i metadane. */
export function render(path: string, locale: Locale) {
  overwriteGetLocale(() => locale);
  const base = routerBase(locale);
  const url = `${base}${path}`;
  const html = renderToString(() => (
    <Router url={url} base={base} root={Layout}>
      {routes}
    </Router>
  ));
  return { url, html, meta: metaFor(url) };
}
