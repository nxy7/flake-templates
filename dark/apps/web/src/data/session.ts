import { query } from "@solidjs/router";
import { authClient } from "../lib/api";
import { readToken } from "../lib/token";

/** Sesja użytkownika (null = niezalogowany). Unieważniaj przez revalidate(getSession.key). */
export const getSession = query(async () => {
  if (!readToken()) return null;
  const { data } = await authClient.getSession();
  return data?.user ?? null;
}, "session");
