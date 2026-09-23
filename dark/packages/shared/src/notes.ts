import { z } from "zod";

/**
 * Kontrakt zasobu "notes". Jedno źródło prawdy dla walidacji w API (zod-validator)
 * i w formularzach frontendu. Nowy zasób = skopiuj ten plik.
 */
export const NOTE_TITLE_MAX = 200;
export const NOTE_BODY_MAX = 10_000;

const title = z
  .string()
  .trim()
  .min(1, "Tytuł jest wymagany")
  .max(NOTE_TITLE_MAX, `Tytuł może mieć maks. ${NOTE_TITLE_MAX} znaków`);
const body = z.string().max(NOTE_BODY_MAX, `Treść może mieć maks. ${NOTE_BODY_MAX} znaków`);

export const noteCreateSchema = z.object({ title, body: body.default("") });
export const noteUpdateSchema = z
  .object({ title, body })
  .partial()
  .refine((v) => Object.keys(v).length > 0, "Podaj co najmniej jedno pole");
export const noteIdSchema = z.object({ id: z.uuid() });

export type NoteCreate = z.input<typeof noteCreateSchema>;
export type NoteUpdate = z.input<typeof noteUpdateSchema>;

/** Kształt notatki na drucie (JSON). Daty jako ISO string. */
export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};
