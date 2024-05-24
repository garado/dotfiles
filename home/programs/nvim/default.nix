
# █▄░█ █▀▀ █▀█ █░█ █ █▀▄▀█
# █░▀█ ██▄ █▄█ ▀▄▀ █ █░▀░█

{ pkgs, config, fetchFromGitHub, ... }: {
  programs.neovim = {
    enable = true;

    # For TaskWiki
    withPython3 = true;
    extraPython3Packages = (ps: with ps; [
      pynvim
      tasklib
      six
      packaging
    ]);

  };

  # Install NvChad
  xdg.configFile."nvim".source = pkgs.stdenv.mkDerivation {
    name = "NvChad";

    src = pkgs.fetchFromGitHub {
      owner = "NvChad";
      repo = "NvChad";
      rev = "f17e83010f25784b58dea175c6480b3a8225a3e9";
      hash = "sha256-P5TRjg603/7kOVNFC8nXfyciNRLsIeFvKsoRCIwFP3I=";
    };

    # Copy custom NvChad config
    installPhase = ''
    mkdir -p $out
    cp -r ./* $out/
    cd $out/
    cp -r ${./nvchad-custom} $out/lua/custom
    '';
  };
}
