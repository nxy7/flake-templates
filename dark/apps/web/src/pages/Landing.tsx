import { A } from "@solidjs/router";

/** Strona marketingowa: prerenderowana do statycznego HTML (patrz src/routes.tsx: prerender). */
export default function Landing() {
  return (
    <section class="stack">
      <h1>Notatki, które są zawsze pod ręką</h1>
      <p class="lead">
        Jedna aplikacja w przeglądarce, na Androidzie i iOS. Zapisuj myśli, edytuj je i miej je wszędzie.
      </p>
      <div class="row">
        <A href="/register" class="btn">
          Załóż konto
        </A>
        <A href="/login" class="btn secondary">
          Zaloguj się
        </A>
      </div>
    </section>
  );
}
