import type { Note } from "@app/shared";
import { NOTE_TITLE_MAX } from "@app/shared";
import { createAsync, revalidate, useAction, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { createNote, deleteNote, listNotes, updateNote } from "../../data/notes";
import { getSession } from "../../data/session";
import { authClient } from "../../lib/api";
import { clearToken } from "../../lib/token";
import { m } from "../../paraglide/messages.js";

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
      <div class="app-head">
        <h1 class="display small">{m.notes_title()}</h1>
        <button class="btn secondary" type="button" onClick={signOut}>
          {m.notes_sign_out()}
        </button>
      </div>
      <form class="stack" ref={formRef} onSubmit={onCreate}>
        <label>
          {m.notes_field_title()}
          <input name="title" required maxLength={NOTE_TITLE_MAX} />
        </label>
        <label>
          {m.notes_field_body()}
          <textarea name="body" />
        </label>
        <Show when={adding.error}>
          <p class="error" role="alert">
            {m.notes_save_error()}
          </p>
        </Show>
        <button class="btn" type="submit" disabled={adding.pending}>
          {m.notes_add()}
        </button>
      </form>
      <Suspense fallback={<p class="empty">{m.loading()}</p>}>
        <ul class="notes" aria-label={m.notes_list_label()}>
          <For each={notes()} fallback={<li class="empty">{m.notes_empty()}</li>}>
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
              <p class="note-body">{props.note.body}</p>
            </Show>
            <div class="row">
              <button class="btn secondary" type="button" onClick={() => setEditing(true)}>
                {m.notes_edit()}
              </button>
              <button class="btn danger" type="button" onClick={() => remove(props.note.id)}>
                {m.notes_delete()}
              </button>
            </div>
          </>
        }
      >
        <form class="stack" onSubmit={onSave}>
          <label>
            {m.notes_field_title()}
            <input name="title" required maxLength={NOTE_TITLE_MAX} value={props.note.title} />
          </label>
          <label>
            {m.notes_field_body()}
            <textarea name="body" value={props.note.body} />
          </label>
          <div class="row">
            <button class="btn" type="submit">
              {m.notes_save()}
            </button>
            <button class="btn secondary" type="button" onClick={() => setEditing(false)}>
              {m.notes_cancel()}
            </button>
          </div>
        </form>
      </Show>
    </li>
  );
}
