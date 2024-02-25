
{ pkgs, config, ... }: {
  programs.zsh.shellAliases = {
    # Basic shell commands
    c = "clear";
    lsa = "ls -la";
    
    # Quick navigation
    ".."   = "cd ..";
    "..."  = "cd ../..";
    "...." = "cd ../../..";
    desk = "cd ~/Desktop";
    dots = "cd ~/Github/dotfiles/";
    docs = "cd ~/Documents";
    pics = "cd ~/Pictures";
    gh   = "cd ~/Github";
    dl   = "cd ~/Downloads";
  
    cfg = "cd ~/.config";
    cfgags = "cd ~/Github/dotfiles/home-manager/services/ags/";
  
    # Quick edit
    # TODO Relative paths?
    edl = "nvim ~/Documents/Ledger/2024.ledger";
    edq = "nvim ~/Github/dotfiles/home-manager/programs/qutebrowser.nix";
    
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
}
