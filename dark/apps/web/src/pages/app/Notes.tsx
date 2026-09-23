import type { Note } from "@app/shared";
import { NOTE_TITLE_MAX } from "@app/shared";
import { createAsync, revalidate, useAction, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { createNote, deleteNote, listNotes, updateNote } from "../../data/notes";
import { getSession } from "../../data/session";
import { authClient } from "../../lib/api";
import { clearToken } from "../../lib/token";

/** WZORZEC EKRANU: lista (createAsync) + formularz (action) + edycja inline. */
export default function Notes() {
  const notes = createAsync(() => listNotes());
  const adding = useSubmission(createNote);
  const createNoteAction = useAction(createNote);
  let formRef: HTMLFormElement | undefined;

  const onCreate = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    await createNoteAction({ title: String(form.get("title")), body: String(form.get("body") ?? "") });
    formRef?.reset();
  };
  const signOut = async () => {
    await authClient.signOut();
    clearToken();
    await revalidate(getSession.key);
  };

  return (
    <section>
      <div class="row" style={{ "justify-content": "space-between", "align-items": "center" }}>
        <h1>Twoje notatki</h1>
        <button class="btn secondary" type="button" onClick={signOut}>
          Wyloguj
        </button>
      </div>
      <form class="stack" ref={formRef} onSubmit={onCreate}>
        <label>
          Tytuł
          <input name="title" required maxLength={NOTE_TITLE_MAX} />
        </label>
        <label>
          Treść
          <textarea name="body" />
        </label>
        <Show when={adding.error}>
          <p class="error" role="alert">
            Nie udało się zapisać notatki.
          </p>
        </Show>
        <button class="btn" type="submit" disabled={adding.pending}>
          Dodaj notatkę
        </button>
      </form>
      <Suspense fallback={<p class="empty">Ładowanie…</p>}>
        <ul class="notes" aria-label="Notatki">
          <For each={notes()} fallback={<li class="empty">Brak notatek. Dodaj pierwszą.</li>}>
            {(note) => <NoteItem note={note} />}
          </For>
        </ul>
      </Suspense>
    </section>
  );
}

function NoteItem(props: { note: Note }) {
  const [editing, setEditing] = createSignal(false);
  const update = useAction(updateNote);
  const remove = useAction(deleteNote);

  const onSave = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    await update(props.note.id, { title: String(form.get("title")), body: String(form.get("body") ?? "") });
    setEditing(false);
  };

  return (
    <li class="note">
      <Show
        when={editing()}
        fallback={
          <>
            <h3>{props.note.title}</h3>
            <Show when={props.note.body}>
              <p>{props.note.body}</p>
            </Show>
            <div class="row">
              <button class="btn secondary" type="button" onClick={() => setEditing(true)}>
                Edytuj
              </button>
              <button class="btn danger" type="button" onClick={() => remove(props.note.id)}>
                Usuń
              </button>
            </div>
          </>
        }
      >
        <form class="stack" onSubmit={onSave}>
          <label>
            Tytuł
            <input name="title" required maxLength={NOTE_TITLE_MAX} value={props.note.title} />
          </label>
          <label>
            Treść
            <textarea name="body" value={props.note.body} />
          </label>
          <div class="row">
            <button class="btn" type="submit">
              Zapisz
            </button>
            <button class="btn secondary" type="button" onClick={() => setEditing(false)}>
              Anuluj
            </button>
          </div>
        </form>
      </Show>
    </li>
  );
}
