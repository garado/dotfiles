
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
      # Basic shell commands
      c = "clear";
      lsa = "ls -la";
      
      # Quick navigation
      ".."      = "cd ..";
      "..."     = "cd ...";
      "...."    = "cd ....";
      "desk"    = "cd ~/Desktop";
      "dots"    = "cd ~/Github/dotfiles/";
      "docs"    = "cd ~/Documents";
      "pics"    = "cd ~/Pictures";
      "gh"      = "cd ~/Github";
      "dl"      = "cd ~/Downloads";
      "cfg"     = "cd ~/.config";
      "cfgags"  = "cd ~/Github/dotfiles/home-manager/services/ags/";
      
      # Nix
      rebuild = "sudo nixos-rebuild switch --flake .#astarion";
      re = "rebuild";
      ndev = "nix develop --command zsh";

      # Shortcut for terminal programs
      v = "nvim";
      nv = "nvim";

      # Git
      gst = "git status";
      gc = "git commit -m ";
    };
  };

}
