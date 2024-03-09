
# █░█░█ █▀█ ▄▀█ █▀█ █▀▀ █▀█ █▀▄
# ▀▄▀▄▀ █▀▀ █▀█ █▀▀ ██▄ █▀▄ █▄▀

# Wallpaper daemon

{...}: {
  programs.wpaperd = {
    enable = true;

    settings = {
      eDP-1.path = "../assets/walls/mountain.jpg";
      DP-11.path = "../assets/walls/mountain.jpg";
    };
      
  };
  
  # Symlink wallpapers folder to ~/Pictures
  # xdg.configFile."kitty/themes".source = ./themes;
  home.file.".config/autostart/x.desktop".source =
    config.lib.file.mkOutOfStoreSymlink "/run/current-system/sw/share/applications/x.desktop";
};
