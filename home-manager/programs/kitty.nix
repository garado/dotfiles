
# █▄▀ █ ▀█▀ ▀█▀ █▄█
# █░█ █ ░█░ ░█░ ░█░

{ pkgs, ... }: {
  programs.kitty = {
    enable = true;

    # TODO Set with a file somewhere?
    theme = "Nord";

    font = {
      name = "DroidSansM Nerd Font";
      size = 9.0;
    };

    settings = {
      window_padding_width = 10;
    };

    extraConfig = ''
    enable_audio_bell no
    '';

  };
}
