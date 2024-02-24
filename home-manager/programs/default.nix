
# █▀█ ▄▀█ █▀▀ █▄▀ ▄▀█ █▀▀ █▀▀ █▀
# █▀▀ █▀█ █▄▄ █░█ █▀█ █▄█ ██▄ ▄█

{ inputs, lib, config, pkgs, ... }: {
  imports = [
    ./hyprland.nix
    ./nvim.nix
    ./kitty.nix
    ./qutebrowser.nix
    ./lf.nix
  ];
}
