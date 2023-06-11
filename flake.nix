{
  description = "Project templates that make initializing new projects easier";

  outputs = { self, nixpkgs }: {

    templates.devenv = {
      path = ./devenv;
      description =
        "Flake based project using devenv for maintaining dependencies";
      welcomeText = ''
        wazzup
      '';
    };
    templates.direnv = {
      path = ./direnv;
      description = "My main way to init new projects atm";
      welcomeText = ''
        wazzup
      '';
    };

    templates.default = self.templates.direnv;

  };
}
