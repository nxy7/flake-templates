import { site } from "../content/site";
import { m } from "../paraglide/messages.js";

export default function About() {
  return (
    <article class="narrow prose">
      <h1 class="display small">{m.about_title()}</h1>
      <p class="lead">{site().description}</p>
      <p>{m.about_body()}</p>
    </article>
  );
}
