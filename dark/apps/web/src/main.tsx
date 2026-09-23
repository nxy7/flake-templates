import "@fontsource-variable/newsreader";
import "@fontsource-variable/public-sans";
import "./styles.css";
import { Capacitor } from "@capacitor/core";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { Layout } from "./components/Layout";
import { routes } from "./routes";

// W aplikacji mobilnej startujemy od ekranu aplikacji, nie od strony marketingowej.
if (Capacitor.isNativePlatform() && location.pathname === "/") history.replaceState(null, "", "/app");

const root = document.getElementById("root");
if (!root) throw new Error("#root nie istnieje");
// Prerenderowany HTML jest zastępowany renderem klienta (bez hydratacji — patrz docs/solid.md).
root.textContent = "";
document.documentElement.classList.remove("spa-fallback");
render(() => <Router root={Layout}>{routes}</Router>, root);
