import type { NoteCreate, NoteUpdate } from "@app/shared";
import { action, query } from "@solidjs/router";
import { parseResponse } from "hono/client";
import { api } from "../lib/api";

/**
 * WZORZEC DANYCH (Solid 1.9 + router): query() do odczytu, action() do zapisu.
 * parseResponse() rzuca dla odpowiedzi != 2xx i zwraca otypowane dane sukcesu.
 * Akcje po sukcesie unieważniają aktywne query (domyślne zachowanie routera).
 */
export const listNotes = query(() => parseResponse(api.api.notes.$get()), "notes");

export const createNote = action(async (input: NoteCreate) => {
  await parseResponse(api.api.notes.$post({ json: input }));
}, "createNote");

export const updateNote = action(async (id: string, input: NoteUpdate) => {
  await parseResponse(api.api.notes[":id"].$patch({ param: { id }, json: input }));
}, "updateNote");

export const deleteNote = action(async (id: string) => {
  await parseResponse(api.api.notes[":id"].$delete({ param: { id } }));
}, "deleteNote");
