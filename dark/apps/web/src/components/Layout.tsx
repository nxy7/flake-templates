import { A, type RouteSectionProps, useLocation } from "@solidjs/router";
import { createEffect, For } from "solid-js";
import { site } from "../content/site";
import { titleFor } from "../routes";

export function Layout(props: RouteSectionProps) {
  const location = useLocation();
  // Tytuł karty przy nawigacji klienta (prerender wstrzykuje go do HTML w buildzie).
  createEffect(() => {
    document.title = titleFor(location.pathname);
  });

  return (
    <div class="frame">
      <header class="masthead">
        <A href="/" class="wordmark" end>
          {site.name}
        </A>
        <nav class="nav" aria-label="Główna">
          <For each={site.nav}>{(item) => <A href={item.href}>{item.label}</A>}</For>
          <A href={site.appCta.href} class="nav-cta">
            {site.appCta.label}
          </A>
        </nav>
      </header>
      <main id="main">{props.children}</main>
      <footer class="colophon">
        <p>
          <span class="wordmark small">{site.name}</span> · {site.footer.note}
        </p>
        <nav aria-label="Stopka">
          <For each={site.footer.links}>{(item) => <A href={item.href}>{item.label}</A>}</For>
        </nav>
      </footer>
    </div>
  );
}
