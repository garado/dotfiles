
# █░█ █▄█ █▀█ █▀█ █░░ ▄▀█ █▄░█ █▀▄
# █▀█ ░█░ █▀▀ █▀▄ █▄▄ █▀█ █░▀█ █▄▀

{ inputs, lib, config, pkgs, ... }: {
  wayland.windowManager.hyprland = {
    enable = true;

    extraConfig = ''
    monitor="DP-11,1920x1080,0x0,1"; # Monitor
    monitor="eDP-1,preferred,0x1920,1,mirror,DP-11"; # Laptop screen
    '';

    settings = {
      # Execute at launch
      # exec-once = waybar & hyprpaper & firefox

      # Some default env vars
      env = "XCURSOR_SIZE,24";
      
      input = {
        kb_layout = "us";
        follow_mouse = 1;
        touchpad = {
          natural_scroll = "no";
        };
        sensitivity = 0;
      };
      
      general = {
        gaps_in = 5;
        gaps_out = 20;
        border_size = 2;
        "col.active_border" = "rgba(33ccffee) rgba(00ff99ee) 45deg";
        "col.inactive_border" = "rgba(595959aa)";
        layout = "dwindle";
      };
      
      decoration = {
        rounding = 10;
        drop_shadow = "yes";
        shadow_range = 4;
        shadow_render_power = 3;
        "col.shadow" = "rgba(1a1a1aee)";
      };
      
      animations = {
        enabled = "yes";

        bezier = "myBezier, 0.05, 0.9, 0.1, 1.05";

        animation = ''
          windows, 1, 7, myBezier
          windowsOut, 1, 7, default, popin 80%
          border, 1, 10, default
          borderangle, 1, 8, default
          fade, 1, 7, default
          workspaces, 1, 6, default
        '';
      };
      
      dwindle = {
        pseudotile = "yes";
        preserve_split = "yes";
      };
      
      master = {
        new_is_master = true;
      };
      
      gestures = {
        workspace_swipe = "off";
      };
      
      "device:epic-mouse-v1" = {
        sensitivity = -0.5;
      };
      
      "$mainMod" = "SUPER";

      bind = [
        # Launchers etc
        "$mainMod, RETURN, exec, kitty"
        "$mainMod, F, exec, qutebrowser"

        # Move focus
        "ALT_L, TAB, cyclenext"
        "ALT_L SHIFT, TAB, cyclenext, prev"
        "ALT_L, h, movefocus, l"
        "ALT_L, l, movefocus, r"
        "ALT_L, j, movefocus, u"
        "ALT_L, k, movefocus, d"

        # Switch workspaces
        "ALT_L, 1, workspace, 1"
        "ALT_L, 2, workspace, 2"
        "ALT_L, 3, workspace, 3"
        "ALT_L, 4, workspace, 4"
        "ALT_L, 5, workspace, 5"
        "ALT_L, 6, workspace, 6"
        "ALT_L, 7, workspace, 7"
        "ALT_L, 8, workspace, 8"
        "ALT_L, 9, workspace, 9"
        "ALT_L, 0, workspace, 10"

        # Move active window to a workspace with mainMod + SHIFT + [0-9]
        "ALT_L SHIFT, 1, movetoworkspace, 1"
        "ALT_L SHIFT, 2, movetoworkspace, 2"
        "ALT_L SHIFT, 3, movetoworkspace, 3"
        "ALT_L SHIFT, 4, movetoworkspace, 4"
        "ALT_L SHIFT, 5, movetoworkspace, 5"
        "ALT_L SHIFT, 6, movetoworkspace, 6"
        "ALT_L SHIFT, 7, movetoworkspace, 7"
        "ALT_L SHIFT, 8, movetoworkspace, 8"
        "ALT_L SHIFT, 9, movetoworkspace, 9"
        "ALT_L SHIFT, 0, movetoworkspace, 10"
     
        # Move/resize with kb
        "ALT_L CTRL, h, resizeactive, -40 0"
        "ALT_L CTRL, l, resizeactive, 40 0"
        "ALT_L CTRL, j, resizeactive, 0 40"
        "ALT_L CTRL, k, resizeactive, 0 -40"
        
        "ALT_L SHIFT, h, movewindow, l"
        "ALT_L SHIFT, l, movewindow, r"
        "ALT_L SHIFT, j, movewindow, u"
        "ALT_L SHIFT, k, movewindow, d"
      ];
      
      bindm = [
        # Move/resize windows with mainMod + LMB/RMB and dragging
        "$mainMod, mouse:272, movewindow"
        "$mainMod, mouse:273, resizewindow"
      ];

    };
  };
}

