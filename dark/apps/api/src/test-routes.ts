import type { Db } from "@app/db";
import { schema } from "@app/db";
import { getTableName, sql } from "drizzle-orm";
import { Hono } from "hono";

/**
 * Endpointy wyłącznie dla testów. Montowane tylko przez test-server.ts przy NODE_ENV=test.
 * Nigdy nie importuj tego pliku z kodu produkcyjnego.
 */
export function createTestRoutes(db: Db) {
  return new Hono().post("/__test/reset", async (c) => {
    const tables = Object.values(schema.allTables)
      .map((t) => `"${getTableName(t)}"`)
      .join(", ");
    await db.execute(sql.raw(`truncate table ${tables} restart identity cascade`));
    return c.json({ ok: true });
  });
}
