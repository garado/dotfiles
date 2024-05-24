
# ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█
# ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄

{...}: {
  programs.taskwarrior = {
    enable = true;

    dataLocation = "/home/alexis/Enchiridion/todo/.taskwiki/";

    # User-defined attributes
    config = {
      # UDAs for goals
      "uda.imgpath.type" = "string";
      "uda.imgpath.label" = "imagepath";

      "uda.why.type" = "string";
      "uda.why.label" = "why";
    };
  };
}
