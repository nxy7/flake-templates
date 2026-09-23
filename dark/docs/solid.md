# Frontend: wzorce Solid (1.9) — dla agentów

**Wersja: solid-js 1.9.x + @solidjs/router 1.x + vite-plugin-solid 2.x.**
Solid 2.0 w chwili tworzenia szablonu był w RC (2.0.0-rc.9, router 2.0 w `next`), więc szablon
zostaje na 1.9. Nie mieszaj API: modele językowe często podsuwają Reacta albo Solid 2.0.

## Model mentalny
- Komponent wykonuje się **raz**. Reaktywność jest w sygnałach, nie w re-renderze.
- `props` są reaktywnymi getterami: **nie destrukturyzuj** props (`props.note.title`, nie `{ note }`).
- Pochodne wartości: funkcja (`const full = () => a() + b()`) albo `createMemo`.

## Dane (jedyny wzorzec)
```ts
// src/data/<zasób>.ts
export const listNotes = query(() => parseResponse(api.api.notes.$get()), "notes");
export const createNote = action(async (input: NoteCreate) => {
  await parseResponse(api.api.notes.$post({ json: input }));
}, "createNote"); // po sukcesie router unieważnia aktywne query
```
```tsx
// ekran
const notes = createAsync(() => listNotes());
const create = useAction(createNote);
const state = useSubmission(createNote); // state.pending, state.error
<Suspense fallback={...}><For each={notes()}>{(n) => ...}</For></Suspense>
```
- Klient API: tylko `api` z `src/lib/api.ts` (Hono RPC, typy z backendu). Nie pisz `fetch` ręcznie.
- Błędy HTTP: `parseResponse` z `hono/client` rzuca dla != 2xx.
- Sesja: `getSession` (`src/data/session.ts`); po logowaniu/wylogowaniu `revalidate(getSession.key)`.

## Routing
- Jedna tablica tras: `src/routes.tsx`. `prerender: true` = strona marketingowa (statyczny HTML w buildzie).
- Strony prerender importuj statycznie; ekrany aplikacji przez `lazy()`.
- Linki: `<A href>`; nawigacja w kodzie: `useNavigate()`; przekierowanie w akcji: `throw redirect("/app")`.
- Ochrona tras: layout `pages/app/Guard.tsx` (wszystko pod `/app`).

## i18n (Paraglide JS) — jedyny wzorzec
- Komunikaty: `apps/web/messages/en.json` (bazowy) i `pl.json`. Nowy język = plik + wpis w `project.inlang/settings.json`.
- Użycie: `import { m } from "../paraglide/messages.js"; <h1>{m.notes_title()}</h1>`. Parametry: `m.hello({ name })`.
- Konfiguracja tylko w `paraglide.config.ts` (Vite i `bun run --cwd apps/web i18n`). `src/paraglide/` jest generowany — nie edytuj, nie commituj.
- Strategia `url`: `/about` = en, `/pl/about` = pl. Router dostaje `base` z `routerBase()`; linki bez prefiksu.
- Zmiana języka: zwykły `<a href={hrefForLocale(path, locale)} rel="external">` (pełna nawigacja), nie `setLocale` w środku sesji.
- Teksty zależne od języka w modułach (np. `content/landing.ts`, tytuły tras) muszą być FUNKCJAMI (`landing()`), nie stałymi
  — prerender renderuje wszystkie języki w jednym procesie.
- Komunikaty z API/Zod/Better Auth nie trafiają do UI wprost; pokazuj własny komunikat `m.*`.
- Testy E2E biorą teksty z `e2e/messages.ts` (czyta te same JSON-y).

## Prerender (bez SSR w runtime)
- `vite build --ssr src/entry-prerender.tsx` + `scripts/prerender.ts` wstrzykuje HTML do `dist/<ścieżka>/index.html`
  dla każdego języka (`dist/pl/<ścieżka>/index.html`), z `<html lang>`, `<title>` i description.
- Klient **nie hydratuje** — `render()` zastępuje prerenderowany DOM. Dlatego strony prerender
  nie mogą zależeć od stanu przeglądarki podczas renderu (`window`, `localStorage` → tylko w `onMount`).
- Fallback SPA: nieznana ścieżka dostaje `index.html`; skrypt w `<head>` ukrywa obcą treść do renderu.

## Kontrolka → API
| Chcesz | Użyj | NIE używaj |
|---|---|---|
| lista | `<For each>` / `<Index each>` | `array.map` w JSX |
| warunek | `<Show when fallback>` / `<Switch><Match>` | `cond && <X/>` dla ciężkich poddrzew |
| dane async | `query` + `createAsync` | `createResource` w nowym kodzie, `useEffect` |
| zapis | `action` + `useAction`/`useSubmission` | ręczne `fetch` + sygnał loading |
| efekt | `createEffect`, `onMount`, `onCleanup` | `useEffect`, `useState` (React) |
| stan lokalny | `createSignal`, `createStore` | `useState`, `useReducer` |
| ref | `let el!: HTMLDivElement; <div ref={el}>` | `useRef` |
| klasy | `class`, `classList={{ a: on() }}` | `className` |
| style | `style={{ "font-size": "1rem" }}` | `style={{ fontSize }}` |

## Zakazane / nieistniejące w 1.9 (częste halucynacje)
- Solid 2.0: `createAsync` z `solid-js` (w 1.9 jest w routerze), `action`/`createOptimistic` z `solid-js`,
  `<Loading>`, `<Errored>`, `isPending`, `latest()`, `createProjection`, `flush()`, "derived signals" z funkcją w `createSignal(fn)`.
- Router < 0.15 / SolidStart: `cache()` (zastąpione przez `query()`), `createRouteData`, `useRouteData`,
  `routeData`, `<Routes>`, `<Route data=...>`, `load` (teraz `preload`), `"use server"` (brak serwera).
- React: `useState`, `useEffect`, `useMemo`, `useCallback`, `className`, `htmlFor` (w Solid: `for`), `key` w listach.
- Destrukturyzacja props, `splitProps`/`mergeProps` tylko gdy naprawdę potrzebne.

## Testy frontu
- Logika bez DOM: `bun test` (`src/lib/*.test.ts`).
- Zachowanie UI: Playwright (`e2e/`), selektory przez role/etykiety.