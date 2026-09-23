import type { PGlite } from "@electric-sql/pglite";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * Typ klienta widziany przez aplikację. Kod aplikacji NIE wie, czy pod spodem jest
 * Postgres czy PGlite — dostaje tylko `Db`.
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
export type DbKind = "pg" | "pglite";
export type DbHandle = { db: Db; kind: DbKind; close: () => Promise<void> };

/**
 * Jedyna fabryka klienta bazy. Wybór bazy przez jedną zmienną DATABASE_URL:
 *   postgres://...        -> prawdziwy Postgres (produkcja, CI)
 *   pglite://memory       -> PGlite w pamięci (testy, E2E lokalnie)
 *   pglite:///abs/path    -> PGlite na dysku (dev bez Dockera)
 * Sterowniki ładowane dynamicznie, żeby build produkcyjny nie ciągnął PGlite.
 */
export async function createDb(url: string): Promise<DbHandle> {
  if (url.startsWith("pglite://")) {
    const { PGlite } = await import("@electric-sql/pglite");
    const path = url.slice("pglite://".length);
    const client = await PGlite.create(path === "memory" || path === "" ? undefined : path);
    return fromPglite(client);
  }
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const client = postgres(url, { max: 10, onnotice: () => {} });
    const db = drizzle(client, { schema }) as unknown as Db;
    return { db, kind: "pg", close: () => client.end() };
  }
  throw new Error(`Nieobsługiwany DATABASE_URL: ${url.split(":")[0]}:// (oczekiwano postgres:// lub pglite://)`);
}

/** Opakowuje istniejącą instancję PGlite (używane przez helpery testowe ze zrzutem). */
export async function fromPglite(client: PGlite): Promise<DbHandle> {
  const { drizzle } = await import("drizzle-orm/pglite");
  const db = drizzle(client, { schema }) as unknown as Db;
  return { db, kind: "pglite", close: () => client.close() };
}
