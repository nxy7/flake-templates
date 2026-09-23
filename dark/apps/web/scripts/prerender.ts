/**
 * Prerender stron marketingowych do statycznego HTML dla każdego języka:
 *   en (bazowy): dist/index.html, dist/about/index.html
 *   pl:          dist/pl/index.html, dist/pl/about/index.html
 * Pozostałe ścieżki obsługuje fallback SPA (Workers: not_found_handling=single-page-application).
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");
type Rendered = { url: string; html: string; meta: { title: string; description: string } };
const mod = (await import(join(ssrDir, "entry-prerender.js"))) as {
  render: (path: string, locale: string) => Rendered;
  prerenderPaths: string[];
  locales: readonly string[];
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const template = readFileSync(join(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error('index.html: brak <div id="root"></div>');

for (const locale of mod.locales) {
  for (const path of mod.prerenderPaths) {
    const { url, html, meta } = mod.render(path, locale);
    const page = template
      .replace('<html lang="en">', `<html lang="${locale}" data-route="${url.replace(/\/+$/, "") || "/"}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${escapeHtml(meta.description)}"`,
      )
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    const outDir = url === "/" ? dist : join(dist, url);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), page);
    console.log(
      `prerender [${locale}]: ${url} -> ${join(outDir, "index.html").replace(`${root}/`, "")} (${html.length} B)`,
    );
  }
}
rmSync(ssrDir, { recursive: true, force: true });
