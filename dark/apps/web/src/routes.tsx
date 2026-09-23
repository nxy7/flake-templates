import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import { landing } from "./content/landing";
import { site } from "./content/site";
import { stripLocale } from "./lib/i18n";
import About from "./pages/About";
import { Login, Register } from "./pages/AuthForm";
import Landing from "./pages/Landing";
import { m } from "./paraglide/messages.js";

/**
 * Jedno źródło prawdy dla routingu i metadanych stron. Ścieżki BEZ prefiksu języka
 * (prefiks to base routera, patrz lib/i18n.ts). `prerender: true` = strona marketingowa
 * renderowana w buildzie do statycznego HTML dla KAŻDEGO języka (scripts/prerender.ts).
 * Strony prerender importuj statycznie (bez lazy), ekrany aplikacji leniwie.
 */
export type AppRoute = RouteDefinition & {
  path: string;
  prerender?: boolean;
  /** Funkcje, bo tekst zależy od bieżącego języka. */
  title?: () => string;
  description?: () => string;
};

export const routes: AppRoute[] = [
  {
    path: "/",
    component: Landing,
    prerender: true,
    title: () => landing().meta.title,
    description: () => landing().meta.description,
  },
  { path: "/about", component: About, prerender: true, title: m.meta_about_title },
  { path: "/login", component: Login, title: m.meta_login_title },
  { path: "/register", component: Register, title: m.meta_register_title },
  {
    path: "/app",
    title: m.meta_app_title,
    component: lazy(() => import("./pages/app/Guard")),
    children: [{ path: "/", component: lazy(() => import("./pages/app/Notes")) }],
  },
];

export function metaFor(pathname: string): { title: string; description: string } {
  const path = stripLocale(pathname).replace(/\/+$/, "") || "/";
  const route = routes.find((r) => r.path === path) ?? routes.find((r) => r.path !== "/" && path.startsWith(r.path));
  const s = site();
  return { title: route?.title?.() ?? s.name, description: route?.description?.() ?? s.description };
}

export const prerenderPaths = routes.filter((r) => r.prerender).map((r) => r.path);
