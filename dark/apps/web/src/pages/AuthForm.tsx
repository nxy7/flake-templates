import { A, action, redirect, revalidate, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { getSession } from "../data/session";
import { authClient } from "../lib/api";

type Mode = "login" | "register";

const submitAuth = action(async (mode: Mode, form: FormData) => {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const { error } =
    mode === "register"
      ? await authClient.signUp.email({ email, password, name: String(form.get("name") || email) })
      : await authClient.signIn.email({ email, password });
  if (error) throw new Error(error.message ?? "Nie udało się zalogować");
  await revalidate(getSession.key);
  throw redirect("/app");
}, "auth");

export function AuthForm(props: { mode: Mode }) {
  const submission = useSubmission(submitAuth);
  const isRegister = () => props.mode === "register";
  return (
    <section class="stack">
      <h1>{isRegister() ? "Załóż konto" : "Zaloguj się"}</h1>
      <form class="stack" method="post" action={submitAuth.with(props.mode)}>
        <Show when={isRegister()}>
          <label>
            Imię
            <input name="name" autocomplete="name" />
          </label>
        </Show>
        <label>
          Email
          <input name="email" type="email" required autocomplete="email" />
        </label>
        <label>
          Hasło
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autocomplete={isRegister() ? "new-password" : "current-password"}
          />
        </label>
        <Show when={submission.error}>
          {(err) => (
            <p class="error" role="alert">
              {(err() as Error).message}
            </p>
          )}
        </Show>
        <button class="btn" type="submit" disabled={submission.pending}>
          {isRegister() ? "Utwórz konto" : "Zaloguj"}
        </button>
      </form>
      <p>
        {isRegister() ? "Masz konto? " : "Nie masz konta? "}
        <A href={isRegister() ? "/login" : "/register"}>{isRegister() ? "Zaloguj się" : "Zarejestruj się"}</A>
      </p>
    </section>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;
