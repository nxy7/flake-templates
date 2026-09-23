import { site } from "../content/site";

export default function About() {
  return (
    <article class="narrow prose">
      <h1 class="display small">O projekcie</h1>
      <p class="lead">{site.description}</p>
      <p>
        To aplikacja demonstracyjna szablonu factory-template. Pokazuje cały przekrój: konto z logowaniem, dane należące
        do użytkownika i testy na każdym poziomie — od walidacji po scenariusze w przeglądarce.
      </p>
    </article>
  );
}
