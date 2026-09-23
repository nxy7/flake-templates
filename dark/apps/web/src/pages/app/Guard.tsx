import { createAsync, Navigate, type RouteSectionProps } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getSession } from "../../data/session";

/** Wszystko pod /app wymaga sesji. */
export default function Guard(props: RouteSectionProps) {
  const user = createAsync(() => getSession());
  return (
    <Suspense fallback={<p class="empty">Ładowanie…</p>}>
      <Show when={user() !== undefined}>
        <Show when={user()} fallback={<Navigate href="/login" />}>
          {props.children}
        </Show>
      </Show>
    </Suspense>
  );
}
