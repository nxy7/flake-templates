/**
 * Token sesji (Better Auth, plugin bearer). Jedna ścieżka dla web i Capacitora.
 * Logika czysta — testowana w token.test.ts z podmienionym storage.
 */
export const TOKEN_KEY = "auth_token";

type KV = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const storage = (): KV | undefined => (typeof localStorage === "undefined" ? undefined : localStorage);

export function readToken(s: KV | undefined = storage()): string | null {
  return s?.getItem(TOKEN_KEY) ?? null;
}

/** Zapisuje token z nagłówka odpowiedzi auth, jeśli jest. */
export function captureToken(headers: Headers, s: KV | undefined = storage()): void {
  const t = headers.get("set-auth-token");
  if (t) s?.setItem(TOKEN_KEY, t);
}

export function clearToken(s: KV | undefined = storage()): void {
  s?.removeItem(TOKEN_KEY);
}

export function authHeaders(s: KV | undefined = storage()): Record<string, string> {
  const t = readToken(s);
  return t ? { authorization: `Bearer ${t}` } : {};
}
