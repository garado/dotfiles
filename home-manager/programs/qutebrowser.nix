
# █▀█ █░█ ▀█▀ █▀▀ █▄▄ █▀█ █▀█ █░█░█ █▀ █▀▀ █▀█
# ▀▀█ █▄█ ░█░ ██▄ █▄█ █▀▄ █▄█ ▀▄▀▄▀ ▄█ ██▄ █▀▄

{...}: {
  programs.qutebrowser = {
    enable = true;

    quickmarks = {
      ags = "https://aylur.github.io/ags-docs/";
      agsgh = "https://github.com/Aylur/ags";
      mail = "https://mail.google.com";
      gdev = "https://garado.dev/";
      quince = "https://www.quince.com/";
    };

    settings = {
      scrolling.smooth = true;
    };

    # Can't figure out how to set this correctly in settings{}
    extraConfig = ''
      c.url.searchengines = {
        'DEFAULT': 'https://google.com/search?hl=en&q={}',
        'aw': 'https://wiki.archlinux.org/?search={}',
        'nw': 'https://nixos.wiki/index.php?search={}',
        'np': 'https://search.nixos.org/packages?channel=23.11&from=0&size=50&sort=relevance&type=packages&query={}',
        'hm': 'https://mipmip.github.io/home-manager-option-search/?query={}',
        're': 'https://reddit.com/search?q={}',
        'yt': 'https://youtube.com/results?search_query={}',
        'gh': 'https://github.com/search?o=desc&q={}&s=stars',
        'm':  'https://www.google.com/maps/search/{}',
        'w':  'https://en.wikipedia.org/wiki/{}',
        'th': 'https://www.thingiverse.com/search?q={}&page=1'
      }
    '';
  };
}
