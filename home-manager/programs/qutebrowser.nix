
# █▀█ █░█ ▀█▀ █▀▀ █▄▄ █▀█ █▀█ █░█░█ █▀ █▀▀ █▀█
# ▀▀█ █▄█ ░█░ ██▄ █▄█ █▀▄ █▄█ ▀▄▀▄▀ ▄█ ██▄ █▀▄

{...}: {
  programs.qutebrowser = {
    enable = true;

    # aliases = {
    #   ":bind aa set-cmd-text -s :quickmark-add {url} {title}";
    # };

    # Note: If homemanager manages quickmarks, you can't edit at runtime
    # quickmarks = {
    # };

    settings = {
      scrolling.smooth = true;
    };

    # Can't figure out how to set this correctly with qutebrowser.settings
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
      }
    '';
  };
}
