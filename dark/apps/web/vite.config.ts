import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { paraglide } from "./paraglide.config.ts";

// Build klienta: zwykły DOM. Build --ssr (tylko prerender w build-time): generate "ssr".
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [paraglideVitePlugin(paraglide), solid({ ssr: Boolean(isSsrBuild) })],
  build: { target: "es2022" },
  ssr: { noExternal: true },
  server: { port: 5173 },
}));
