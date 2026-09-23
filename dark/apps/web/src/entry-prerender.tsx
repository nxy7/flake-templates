import { Router } from "@solidjs/router";
import { renderToString } from "solid-js/web";
import { Layout } from "./components/Layout";
import { metaFor, prerenderPaths, routes } from "./routes";

/** Wejście build-time (vite build --ssr). Brak serwera SSR w runtime. */
export { metaFor, prerenderPaths };

export function render(url: string): string {
  return renderToString(() => (
    <Router url={url} root={Layout}>
      {routes}
    </Router>
  ));
}
