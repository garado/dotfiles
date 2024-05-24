
# █▀█ ▄▀█ █▀▀ █▄▀ ▄▀█ █▀▀ █▀▀ █▀
# █▀▀ █▀█ █▄▄ █░█ █▀█ █▄█ ██▄ ▄█

{ inputs, lib, config, pkgs, ... }: {
  imports = [
    ./nvim
    ./zsh
    ./kitty
    ./hyprland.nix
    ./qutebrowser.nix
    ./lf.nix
    ./wpaperd.nix
    ./taskwarrior.nix
    ./newsboat.nix
    ./gtk.nix
  ];
}
