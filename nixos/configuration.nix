
# █▀▀ █▀█ █▄░█ █▀▀ █ █▀▀ █░█ █▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
# █▄▄ █▄█ █░▀█ █▀░ █ █▄█ █▄█ █▀▄ █▀█ ░█░ █ █▄█ █░▀█

# Replaces /etc/nixos/configuration.nix

# A .nix file is just a big Nix expression (I think)
# This .nix file is a function that takes an attribute set as an input

{ inputs, lib, config, pkgs, ... }: {

  # BASIC SYSTEM CONFIGURATION --------------------

  imports = [
    ./hardware-configuration.nix
    ./fonts.nix
    # ../system/greetd.nix
  ];

  # Configure nixpkgs instance
  nixpkgs = {
    config = {
      allowUnfree = true;
      permittedInsecurePackages = [
        "electron-25.9.0" # obsidian
      ];
    };
  };

  # Other Nix settings
  nix.settings = {
    experimental-features = "nix-command flakes";

    # Deduplicate and optimize nix store
    auto-optimise-store = true;
  };

  # Networking
  networking = {
    hostName = "astarion";
    networkmanager.enable = true;
  };

  # Hardware
  hardware = {
    pulseaudio.enable = true;
    bluetooth.enable = true;
    bluetooth.powerOnBoot = true;
  };

  # Bootloader
  boot.loader.systemd-boot.enable = true;

  # https://nixos.wiki/wiki/FAQ/When_do_I_update_stateVersion
  system.stateVersion = "23.05";

  # SYSTEM PACKAGES ----------------------------

  # Minimal system requirements - installed for all users
  environment.systemPackages = with pkgs; [
    # Basic cli programs
    vim
    brightnessctl
    hugo
    
    # Basic GUI programs
    kitty
    chromium
    gthumb
    imagemagick

    # mount iphone
    libimobiledevice
    ifuse

    # C compiler
    libgccjit
    gcc_multi

    # etc
    playerctl
    taskwarrior-tui

    # python
    python3
  ];

  # SERVICES ---------------------------------

  services = {
    upower.enable = true;

    # i think this was for connection iphone
    usbmuxd = {
      enable = true;
      package = pkgs.usbmuxd2;
    };

    greetd = {
      enable = true;
      settings = {
        default_session = {
          command = "${pkgs.greetd.tuigreet}/bin/tuigreet --time --cmd Hyprland";
          user = "greeter";
        };
      };
    };

  };

  # The difference between including something in systemPackages above
  # and doing `programs.something.enable = true` below is just that the
  # method below lets you specify more config options. The top method
  # only installs the package.

  programs.git.enable = true;

  programs.zsh.enable = true;

  programs.hyprland.enable = true;
  
  programs.steam.enable = true;

  programs.thunar.enable = true;

  # USER CONFIGURATION ---------------------------

  users = {
    defaultUserShell = pkgs.zsh;
    users = {
      alexis = {
        initialPassword = "password";
        isNormalUser = true;
        extraGroups = ["wheel" "networkmanager" "audio" "sound"];
      };
    };
  };
}
