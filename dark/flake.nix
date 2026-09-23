{
  description = "factory-template: Bun + Hono + Drizzle + Solid + Capacitor + OpenTofu";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    { flake-parts, nixpkgs, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      perSystem =
        { system, ... }:
        let
          pkgs = import nixpkgs {
            inherit system;
            config = {
              allowUnfree = true;
              android_sdk.accept_license = true;
            };
          };

          # Jedno źródło prawdy dla wersji Androida (musi zgadzać się z apps/web/android/variables.gradle).
          android = pkgs.androidenv.composeAndroidPackages {
            platformVersions = [ "36" ];
            buildToolsVersions = [ "35.0.0" "36.0.0" ];
            includeEmulator = false;
            includeSystemImages = false;
            includeNDK = false;
          };
          androidSdk = android.androidsdk;

          # Narzędzia wspólne dla wszystkich powłok. Biome, Playwright, wrangler i cap
          # są zależnościami npm (bun.lock), więc nie dublujemy ich tutaj.
          base = with pkgs; [
            bun
            nodejs_24
            postgresql_17 # pg_dump / pg_restore / psql do testu backupu
            opentofu
            gh
            jq
          ];

          # mkShellNoCC: bez stdenv, żeby na macOS nie nadpisywać DEVELOPER_DIR/SDKROOT (xcodebuild).
          mkShell = packages: extra: pkgs.mkShellNoCC ({ inherit packages; } // extra);
        in
        {
          devShells.default = mkShell (base ++ [ pkgs.jdk21 androidSdk ]) {
            JAVA_HOME = pkgs.jdk21.home;
            ANDROID_HOME = "${androidSdk}/libexec/android-sdk";
            ANDROID_SDK_ROOT = "${androidSdk}/libexec/android-sdk";
            GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${androidSdk}/libexec/android-sdk/build-tools/36.0.0/aapt2";
          };

          # Lżejsza powłoka bez Androida (np. job iOS na macOS w CI).
          devShells.light = mkShell base { };

          formatter = pkgs.nixfmt;
        };
    };
}
