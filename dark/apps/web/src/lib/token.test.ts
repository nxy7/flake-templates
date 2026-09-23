import { describe, expect, test } from "bun:test";
import { authHeaders, captureToken, clearToken, readToken } from "./token";

const memory = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
};

describe("token", () => {
  test("zapisuje token z nagłówka set-auth-token i buduje nagłówek Bearer", () => {
    const s = memory();
    captureToken(new Headers({ "set-auth-token": "abc" }), s);
    expect(readToken(s)).toBe("abc");
    expect(authHeaders(s)).toEqual({ authorization: "Bearer abc" });
  });

  test("brak nagłówka nie nadpisuje tokenu; clear usuwa", () => {
    const s = memory();
    captureToken(new Headers({ "set-auth-token": "abc" }), s);
    captureToken(new Headers(), s);
    expect(readToken(s)).toBe("abc");
    clearToken(s);
    expect(authHeaders(s)).toEqual({});
  });
});
