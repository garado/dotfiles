
# ▀█ █▀ █░█
# █▄ ▄█ █▀█

{ inputs, lib, config, pkgs, ... }: {
  programs.zsh = {
    enable = true;
    
    # Extra commands to add to .zshrc
    initExtra = ''
      bindkey -v
      bindkey -M viins 'jk' vi-cmd-mode
    '';

    # Extra commands to be added to .zshenv
    # envExtra = ''
    # ''; 

    oh-my-zsh = {
      enable = true;
      theme = "theunraveler";
    };

    shellAliases = {
      # Shell
      ".." = "cd ..";
      c = "clear";
      lsa = "ls -la";
      
      # Nix
      rebuild = "sudo nixos-rebuild switch --flake .#astarion";

      # Shortcut
      v = "nvim";
      nv = "nvim";

      # Git
      gst = "git status";
      gc = "git commit -m ";
    };
  };

}
