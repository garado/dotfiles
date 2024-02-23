
# █░█ █▀█ █▀▄▀█ █▀▀   █▀▄▀█ ▄▀█ █▄░█ ▄▀█ █▀▀ █▀▀ █▀█
# █▀█ █▄█ █░▀░█ ██▄   █░▀░█ █▀█ █░▀█ █▀█ █▄█ ██▄ █▀▄

{ inputs, lib, config, pkgs, ... }: {

  imports = [
    # These come from inputs defined in `flake.nix`
    inputs.ags.homeManagerModules.default
  
    # Import other pieces of config
    ./hyprland.nix
    ./zsh.nix
    ./nvim.nix
  ];

  nixpkgs = {
    config = {
      allowUnfree = true;
    };
  };

  home = {
    username = "alexis";
    homeDirectory = "/home/alexis";

    packages = with pkgs; [
      # System
      ripgrep
      zip
      unzip
      wget

      # Entertainment
      steam

      # Productivity
      gcalcli

      # Work/Development
      # hugo    # TODO: move to its own environment thingy?
    ];
  
  };
    
  programs.ags = {
    enable = true;
    configDir = ./services/ags;
  };

  programs.git = {
    enable = true;
    userName = "garado";
    userEmail = "alexisgarado@gmail.com";
  };

  programs.ledger = {
    enable = true;

    # .ledgerrc replacement
    # settings = [
    # ];
  };

  # Nicely reload system units when changing configs
  systemd.user.startServices = "sd-switch";
 
  # Let home-manager install and manage itself
  programs.home-manager.enable = true;

  # https://nixos.wiki/wiki/FAQ/When_do_I_update_stateVersion
  home.stateVersion = "23.11";
}
