/**
 * Prerender stron marketingowych do statycznego HTML (dist/<path>/index.html).
 * Pozostałe ścieżki obsługuje fallback SPA (Workers: not_found_handling=single-page-application).
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");
const mod = (await import(join(ssrDir, "entry-prerender.js"))) as {
  render: (url: string) => string;
  prerenderPaths: string[];
  metaFor: (path: string) => { title: string; description: string };
};
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const template = readFileSync(join(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error('index.html: brak <div id="root"></div>');

for (const path of mod.prerenderPaths) {
  const html = mod.render(path);
  const meta = mod.metaFor(path);
  const page = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeHtml(meta.description)}"`,
    )
    .replace('<html lang="pl">', `<html lang="pl" data-route="${path}">`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const outDir = path === "/" ? dist : join(dist, path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), page);
  console.log(`prerender: ${path} -> ${join(outDir, "index.html").replace(`${root}/`, "")} (${html.length} B)`);
}
rmSync(ssrDir, { recursive: true, force: true });
