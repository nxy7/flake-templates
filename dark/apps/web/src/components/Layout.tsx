import { A, type RouteSectionProps } from "@solidjs/router";

export const APP_NAME = "Factory Template";

export function Layout(props: RouteSectionProps) {
  return (
    <div class="shell">
      <nav class="nav">
        <A href="/" class="brand">
          {APP_NAME}
        </A>
        <A href="/about">O projekcie</A>
        <A href="/app">Aplikacja</A>
      </nav>
      <main>{props.children}</main>
    </div>
  );
}
