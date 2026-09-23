# factory-template

Szablon "dark factory": jedna baza kodu → web (Cloudflare Workers), Android i iOS (Capacitor),
API na VPS (Hetzner + docker compose). Reguły pracy agentów: [AGENTS.md](AGENTS.md).

**Stack:** Bun · Hono (+ RPC) · Drizzle + PostgreSQL · Better Auth · Zod · Solid 1.9 + Vite ·
Capacitor 8 · Playwright · PGlite (tylko testy) · OpenTofu · Biome · Nix.

## Quickstart (5 komend)
```sh
nix flake new -t github:nxy7/flake-templates#dark my-app && cd my-app
git init -q && git add -A && direnv allow   # albo: nix develop
bun install
bunx playwright install chromium
bun run verify
```
Dev: `bun run dev` (API na PGlite :3000 + Vite :5173). Bez Dockera i bez Postgresa.

## `bun run verify`
Jedyna definicja gotowości. Etapy (pierwszy błąd = exit != 0):
lint + format → typecheck → unit → integracja (PGlite) → migracje (czysta baza + dryf schematu) →
E2E (Playwright, PGlite) → build (API bez `/__test`, SPA + prerender, wrangler dry-run) →
Android (cap sync + assembleDebug) → infra (tofu fmt + validate). iOS buduje się tylko w CI (macOS).

## Struktura
```
apps/api          Hono + Better Auth; server.ts (prod), test-server.ts (+/__test/reset, tylko NODE_ENV=test)
apps/web          Solid SPA + prerender marketingu, Capacitor (android/, ios/), e2e/, wrangler.jsonc
packages/shared   Zod + typy kontraktu
packages/db       schemat Drizzle, migracje, createDb() (postgres:// | pglite://)
packages/testing  zrzut PGlite, helper app.request(), fixture Playwright z resetem
deploy/           docker-compose (api, db, caddy, backup), Caddyfile, backup/restore + test
infra/            OpenTofu: modules/app, envs/{staging,prod} (stan w R2, szyfrowany)
.github/workflows ci.yml (checki, obrazy, deploy), deploy.yml (wspólny), infra.yml (apply tylko z CI)
docs/             solid.md (wzorce frontu), testing.md
```

## Przepływ wdrożeń
- PR/push: verify, Postgres (migracje, E2E, test backupu), iOS bez podpisu, `tofu plan` (gdy są sekrety).
- `main`: obrazy `api` i `backup` → GHCR → staging (SSH: pull → migracje → up → smoke) → front na Workers staging.
- tag `v*`: te same obrazy → prod + front prod + GitHub Release z APK/AAB/IPA.
- Infrastruktura: workflow **infra** (ręczny `workflow_dispatch`). Nigdy lokalny `tofu apply`.
- Bez sekretów CI jest zielone: joby deployu są pomijane, job `secrets` wypisuje, czego brakuje.

## Sekrety i zmienne GitHub
| Grupa | Secrets | Variables |
|---|---|---|
| Cloudflare | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID` | |
| OpenTofu | `TOFU_STATE_PASSPHRASE`, `TOFU_STATE_BUCKET`, `R2_STATE_ACCESS_KEY_ID`, `R2_STATE_SECRET_ACCESS_KEY`, `HCLOUD_TOKEN` | `STAGING_API_HOSTNAME`, `PROD_API_HOSTNAME`, `SSH_PUBLIC_KEYS` (JSON: `["ssh-ed25519 ..."]`) |
| Staging | `STAGING_SSH_HOST`, `STAGING_SSH_KEY`, `STAGING_ENV_FILE` (treść .env wg `deploy/.env.example`) | `STAGING_API_URL`, `STAGING_WEB_DOMAIN` |
| Prod | `PROD_SSH_HOST`, `PROD_SSH_KEY`, `PROD_ENV_FILE` | `PROD_API_URL`, `PROD_WEB_DOMAIN` |
| Android | `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` | |
| iOS | `IOS_CERTIFICATE_P12_BASE64`, `IOS_CERTIFICATE_PASSWORD`, `IOS_PROVISIONING_PROFILE_BASE64`, `IOS_TEAM_ID` | |

## Pierwsze uruchomienie infrastruktury (człowiek, raz)
1. Cloudflare: domena w strefie; R2 włączone; bucket na stan (np. `factory-tofu-state`) i klucze R2 S3 API.
2. Hetzner: projekt + token API. Para kluczy SSH do deployu (publiczny → `SSH_PUBLIC_KEYS`, prywatny → `*_SSH_KEY`).
3. Uzupełnij sekrety/zmienne w GitHub, środowisko `production` z wymaganymi recenzentami.
4. Actions → **infra** → `staging`, potem `prod`. `*_SSH_HOST` = output `server_ipv4`.
5. Klucze R2 dla backupu (bucket `<name>-<env>-backups`) wpisz do `*_ENV_FILE`.

## Nowa aplikacja z szablonu
Zmień: `appId`/`appName` (`apps/web/capacitor.config.ts`, też `apps/web/ios-sign.sh`), `APP_NAME`
(`apps/web/src/components/Layout.tsx`), `name` w `infra/envs/*` i `apps/web/wrangler.jsonc`.
Potem SPEC.md → PLAN.md → E2E → implementacja wg wzorca `notes`.
