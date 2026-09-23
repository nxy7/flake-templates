# Testy

| Poziom | Runner | Gdzie | Baza |
|---|---|---|---|
| unit | bun test | `packages/shared/src`, `apps/web/src` | — |
| integracja | bun test | `apps/api/test` | PGlite ze zrzutu, świeża instancja na test |
| E2E | Playwright | `apps/web/e2e` | PGlite per worker (lokalnie) / Postgres per worker (CI) |

## Integracja: zrzut PGlite
`@app/testing/db`: raz na proces migracje → `dumpDataDir("none")`; każdy test
`PGlite.create({ loadDataDir })`. API wołane przez `app.request()` (bez portów), `close()` po teście.

Pomiar (`bun packages/testing/src/db.bench.ts`, M1 Pro, 10 prób):

| Metoda | avg | p50 | max |
|---|---|---|---|
| od zera + migracje | 639.7 ms | 613.3 ms | 785.5 ms |
| **loadDataDir (zrzut)** — wybrane | **83.3 ms** | **82.5 ms** | **94.5 ms** |
| clone() | 97.6 ms | 96.8 ms | 110.8 ms |

Plan awaryjny (instancja na plik + TRUNCATE) nie był potrzebny.

## E2E
- Fixture `@app/testing/playwright`: worker-scoped proces API (`apps/api/src/test-server.ts`) na porcie 4100+N,
  auto-fixture `POST /__test/reset` przed każdym testem, adres API przekazany frontowi przez `window.__API_URL__`.
- Front: produkcyjny build (z prerenderem) przez `vite preview`.
- `E2E_DATABASE_URL=postgres://...` → każdy worker dostaje własną bazę `e2e_w<N>` (CI, job `postgres`).
- `/__test/reset` istnieje tylko w `test-server.ts` (NODE_ENV=test); `apps/api/scripts/build.ts` failuje, jeśli trafi do bundla.

## Backup
`bun run backup:test` (wymaga `ADMIN_DATABASE_URL`): migracje + dane → `backup.sh` → `restore.sh` do świeżej bazy → porównanie.
