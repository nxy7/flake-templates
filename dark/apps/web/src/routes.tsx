import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import { landing } from "./content/landing";
import { site } from "./content/site";
import About from "./pages/About";
import { Login, Register } from "./pages/AuthForm";
import Landing from "./pages/Landing";

/**
 * Jedno źródło prawdy dla routingu i metadanych stron. `prerender: true` = strona marketingowa
 * renderowana w buildzie do statycznego HTML (scripts/prerender.ts, razem z title/description).
 * Strony prerender importuj statycznie (bez lazy), ekrany aplikacji leniwie.
 */
export type AppRoute = RouteDefinition & {
  path: string;
  prerender?: boolean;
  title?: string;
  description?: string;
};

export const routes: AppRoute[] = [
  { path: "/", component: Landing, prerender: true, ...landing.meta },
  { path: "/about", component: About, prerender: true, title: `O projekcie — ${site.name}` },
  { path: "/login", component: Login, title: `Logowanie — ${site.name}` },
  { path: "/register", component: Register, title: `Załóż konto — ${site.name}` },
  {
    path: "/app",
    title: `Notatki — ${site.name}`,
    component: lazy(() => import("./pages/app/Guard")),
    children: [{ path: "/", component: lazy(() => import("./pages/app/Notes")) }],
  },
];

const normalize = (p: string) => p.replace(/\/+$/, "") || "/";

export function metaFor(pathname: string): { title: string; description: string } {
  const path = normalize(pathname);
  const route = routes.find((r) => r.path === path) ?? routes.find((r) => r.path !== "/" && path.startsWith(r.path));
  return { title: route?.title ?? site.name, description: route?.description ?? site.description };
}

export const titleFor = (pathname: string) => metaFor(pathname).title;

export const prerenderPaths = routes.filter((r) => r.prerender).map((r) => r.path);
