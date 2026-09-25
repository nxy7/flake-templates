import { type DbHandle, fromPglite, migrate } from "@app/db";
import { PGlite } from "@electric-sql/pglite";

/**
 * Zrzut PGlite: migracje wykonują się RAZ na proces testowy, potem każdy test dostaje
 * świeżą instancję ładowaną ze zrzutu datadir (loadDataDir). Zmierzone w raporcie:
 * clone() vs loadDataDir — patrz docs/testing.md.
 */
let snapshot: Promise<Blob> | undefined;

async function buildSnapshot(): Promise<Blob> {
  const template = await PGlite.create();
  const handle = await fromPglite(template);
  await migrate(handle);
  const dump = await template.dumpDataDir("none");
  await template.close();
  return dump;
}

/** Świeża, zmigrowana baza PGlite dla pojedynczego testu. Zawsze wołaj close(). */
export async function freshTestDb(): Promise<DbHandle> {
  snapshot ??= buildSnapshot();
  const client = await PGlite.create({ loadDataDir: await snapshot });
  return fromPglite(client);
}
