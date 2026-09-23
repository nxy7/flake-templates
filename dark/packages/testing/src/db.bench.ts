/**
 * Pomiar startu instancji PGlite: loadDataDir (zrzut) vs clone() vs migracje od zera.
 * Uruchom: bun packages/testing/src/db.bench.ts
 */
import { fromPglite, migrate } from "@app/db";
import { PGlite } from "@electric-sql/pglite";

const N = 10;
const time = async (label: string, fn: () => Promise<{ close(): Promise<void> }>) => {
  const ms: number[] = [];
  for (let i = 0; i < N; i++) {
    const s = performance.now();
    const pg = await fn();
    ms.push(performance.now() - s);
    await pg.close();
  }
  ms.sort((a, b) => a - b);
  const avg = ms.reduce((a, b) => a + b, 0) / N;
  console.log(
    `${label.padEnd(28)} avg ${avg.toFixed(1)} ms  p50 ${ms[N >> 1]!.toFixed(1)} ms  max ${ms[N - 1]!.toFixed(1)} ms`,
  );
};

const template = await PGlite.create();
await migrate(await fromPglite(template));
const dump = await template.dumpDataDir("none");

await time("od zera + migracje", async () => {
  const pg = await PGlite.create();
  await migrate(await fromPglite(pg));
  return pg;
});
await time("loadDataDir (zrzut)", () => PGlite.create({ loadDataDir: dump }));
await time("clone()", () => template.clone());
await template.close();
