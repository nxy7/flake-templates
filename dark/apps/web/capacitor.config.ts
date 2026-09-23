import type { CapacitorConfig } from "@capacitor/cli";

/** Ten sam build SPA (dist/) co web. appId zmień przy tworzeniu nowej aplikacji. */
const config: CapacitorConfig = {
  appId: "com.example.factory",
  appName: "Factory Template",
  webDir: "dist",
  android: { buildOptions: { releaseType: "APK" } },
};

export default config;
