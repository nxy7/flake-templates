declare global {
  interface Window {
    /** Nadpisanie adresu API w runtime (E2E per worker, ewentualnie hosting). */
    __API_URL__?: string;
  }
}

/** Jedyne miejsce, które zna adres API. */
export function apiBaseUrl(): string {
  const runtime = typeof window !== "undefined" ? window.__API_URL__ : undefined;
  return runtime ?? import.meta.env.VITE_API_URL ?? "http://localhost:3000";
}
