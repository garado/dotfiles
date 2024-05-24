
# █▀▀ █▀█ █▄░█ █▀▀ █ █▀▀ █░█ █▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
# █▄▄ █▄█ █░▀█ █▀░ █ █▄█ █▄█ █▀▄ █▀█ ░█░ █ █▄█ █░▀█

# Replaces /etc/nixos/configuration.nix

# A .nix file is just a big Nix expression (I think)
# This .nix file is a function that takes an attribute set as an input

{ inputs, lib, config, pkgs, musnix, ... }: 
let 
  # unstable = inputs.nixpkgs-unstable;
in {

  # BASIC SYSTEM CONFIGURATION --------------------

  imports = [
    ./hardware-configuration.nix
    ./fonts.nix
    # ../system/greetd.nix
  ];

  # Configure nixpkgs instance
  nixpkgs.config = {
    allowUnfree = true;

    # Add unstable channel
    # packageOverrides = pkgs: with pkgs; {
    #   unstable = import unstableTarball {
    #     config = config.nixpkgs.config;
    #   };
    # };
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

    bluetooth = {
      enable = true;
      powerOnBoot = true;
      settings = {
        General = {
          Experimental = true;
        };
      };
    };
  };

  # Bootloader
  boot = {
    loader.systemd-boot.enable = true;
    kernelModules = [ "snd-seq" "snd-rawmidi" ];
  };


  # https://nixos.wiki/wiki/FAQ/When_do_I_update_stateVersion
  system.stateVersion = "23.11";

  # SYSTEM PACKAGES ----------------------------

  # Minimal system requirements - installed for all users
  environment.systemPackages = with pkgs; [
    # Basic cli programs
    vim
    brightnessctl
    hugo
    grimblast # screenshot
    
    # Basic GUI programs
    kitty
    firefox
    gthumb
    imagemagick
    pavucontrol

    # mount iphone
    libimobiledevice
    ifuse

    # C compiler
    libgccjit
    gcc_multi

    # etc
    playerctl
    taskwarrior-tui
    zathura
    wl-clipboard
    gimp

    # python
    python3

    # Personal productivity
    obsidian

    # Music
    guitarix
    qjackctl

    # fucking jack
    libjack2
    jack2
    jack2Full
    jack_capture
  ];

  # jack -----------
  security.sudo.extraConfig = ''
    moritz  ALL=(ALL) NOPASSWD: ${pkgs.systemd}/bin/systemctl
    '';

  musnix = {
    enable = true;
    alsaSeq.enable = false;

    # Find this value with `lspci | grep -i audio` (per the musnix readme).
    # PITFALL: This is the id of the built-in soundcard.
    #   When I start using the external one, change it.
    soundcardPciId = "00:1f.3";

    # magic to me
    rtirq = {
      # highList = "snd_hrtimer";
      resetAll = 1;
      prioLow = 0;
      enable = true;
      nameList = "rtc0 snd";
    };
  };
  # end jack -----------

  environment.variables = {
    EDITOR = "nvim";
    VISUAL = "nvim";
  };

  environment.sessionVariables = rec {
    ENCHIRIDION = "$HOME/Enchiridion";
  };

  # SERVICES ---------------------------------

  services = {
    automatic-timezoned.enable = true;

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
        # extraGroups = ["wheel" "networkmanager" "audio" "sound" "jackaudio"];
        extraGroups = ["wheel" "networkmanager" "audio" "sound"];
      };
    };
  };
}
