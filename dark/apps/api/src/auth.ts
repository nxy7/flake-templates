import type { Db } from "@app/db";
import { schema } from "@app/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import type { Env } from "./env";

/**
 * Better Auth: email + hasło. Plugin bearer daje jedną ścieżkę uwierzytelniania dla web
 * i Capacitora (nagłówek Authorization), bez zależności od ciasteczek cross-site w WebView.
 */
export function createAuth(db: Db, env: Env) {
  return betterAuth({
    baseURL: env.API_URL,
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: env.TRUSTED_ORIGINS,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: { enabled: true, autoSignIn: true, minPasswordLength: 8 },
    plugins: [bearer()],
    rateLimit: { enabled: env.NODE_ENV === "production" },
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type SessionUser = Auth["$Infer"]["Session"]["user"];
