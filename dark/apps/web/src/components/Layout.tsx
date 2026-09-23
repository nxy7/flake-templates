import { A, type RouteSectionProps, useLocation } from "@solidjs/router";
import { createEffect, For } from "solid-js";
import { site } from "../content/site";
import { hrefForLocale } from "../lib/i18n";
import { m } from "../paraglide/messages.js";
import { getLocale, locales } from "../paraglide/runtime.js";
import { metaFor } from "../routes";

export function Layout(props: RouteSectionProps) {
  const location = useLocation();
  const s = site();
  // Tytuł karty przy nawigacji klienta (prerender wstrzykuje go do HTML w buildzie).
  createEffect(() => {
    document.title = metaFor(location.pathname).title;
  });

  return (
    <div class="frame">
      <header class="masthead">
        <A href="/" class="wordmark" end>
          {s.name}
        </A>
        <nav class="nav" aria-label={m.nav_label()}>
          <For each={s.nav}>{(item) => <A href={item.href}>{item.label}</A>}</For>
          <A href={s.appCta.href} class="nav-cta">
            {s.appCta.label}
          </A>
        </nav>
      </header>
      <main id="main">{props.children}</main>
      <footer class="colophon">
        <p>
          <span class="wordmark small">{s.name}</span> · {s.footer.note}
        </p>
        <nav aria-label={m.footer_label()}>
          <For each={s.footer.links}>{(item) => <A href={item.href}>{item.label}</A>}</For>
        </nav>
        <nav class="lang" aria-label={m.language_label()}>
          <For each={locales}>
            {(locale) => (
              // rel="external": pełna nawigacja (zmienia się base routera i <html lang>).
              <a
                href={hrefForLocale(location.pathname, locale)}
                rel="external"
                hreflang={locale}
                lang={locale}
                aria-current={locale === getLocale() ? "true" : undefined}
              >
                {locale.toUpperCase()}
              </a>
            )}
          </For>
        </nav>
      </footer>
    </div>
  );
}
