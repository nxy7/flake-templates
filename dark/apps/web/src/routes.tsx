import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import About from "./pages/About";
import { Login, Register } from "./pages/AuthForm";
import Landing from "./pages/Landing";

/**
 * Jedno źródło prawdy dla routingu. `prerender: true` = strona marketingowa renderowana
 * w buildzie do statycznego HTML (scripts/prerender.ts). Strony prerender importuj
 * statycznie (bez lazy), ekrany aplikacji leniwie.
 */
export type AppRoute = RouteDefinition & { path: string; prerender?: boolean };

export const routes: AppRoute[] = [
  { path: "/", component: Landing, prerender: true },
  { path: "/about", component: About, prerender: true },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/app",
    component: lazy(() => import("./pages/app/Guard")),
    children: [{ path: "/", component: lazy(() => import("./pages/app/Notes")) }],
  },
];

export const prerenderPaths = routes.filter((r) => r.prerender).map((r) => r.path);
