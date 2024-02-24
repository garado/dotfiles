
# █░█ █▀█ █▀▄▀█ █▀▀   █▀▄▀█ ▄▀█ █▄░█ ▄▀█ █▀▀ █▀▀ █▀█
# █▀█ █▄█ █░▀░█ ██▄   █░▀░█ █▀█ █░▀█ █▀█ █▄█ ██▄ █▀▄

{ inputs, lib, config, pkgs, ... }: {

  imports = [
    # These come from inputs defined in `flake.nix`
    inputs.ags.homeManagerModules.default
  
    # Import other pieces of config
    ./zsh
    ./programs
    # ./programs/hyprland.nix
    # ./programs/nvim.nix
    # ./programs/kitty.nix
    # ./programs/qutebrowser.nix
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
      steam

      # Productivity
      # obsidian  # electron unstable
      qutebrowser
      gcalcli

      # Development
      dart-sass # Need this for ags TODO: move to own environment?
      nodejs_21 # for masoninstall
      python3   # sourcery
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

    # Replaces .ledgerrc
    settings = {
      file = "~/Documents/Ledger/2024.ledger";
    };
  };

  # Nicely reload system units when changing configs
  systemd.user.startServices = "sd-switch";
 
  # Let home-manager install and manage itself
  programs.home-manager.enable = true;

  # home-manager version
  home.stateVersion = "23.11";
}
