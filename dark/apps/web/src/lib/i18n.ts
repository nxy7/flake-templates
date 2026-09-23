import { baseLocale, getLocale, type Locale, locales } from "../paraglide/runtime.js";

/**
 * Most między Paraglide a routerem. Strategia "url": /about = angielski (baseLocale),
 * /pl/about = polski. Router dostaje prefiks języka jako `base`, więc wszystkie linki
 * w aplikacji piszemy BEZ prefiksu (`<A href="/app">`).
 */
export const routerBase = (locale: Locale = getLocale()) => (locale === baseLocale ? "" : `/${locale}`);

/** Ścieżka bez prefiksu języka (do dopasowania tras i metadanych). */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (l === baseLocale) continue;
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1) || "/";
  }
  return pathname || "/";
}

/** Ta sama strona w innym języku (pełna nawigacja: zmienia się base routera). */
export const hrefForLocale = (pathname: string, locale: Locale) => `${routerBase(locale)}${stripLocale(pathname)}`;
