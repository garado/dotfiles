
# █▄▀ █ ▀█▀ ▀█▀ █▄█
# █░█ █ ░█░ ░█░ ░█░

{ pkgs, ... }: {
  programs.kitty = {
    enable = true;

    font = {
      name = "DroidSansM Nerd Font";
      size = 14.0;
    };

    settings = {
      window_padding_width = 10;
    };

    extraConfig = ''
    enable_audio_bell no
    include current-theme.conf
    '';
  };
    
  # Symlink custom themes
  xdg.configFile."kitty/themes".source = ./themes;
  
  # Symlink sessions
  xdg.configFile."kitty/sessions".source = ./sessions;
}
