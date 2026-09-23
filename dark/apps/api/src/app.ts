import type { Db } from "@app/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createAuth } from "./auth";
import type { AppEnv } from "./context";
import type { Env } from "./env";
import { notesRoutes } from "./routes/notes";

/**
 * Składa aplikację. Dostaje gotowego klienta Drizzle (nie wie, jaka baza jest pod spodem).
 * Jedyne miejsce montowania routerów; typ AppType eksportowany dla klienta RPC we froncie.
 */
export function createApp({ db, env }: { db: Db; env: Env }) {
  const auth = createAuth(db, env);

  const app = new Hono<AppEnv>();
  if (env.NODE_ENV !== "test") app.use(logger());
  app.use(
    "/api/*",
    cors({
      origin: env.TRUSTED_ORIGINS,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      exposeHeaders: ["set-auth-token"],
    }),
  );
  app.use(async (c, next) => {
    c.set("db", db);
    c.set("auth", auth);
    await next();
  });
  app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));
  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "internal_error" }, 500);
  });

  const routes = app.get("/health", (c) => c.json({ ok: true })).route("/api/notes", notesRoutes);

  return { app: routes, auth };
}

export type AppType = ReturnType<typeof createApp>["app"];
