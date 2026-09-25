import { fileURLToPath } from "node:url";
import type { DbHandle } from "./client";

/** Katalog migracji; w obrazie Dockera nadpisywany przez MIGRATIONS_DIR. */
export const migrationsFolder = process.env.MIGRATIONS_DIR ?? fileURLToPath(new URL("../migrations", import.meta.url));

export async function migrate(handle: DbHandle): Promise<void> {
  if (handle.kind === "pglite") {
    const { migrate: run } = await import("drizzle-orm/pglite/migrator");
    // biome-ignore lint/suspicious/noExplicitAny: migrator wymaga konkretnego typu sterownika
    await run(handle.db as any, { migrationsFolder });
  } else {
    const { migrate: run } = await import("drizzle-orm/postgres-js/migrator");
    // biome-ignore lint/suspicious/noExplicitAny: jw.
    await run(handle.db as any, { migrationsFolder });
  }
}
