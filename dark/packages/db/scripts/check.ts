/**
 * Kontrola migracji (etap verify):
 *  1. dryf: schema.ts musi być w pełni pokryty przez ./migrations (drizzle-kit generate nic nie tworzy),
 *  2. migracje przechodzą na czystej bazie (PGlite; dodatkowo Postgres, jeśli DATABASE_URL=postgres://),
 *  3. ponowne uruchomienie migracji jest no-opem.
 */
import { cpSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { createDb, migrate, migrationsFolder } from "../src/index";

const EXPECTED = ["account", "notes", "session", "user", "verification"];

function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true }).map(String).sort();
}

// 1. dryf
const tmp = mkdtempSync(join(tmpdir(), "drift-"));
try {
  cpSync(migrationsFolder, tmp, { recursive: true });
  const before = listFiles(tmp);
  const proc = Bun.spawnSync(["bunx", "drizzle-kit", "generate"], {
    cwd: join(import.meta.dir, ".."),
    env: { ...process.env, DRIZZLE_OUT: tmp },
    stdout: "pipe",
    stderr: "pipe",
  });
  if (proc.exitCode !== 0) {
    console.error(proc.stderr.toString());
    throw new Error("drizzle-kit generate zakończył się błędem");
  }
  const after = listFiles(tmp);
  if (after.length !== before.length) {
    throw new Error(
      `Dryf schematu: schema.ts ma zmiany bez migracji. Uruchom 'bun run db:generate'. Nowe pliki: ${after.filter((f) => !before.includes(f)).join(", ")}`,
    );
  }
  console.log("dryf schematu: brak");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// 2 + 3. czysta baza
async function checkOn(label: string, url: string) {
  const handle = await createDb(url);
  try {
    await migrate(handle);
    await migrate(handle);
    const rows = await handle.db.execute<{ table_name: string }>(
      sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`,
    );
    const list = (Array.isArray(rows) ? rows : (rows as { rows: { table_name: string }[] }).rows).map(
      (r) => r.table_name,
    );
    const missing = EXPECTED.filter((t) => !list.includes(t));
    if (missing.length) throw new Error(`${label}: brak tabel po migracji: ${missing.join(", ")}`);
    console.log(`migracje na czystej bazie (${label}): OK [${list.join(", ")}]`);
  } finally {
    await handle.close();
  }
}

await checkOn("pglite", "pglite://memory");

const pgUrl = process.env.DATABASE_URL;
if (pgUrl?.startsWith("postgres")) {
  const name = `migcheck_${Date.now()}`;
  const admin = await createDb(pgUrl);
  await admin.db.execute(sql.raw(`create database ${name}`));
  try {
    const u = new URL(pgUrl);
    u.pathname = `/${name}`;
    await checkOn("postgres", u.toString());
  } finally {
    await admin.db.execute(sql.raw(`drop database if exists ${name}`));
    await admin.close();
  }
}
