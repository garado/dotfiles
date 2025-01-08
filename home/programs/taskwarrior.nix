
# ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█
# ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄

{ pkgs, ... }: {
  programs.taskwarrior = {
    enable = true;
    
    package = pkgs.taskwarrior3;

    dataLocation = "/home/alexis/Enchiridion/self/todo/.taskwiki/";

    # User-defined attributes
    config = {
      # UDAs for goals
      "uda.why.type" = "string";
      "uda.why.label" = "why";

      # Set context to display goals
      "context.goals" = "tag:goals";
      "context.todo" = "tag:books or tag:personal or tag:misc or tag:desktop";
    };
  };
}
