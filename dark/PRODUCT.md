# PRODUCT

> Prawda produktowa szablonu. Nowa aplikacja z szablonu NADPISUJE ten plik (razem z SPEC.md).

## Produkt
Demonstracyjna aplikacja notatek zbudowana z szablonu "factory-template": jedna baza kodu
działa w przeglądarce, na Androidzie i iOS. Notatki należą do użytkownika (konto email + hasło).

## Odbiorcy
- Użytkownik końcowy: osoba, która chce szybko zapisywać i edytować krótkie notatki na telefonie i w przeglądarce.
- Właściciel szablonu: zespół/agent, który podmienia treść i tokeny, żeby wystartować nowy produkt.

## Powierzchnie
| Powierzchnia | Tryb | Cel |
|---|---|---|
| `/` landing (prerender) | Persuade | Odwiedzający rozumie, co to jest, i zakłada konto |
| `/about` (prerender) | Read | Krótko o projekcie |
| `/login`, `/register` | Operate | Wejście do aplikacji |
| `/app` notatki | Operate | Dodaj / edytuj / usuń notatkę |

## Języki
Angielski (domyślny, bez prefiksu URL) i polski (`/pl/...`). Teksty wyłącznie w Paraglide (`apps/web/messages`).

## Ton
Spokojny, rzeczowy. Bez obietnic liczbowych i bez wymyślonych opinii klientów.
Żadnych fałszywych dowodów społecznych: sekcje z liczbami/opiniami tylko z prawdziwymi danymi.

## Ograniczenia
- Teksty w `apps/web/messages/<locale>.json`, układ landingu w `apps/web/src/content/landing.ts`. Wygląd w tokenach: `apps/web/src/styles.css` (`:root`).
- Strony marketingowe muszą renderować się bez JS (prerender), działać bez stanu przeglądarki.
- Dostępność: kontrast AA, pełna obsługa klawiaturą, semantyczne nagłówki (E2E wybiera po rolach).

## Platform
adaptive-web: web + Capacitor (Android, iOS) z tego samego builda; bez natywnego języka wizualnego per OS.