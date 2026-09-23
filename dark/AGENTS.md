# AGENTS.md — reguły dla agentów-fabryk

To repo jest szablonem. Każda nowa aplikacja powstaje przez KOPIOWANIE wzorców stąd.
Jakość i spójność wzorca są ważniejsze niż liczba funkcji.

## Definicja gotowości (jedyna)
Zadanie jest skończone tylko wtedy, gdy `bun run verify` kończy się kodem 0, a w raporcie jest
jego realny output (tabela podsumowania). "Powinno działać" nie jest dowodem.
`VERIFY_SKIP` nie jest zielonym verify — każde pominięcie musisz zgłosić z powodem.
Wszystkie komendy uruchamiaj w `nix develop` (albo przez direnv: `.envrc`).

## Kolejność pracy
1. Przeczytaj/uzupełnij `SPEC.md` (wzór: `SPEC.template.md`) i `PLAN.md` (wzór: `PLAN.template.md`).
   PLAN.md to pamięć między rundami: aktualizuj checklistę po każdym kamieniu milowym.
2. Najpierw testy E2E z kryteriów akceptacji (`apps/web/e2e/*.spec.ts`), mają failować.
3. Potem implementacja od dołu: schemat → migracja → kontrakt → API + test integracyjny → ekran.
4. `bun run verify` → commit → push.

## Nowy zasób = skopiuj wzorzec "notes"
| Warstwa | Plik wzorcowy |
|---|---|
| Tabela | `packages/db/src/schema.ts` (`notes`) → `bun run db:generate` |
| Kontrakt (Zod + typ) | `packages/shared/src/notes.ts` (+ `notes.test.ts`) |
| Router API | `apps/api/src/routes/notes.ts`, montaż w `apps/api/src/app.ts` |
| Test integracyjny | `apps/api/test/notes.test.ts` (w tym autoryzacja: cudzy rekord = 404) |
| Dane frontu | `apps/web/src/data/notes.ts` (query + action) |
| Ekran | `apps/web/src/pages/app/Notes.tsx`, trasa w `apps/web/src/routes.tsx` |
| E2E | `apps/web/e2e/notes.spec.ts` |

## Jedno źródło prawdy (zakaz równoległych ścieżek kodu)
- Typy i walidacja: tylko `packages/shared`. Front importuje typy API przez Hono RPC (`AppType`), nie pisze ich ręcznie.
- Schemat bazy: tylko `packages/db/src/schema.ts`. Migracje wyłącznie generowane (`bun run db:generate`), nigdy ręczna edycja wygenerowanych plików.
- Klient bazy: tylko `createDb()` z `@app/db`. Kod aplikacji dostaje `Db` i nie sprawdza, czy to Postgres czy PGlite.
- Adres API we froncie: tylko `apps/web/src/lib/config.ts`. Routing i metadane stron: tylko `apps/web/src/routes.tsx`.
- Teksty marketingowe: tylko `apps/web/src/content/` (nie wpisuj copy w komponenty). Wygląd: tokeny w `:root` w `styles.css`
  (nie wpisuj kolorów/krojów w komponenty). Prawda produktowa i ton: `PRODUCT.md`. Bez wymyślonych liczb i opinii.
- Jeden runner testów: `bun test` (unit + integracja) i Playwright (E2E). Bez Vitest/Jest.
- Jeden linter/formatter: Biome. Wersje narzędzi: `flake.nix` + `bun.lock`.

## Testy
- Unit: czysta logika, obok kodu (`*.test.ts` w `packages/shared`, `apps/web/src`).
- Integracja: `apps/api/test`, zawsze przez `setup()` (świeża baza PGlite ze zrzutu + `app.request()`, bez portów), `close()` w `afterEach`.
- E2E: import `test`/`expect` z `@app/testing/playwright` (reset bazy przed każdym testem jest automatyczny).
  Selektory przez role i etykiety (`getByRole`, `getByLabel`), nie przez klasy CSS.
- `/__test/*` istnieje tylko w `apps/api/src/test-server.ts`. Nigdy nie importuj `test-*.ts` z kodu produkcyjnego (build to sprawdza).

## Frontend
Wzorce i zakazane API: `docs/solid.md`. Stack: Solid 1.9 + @solidjs/router 1.x. Nie używaj API z Solid 2.0 ani Reacta.

## Zakazy
- Żadnych sekretów w repo (`.env` jest w .gitignore; wzór: `deploy/.env.example`). Sekrety tylko w GitHub Secrets.
- Żadnego ręcznego `tofu apply` (lokalnie wolno tylko `bun run infra:check`). Apply: workflow `infra` w CI.
- Żadnego deployu z maszyny lokalnej. Deploy robi CI (`main` → staging, tag `v*` → prod).
- Żadnych TODO bez uzasadnienia i numeru zadania. Żadnego martwego kodu "na później".
- Nie wyłączaj reguł Biome/TS globalnie; lokalny `biome-ignore` tylko z powodem.
- Jeśli coś wymaga kliknięcia w panelu (Cloudflare, Hetzner, GitHub, sklepy), napisz to wprost w raporcie — nie udawaj naprawy.

## Raport końcowy agenta
hash commita · output `bun run verify` (podsumowanie) · status CI · lista pominięć z powodem · rzeczy dla człowieka.