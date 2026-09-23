/**
 * Serwer dla E2E i lokalnego dev: migruje bazę (PGlite lub Postgres z DATABASE_URL)
 * i dokłada /__test/reset. Odmawia startu poza NODE_ENV=test.
 */
import { createDb, migrate } from "@app/db";
import { TEST_ENV } from "@app/testing/api";
import { createApp } from "./app";
import { loadEnv } from "./env";
import { createTestRoutes } from "./test-routes";

const env = loadEnv({
  ...TEST_ENV,
  API_URL: `http://localhost:${process.env.PORT ?? 3000}`,
  ...process.env,
});
if (env.NODE_ENV !== "test") {
  console.error("test-server.ts wymaga NODE_ENV=test");
  process.exit(1);
}

const handle = await createDb(env.DATABASE_URL);
await migrate(handle);
const { app } = createApp({ db: handle.db, env });
app.route("/", createTestRoutes(handle.db));

const server = Bun.serve({ port: env.PORT, fetch: app.fetch });
console.log(`api(test): nasłuch na :${server.port} [${handle.kind}]`);

for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.on(sig, async () => {
    server.stop(true);
    await handle.close();
    process.exit(0);
  });
}
