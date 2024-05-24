
# █░█ █▀█ █▀▄▀█ █▀▀   █▀▄▀█ ▄▀█ █▄░█ ▄▀█ █▀▀ █▀▀ █▀█
# █▀█ █▄█ █░▀░█ ██▄   █░▀░█ █▀█ █░▀█ █▀█ █▄█ ██▄ █▀▄

{ inputs, lib, config, pkgs, ... }: {

  imports = [
    # These come from inputs defined in `flake.nix`
    inputs.ags.homeManagerModules.default
  
    # Import other pieces of config
    ./programs
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
      lf

      # Entertainment
      ncspot

      # Productivity
      # obsidian  # electron unstable
      qutebrowser
      gcalcli

      # Development
      # TODO move these to a shell.nix
      dart-sass # Need this for ags
      gnome.gvfs # also needed for ags?
      # nodejs_21 # for masoninstall
    ];
  
  };

  gtk = {
    enable = true;
    font.name = "CircularStd";
    font.size = 14;
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

    # Replaces .ledgerrc
    settings = {
      file = "~/Enchiridion/ledger/2024/2024.ledger";
    };
  };

  # Nicely reload system units when changing configs
  systemd.user.startServices = "sd-switch";
 
  # Let home-manager install and manage itself
  programs.home-manager.enable = true;

  # home-manager version
  home.stateVersion = "24.05";
}
