
# █▀▀ █▀█ █▄░█ ▀█▀ █▀
# █▀░ █▄█ █░▀█ ░█░ ▄█

{ pkgs, ... }: {
  fonts.packages = with pkgs; [
  (nerdfonts.override { fonts = [ "DroidSansMono" "NerdFontsSymbolsOnly"]; })
  ];
}
