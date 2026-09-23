import type { AppType } from "@app/api";
import { createAuthClient } from "better-auth/client";
import { hc } from "hono/client";
import { apiBaseUrl } from "./config";
import { authHeaders, captureToken } from "./token";

/** Klient RPC: typy tras i odpowiedzi pochodzą wprost z apps/api (jedno źródło prawdy). */
export const api = hc<AppType>(apiBaseUrl(), { headers: () => authHeaders() });

export const authClient = createAuthClient({
  baseURL: apiBaseUrl(),
  basePath: "/api/auth",
  fetchOptions: {
    auth: { type: "Bearer", token: () => authHeaders().authorization?.slice(7) ?? "" },
    onSuccess: (ctx) => captureToken(ctx.response.headers),
  },
});
