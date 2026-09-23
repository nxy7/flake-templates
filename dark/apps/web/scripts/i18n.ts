/** Kompiluje komunikaty Paraglide (bez Vite): przed typecheckiem i E2E. */
import { compile } from "@inlang/paraglide-js";
import { paraglide } from "../paraglide.config.ts";

await compile(paraglide);
console.log(`paraglide: skompilowano -> ${paraglide.outdir}`);
