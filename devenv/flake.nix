{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flakeUtils.url = "github:numtide/flake-utils";
    nix2container.url = "github:nlewo/nix2container";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, flakeUtils, nix2container, devenv, ... }@inputs:
    flakeUtils.lib.eachSystem [ "x86_64-linux" ] (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in {
        devShells.default = devenv.lib.mkShell {
          inherit pkgs inputs;
          modules = [ (import ./devenv.nix { inherit pkgs inputs; }) ];
        };
      });
}
