import { A, action, redirect, revalidate, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { getSession } from "../data/session";
import { authClient } from "../lib/api";
import { m } from "../paraglide/messages.js";

type Mode = "login" | "register";

const submitAuth = action(async (mode: Mode, form: FormData) => {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const { error } =
    mode === "register"
      ? await authClient.signUp.email({ email, password, name: String(form.get("name") || email) })
      : await authClient.signIn.email({ email, password });
  // Komunikat z naszych tłumaczeń, nie z Better Auth (ten jest zawsze po angielsku).
  if (error) throw new Error(mode === "register" ? m.auth_register_error() : m.auth_login_error());
  await revalidate(getSession.key);
  throw redirect("/app");
}, "auth");

export function AuthForm(props: { mode: Mode }) {
  const submission = useSubmission(submitAuth);
  const isRegister = () => props.mode === "register";
  return (
    <section class="narrow stack">
      <h1 class="display small">{isRegister() ? m.auth_register_title() : m.auth_login_title()}</h1>
      <form class="stack" method="post" action={submitAuth.with(props.mode)}>
        <Show when={isRegister()}>
          <label>
            {m.auth_name()}
            <input name="name" autocomplete="name" />
          </label>
        </Show>
        <label>
          {m.auth_email()}
          <input name="email" type="email" required autocomplete="email" />
        </label>
        <label>
          {m.auth_password()}
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
          {isRegister() ? m.auth_submit_register() : m.auth_submit_login()}
        </button>
      </form>
      <p>
        {isRegister() ? m.auth_have_account() : m.auth_no_account()}{" "}
        <A href={isRegister() ? "/login" : "/register"}>
          {isRegister() ? m.auth_goto_login() : m.auth_goto_register()}
        </A>
      </p>
    </section>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;
