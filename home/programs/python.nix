
{ inputs, lib, config, pkgs, ... }: {
  (python3.withPackages (pkgs: with pkgs; [
    pynvim
    ueberzug
    tasklib
  ]))
}
