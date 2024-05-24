
# █▀▀ ▀█▀ █▄▀
# █▄█ ░█░ █░█

{pkgs, ...}: {
  gtk = {
    enable = true;

    cursorTheme = {
      package = pkgs.graphite-cursors;
      name = "graphite";
    };

  };
}
