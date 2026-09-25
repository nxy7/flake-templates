# dark-expo

Szablon "dark factory" z natywnym UI: jedna baza kodu → **iOS i Android (React Native, natywne widoki)** i
**web (statyczny HTML + hydratacja)**. API na VPS (Hetzner + docker compose). Reguły agentów: [AGENTS.md](AGENTS.md).

**Stack:** Bun · Hono (+ RPC) · Drizzle + PostgreSQL (PGlite w testach i dev) · Better Auth · Zod ·
Expo SDK 57 (React Native 0.86, Expo Router, react-native-web) · TanStack Query · Paraglide JS (en domyślny) ·
Playwright · OpenTofu · Biome · Nix.

## Quickstart (5 komend)
```sh
nix flake new -t github:nxy7/flake-templates#dark-expo my-app && cd my-app
git init -q && git add -A && direnv allow   # albo: nix develop
bun install
bunx --cwd apps/app playwright install chromium
bun run verify
```
Dev: `bun run dev` — API na PGlite (:4000) + Expo dev server (web :8081, QR dla Expo Go / dev build).
Emulator Androida: `EXPO_PUBLIC_API_URL=http://10.0.2.2:4000`.

## `bun run verify`
lint + format → typecheck → unit → integracja (PGlite) → migracje (czysta baza + dryf) →
E2E (Playwright na statycznym eksporcie web, PGlite) → build (API bez `/__test`, `expo export` web, wrangler dry-run) →
Android (`expo prebuild` + `assembleDebug`) → infra (tofu fmt + validate). iOS buduje się tylko w CI (macOS).

## Struktura
```
apps/api          Hono + Better Auth; server.ts (prod), test-server.ts (+/__test/reset, tylko NODE_ENV=test)
apps/app          Expo: app/ (trasy Expo Router), src/screens, src/components/ui.tsx, src/data (TanStack Query),
                  src/lib (api, storage, token, i18n, config), src/theme.ts, messages/ (Paraglide), e2e/,
                  app.config.ts (jedyna konfiguracja; android/ i ios/ są generowane), wrangler.jsonc
packages/shared   Zod + typy kontraktu
packages/db       schemat Drizzle, migracje, createDb() (postgres:// | pglite://)
packages/testing  zrzut PGlite, helper app.request(), fixture Playwright z resetem
deploy/           docker-compose (api, db, caddy, backup), Caddyfile, backup/restore + test
infra/            OpenTofu: modules/app, envs/{staging,prod} (stan w R2, szyfrowany)
.github/workflows ci.yml, deploy.yml, infra.yml
docs/             expo.md (wzorce i zakazy frontu), testing.md
```

## Web i SEO
Każda trasa to osobny plik HTML z prawdziwym tekstem, `<h1>`, `<a href>`, `<title>` i description
(`web.output: "static"`). Angielski: `/`, `/about`; polski: `/pl`, `/pl/about`. Nieznana ścieżka → `404.html`.
Hosting: Cloudflare Workers Static Assets (`apps/app/wrangler.jsonc`).

## Mobile
- `android/` i `ios/` generuje `expo prebuild` z `app.config.ts` (Continuous Native Generation) — nie trafiają do repo.
- Buildy lokalnie i w GitHub Actions (Gradle, xcodebuild). **Bez EAS i bez konta Expo.**
- Release Android: `bundleRelease` podpisany przez `android.injected.signing.*` (sekrety CI). iOS: `apps/app/scripts/ios-sign.sh`.

## Przebrandowanie
| Co | Gdzie |
|---|---|
| Teksty (en/pl) | `apps/app/messages/<locale>.json` |
| Nazwa, ikony, identyfikatory aplikacji | `apps/app/app.config.ts` (+ bundle id w `scripts/ios-sign.sh`) |
| Kolory, kroje, odstępy | `apps/app/src/theme.ts` |
| Układ landingu | `apps/app/src/screens/Landing.tsx` |
| Nowy język | `messages/<locale>.json` + `locales` w `project.inlang/settings.json` + `app/<locale>/` dla stron marketingowych |

## Przepływ wdrożeń i sekrety
Jak w `dark`: PR/push → verify, Postgres (migracje, E2E, backup), iOS bez podpisu, `tofu plan` (gdy są sekrety);
`main` → obrazy do GHCR → staging (SSH) → web na Workers; tag `v*` → prod + GitHub Release (APK/AAB/IPA).
Bez sekretów CI jest zielone (joby deployu pomijane z komunikatem). Lista sekretów:

| Grupa | Secrets | Variables |
|---|---|---|
| Cloudflare | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID` | |
| OpenTofu | `TOFU_STATE_PASSPHRASE`, `TOFU_STATE_BUCKET`, `R2_STATE_ACCESS_KEY_ID`, `R2_STATE_SECRET_ACCESS_KEY`, `HCLOUD_TOKEN` | `STAGING_API_HOSTNAME`, `PROD_API_HOSTNAME`, `SSH_PUBLIC_KEYS` |
| Staging | `STAGING_SSH_HOST`, `STAGING_SSH_KEY`, `STAGING_ENV_FILE` | `STAGING_API_URL`, `STAGING_WEB_DOMAIN` |
| Prod | `PROD_SSH_HOST`, `PROD_SSH_KEY`, `PROD_ENV_FILE` | `PROD_API_URL`, `PROD_WEB_DOMAIN` |
| Android | `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` | |
| iOS | `IOS_CERTIFICATE_P12_BASE64`, `IOS_CERTIFICATE_PASSWORD`, `IOS_PROVISIONING_PROFILE_BASE64`, `IOS_TEAM_ID` | |
