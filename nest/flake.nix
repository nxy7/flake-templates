{
  description = "Project starter";
  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = { flake-parts, nixpkgs, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];
      perSystem = { config, system, ... }:
        let pkgs = import nixpkgs { inherit system; };
        in {
          devShells.default =
            pkgs.mkShell { packages = with pkgs; [ nodejs nest-cli ]; };
        };
    };
}

