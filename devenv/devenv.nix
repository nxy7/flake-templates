{ pkgs, ... }:

{

  packages = with pkgs; [ sqlx-cli kube3d nushell ];

  languages.nix.enable = true;
  languages.rust.enable = true;
  languages.typescript.enable = true;

}
