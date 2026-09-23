import { z } from "zod";

const csv = z
  .string()
  .default("")
  .transform((s) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  );

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().default(3000),
  DATABASE_URL: z.string().min(1),
  /** Publiczny URL API (baseURL Better Auth), np. https://api.example.com */
  API_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET musi mieć min. 32 znaki"),
  /** Originy frontu: web + capacitor://localhost (iOS) + https://localhost (Android). */
  TRUSTED_ORIGINS: csv,
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Błędna konfiguracja środowiska:\n${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}
