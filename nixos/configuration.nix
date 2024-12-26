
# █▀▀ █▀█ █▄░█ █▀▀ █ █▀▀ █░█ █▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
# █▄▄ █▄█ █░▀█ █▀░ █ █▄█ █▄█ █▀▄ █▀█ ░█░ █ █▄█ █░▀█

# Replaces /etc/nixos/configuration.nix

# A .nix file is just a big Nix expression (I think)
# This .nix file is a function that takes an attribute set as an inputs

{ inputs, lib, config, pkgs, musnix, ... }: 
let 
  # unstable = inputs.nixpkgs-unstable;
in {

  # --------------------------------------------
  # BASIC SYSTEM CONFIGURATION
  # --------------------------------------------

  imports = [
    ./hardware-configuration.nix
    ./fonts.nix
  ];

  # Networking
  networking = {
    hostName = "astarion";
    networkmanager.enable = true;
  };

  # Hardware
  hardware = {
    # pulseaudio.enable = true;

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

  # Miscellaneous settings
  nix.settings = {
    experimental-features = "nix-command flakes";

    # Deduplicate and optimize nix store
    auto-optimise-store = true;
  };

  # https://nixos.wiki/wiki/FAQ/When_do_I_update_stateVersion
  system.stateVersion = "23.11";

  virtualisation.docker.enable = true;
  
  # --------------------------------------------
  # SYSTEM PACKAGES
  # These will be installed for all users
  # --------------------------------------------

  # Explicitly specify allowed unfree packages
  nixpkgs.config.allowUnfreePredicate = pkg: builtins.elem (lib.getName pkg) [
    "steam"
    "steam-original"
    "steam-run"
    "steam-tui"
    "steam-unwrapped"
  ];


  environment.systemPackages = with pkgs; [
    vim
    brightnessctl
    grimblast       # Screenshots
    htop            # View system stats

    nodejs_22 hugo go

    reckon          # CLI CSV to ledger with ML

    exiftool

    ripgrep zip unzip wget lf

    kitty           # Terminal
    firefox
    gthumb
    imagemagick

    libimobiledevice  # Mount iPhone
    ifuse

    libgccjit       # Stuff for C
    gcc_multi

    playerctl       # Track control
    zathura         # PDF viewer
    wl-clipboard
    gimp            # Photoshop minus the piece of shit subscription service

    # python
    python3

    guitarix        # Amp sim
    qjackctl        # Alllll for the amp sim
    libjack2
    jack2
    jack_capture
    prismlauncher   # Minecraft
    sox             # Play audio
    audacity        # Audio editing
    pamixer         # Volume control
    pavucontrol     # Audio control
    wineWowPackages.stable  # *gag*
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

  
  # --------------------------------------------
  # SYSTEM SERVICES
  # --------------------------------------------

  security.acme.acceptTerms = true;
  security.acme.defaults.email = "alexisgarado@gmail.com";


  services = {
    automatic-timezoned.enable = true;

    upower.enable = true;

    # For inventory
    grocy = {
      enable = true;
      hostName = "localhost";
      nginx.enableSSL = false;
      
      settings = {
        currency = "USD";
      };
    };

    # snipe-it = {
    #   enable = true;
    #   # appKeyFile = "/usr/local/var/lib/snipeit/appkey";
    #   database.createLocally = true;
    #   user = "snipeit";
    #   group = "snipeit";
    #   config = {
    #     APP_KEY = "jZAS9kkRjL6ghzxaSNjwthLsJW0y1CzJLSqlDGmUc+U=";
    #     APP_ENV = "production";
    #     APP_DEBUG = false;
    #     # APP_URL = "http://ChangeMe"
    #     APP_TIMEZONE = "America/Los_Angeles";
    #     APP_LOCALE = "en";
    #     MAX_RESULTS = 500;
    #   };
    # };

    # couchdb = {
    #   enable = false;
    #   user = "couchdb";
    #   group = "couchdb";
    #   adminUser = "couchdb";
    #   adminPass = "test";
    # };

    xserver = {
      enable = true;
      displayManager.gdm.enable = true; # @TODO
    };

    # Connecting iPhone
    usbmuxd = {
      enable = true;
      package = pkgs.usbmuxd2; # @TODO
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


  # --------------------------------------------
  # PROGRAMS
  # --------------------------------------------

  programs = {
    git.enable = true;
    zsh.enable = true;
    hyprland.enable = true;
    steam.enable = true;
    thunar.enable = true;
  };


  # --------------------------------------------
  # USER CONFIGURATION
  # --------------------------------------------

  users = {
    defaultUserShell = pkgs.zsh;

    users = {
      alexis = {
        initialPassword = "password";
        isNormalUser = true;
        extraGroups = [
          "wheel"
          "networkmanager" 
          "audio"
          "sound"
          "docker"
        ];
      };

    };
  };
}
