
# █▀█ ▄▀█ █▀▀ █▄▀ ▄▀█ █▀▀ █▀▀ █▀
# █▀▀ █▀█ █▄▄ █░█ █▀█ █▄█ ██▄ ▄█

{ inputs, lib, config, pkgs, ... }: {
  imports = [
    ./nvim
    ./zsh
    ./hyprland.nix
    ./kitty.nix
    ./qutebrowser.nix
    ./lf.nix
  ];
}
