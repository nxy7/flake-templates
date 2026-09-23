import "@fontsource-variable/newsreader";
import "@fontsource-variable/public-sans";
import "./styles.css";
import { Capacitor } from "@capacitor/core";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { Layout } from "./components/Layout";
import { routerBase } from "./lib/i18n";
import { baseLocale, extractLocaleFromNavigator, getLocale } from "./paraglide/runtime.js";
import { routes } from "./routes";

// Aplikacja mobilna startuje od ekranu aplikacji (nie marketingu), w języku systemu, jeśli go mamy.
if (Capacitor.isNativePlatform() && location.pathname === "/") {
  history.replaceState(null, "", `${routerBase(extractLocaleFromNavigator() ?? baseLocale)}/app`);
}

const root = document.getElementById("root");
if (!root) throw new Error("#root nie istnieje");
// Język wynika z URL (strategia Paraglide "url"): /pl/... = polski, reszta = angielski.
document.documentElement.lang = getLocale();
// Prerenderowany HTML jest zastępowany renderem klienta (bez hydratacji — patrz docs/solid.md).
root.textContent = "";
document.documentElement.classList.remove("spa-fallback");
render(
  () => (
    <Router base={routerBase()} root={Layout}>
      {routes}
    </Router>
  ),
  root,
);
