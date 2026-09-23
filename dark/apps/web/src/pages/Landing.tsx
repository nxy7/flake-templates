import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Icon } from "../components/Icon";
import { landing } from "../content/landing";

/**
 * Landing (prerender, każdy język). Układ tutaj, teksty w messages/*.json (przez content/landing.ts),
 * wygląd w tokenach styles.css.
 * Sekcja z wartością null w treści nie renderuje się.
 */
export default function Landing() {
  const { hero, features, steps, faq, cta } = landing();
  const [before, after] = hero.title.split(hero.highlight);

  return (
    <div class="landing">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <h1 id="hero-title" class="display">
            {before}
            <span class="ink">
              {hero.highlight}
              <svg class="ink-stroke" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 12 C 60 4, 130 4, 190 9 S 270 14, 297 6" pathLength="1" />
              </svg>
            </span>
            {after}
          </h1>
          <p class="lead">{hero.lead}</p>
          <div class="actions">
            <A href={hero.primary.href} class="btn">
              {hero.primary.label}
            </A>
            <Show when={hero.secondary}>
              {(s) => (
                <A href={s().href} class="btn quiet">
                  {s().label}
                </A>
              )}
            </Show>
          </div>
        </div>
        <figure class="sheet" aria-label={hero.sampleLabel}>
          <For each={hero.sample}>
            {(n) => (
              <div class="sheet-note">
                <p class="sheet-title">{n.title}</p>
                <p class="sheet-body">{n.body}</p>
              </div>
            )}
          </For>
          <figcaption class="sheet-caption">
            <Icon name="plus" class="icon small" /> {hero.newNote}
          </figcaption>
        </figure>
      </section>

      <Show when={features}>
        {(f) => (
          <section class="section" aria-labelledby="features-title">
            <h2 id="features-title" class="section-title">
              {f().title}
            </h2>
            <dl class="feature-list">
              <For each={f().items}>
                {(item) => (
                  <div class="feature">
                    <dt>
                      <Icon name={item.icon} />
                      <span>{item.title}</span>
                    </dt>
                    <dd>{item.body}</dd>
                  </div>
                )}
              </For>
            </dl>
          </section>
        )}
      </Show>

      <Show when={steps}>
        {(s) => (
          <section class="section" aria-labelledby="steps-title">
            <h2 id="steps-title" class="section-title">
              {s().title}
            </h2>
            <ol class="step-list">
              <For each={s().items}>
                {(item) => (
                  <li class="step">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </li>
                )}
              </For>
            </ol>
          </section>
        )}
      </Show>

      <Show when={faq}>
        {(q) => (
          <section class="section" aria-labelledby="faq-title">
            <h2 id="faq-title" class="section-title">
              {q().title}
            </h2>
            <div class="faq-list">
              <For each={q().items}>
                {(item) => (
                  <details>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                )}
              </For>
            </div>
          </section>
        )}
      </Show>

      <Show when={cta}>
        {(c) => (
          <section class="cta" aria-labelledby="cta-title">
            <h2 id="cta-title" class="display small">
              {c().title}
            </h2>
            <p class="cta-body">{c().body}</p>
            <A href={c().action.href} class="btn seal">
              {c().action.label}
            </A>
          </section>
        )}
      </Show>
    </div>
  );
}
