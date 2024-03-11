{
  description = "Project templates that make initializing new projects easier";

  outputs = _: {

    templates.devenv = {
      path = ./devenv;
      description =
        "Flake based project using devenv for maintaining dependencies";
      welcomeText = ''
        Sup
      '';
    };
    templates.direnv = {
      path = ./direnv;
      description = "My main way to init new projects atm";
      welcomeText = ''
        Sup
      '';
    };
    templates.golang = {
      path = ./golang-service;
      description = "Golang web service template";
      welcomeText = ''
        Hello
      '';
    };
    templates.bun = {
      path = ./bun;
      description = "Bun project starter";
      welcomeText = ''
        Hello
      '';
    };
    templates.nest = {
      path = ./nest;
      description = "NestJS project starter";
      welcomeText = ''
        Hello
      '';
    };
    templates.rust = {
      path = ./rust;
      description = "Flake with basic rust tools";
      welcomeText = ''
        Hello
      '';
    };

  };
}
