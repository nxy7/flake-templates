import { createAsync, Navigate, type RouteSectionProps } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getSession } from "../../data/session";
import { m } from "../../paraglide/messages.js";

/** Wszystko pod /app wymaga sesji. */
export default function Guard(props: RouteSectionProps) {
  const user = createAsync(() => getSession());
  return (
    <Suspense fallback={<p class="empty">{m.loading()}</p>}>
      <Show when={user() !== undefined}>
        <Show when={user()} fallback={<Navigate href="/login" />}>
          <div class="narrow">{props.children}</div>
        </Show>
      </Show>
    </Suspense>
  );
}
