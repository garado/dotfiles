
# █░█ █▄█ █▀█ █▀█ █░░ ▄▀█ █▄░█ █▀▄
# █▀█ ░█░ █▀▀ █▀▄ █▄▄ █▀█ █░▀█ █▄▀

{ inputs, lib, config, pkgs, ... }: {
  wayland.windowManager.hyprland = {
    enable = true;

    # Start on startup
    systemd.enable = true;

    settings = {
      # Execute these programs at launch
      exec-once = [
        "ags --config /home/alexis/Github/dotfiles/astarion/home/services/ags/config.js"
        "swww-daemon"
        "swww img /home/alexis/Github/dotfiles/astarion/assets/walls/samori.jpg"
      ];

      misc = {
        disable_hyprland_logo = true;
        disable_splash_rendering = true;
      };

      # Some default env vars
      env = [
        "XCURSOR_SIZE,16"
        "WLR_NO_HARDWARE_CURSORS,1"
      ];

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
        gaps_out = 15;
        border_size = 2;
        "col.active_border"   = "rgba(7d6a4faa)";
        "col.inactive_border" = "rgba(141414aa)";
        layout = "dwindle";
      };
      
      decoration = {
        rounding = 10;

        shadow = {
          enabled = true;
          range = 10;
          render_power = 3;
          color = "rgba(1a1a1aee)";
        };
      };
      
      animations = {
        enabled = "yes";

        # NAME,ONOFF,SPEED,CURVE,STYLE
        animation = [
          "workspaces, 1, 2, default, slidevert"
          "windows, 1, 2, default, slide"
        ];
      };
      
      windowrule = [
        # Window layout
        "float, class:^(thunar)$"
        "float, class:^(pavucontrol)$"
        "float, class:^(mpv)$"
      ];

      monitor = [
        "eDP-1,preferred,0x1920,1,mirror,DP-11" # Laptop screen
        "eDP-1,preferred,0x1920,1,mirror,DP-12" # Laptop screen
      ];

      dwindle = {
        pseudotile = "yes";
        preserve_split = "yes";
      };
     
      gestures = {
        workspace_swipe = "on";
      };
      
      "$mainMod" = "SUPER";

      # Press and hold
      binde = [
        ", XF86MonBrightnessUp, exec, brightnessctl set 10+"
        ", XF86MonBrightnessDown, exec, brightnessctl set 10-"
        ", XF86AudioLowerVolume, exec, pamixer --decrease 10"
        ", XF86AudioRaiseVolume, exec, pamixer --increase 10"
      ];

      bind = [
        ", XF86AudioMute, exec, pamixer --toggle-mute"
        ", XF86AudioPrev, exec, playerctl previous"
        ", XF86AudioNext, exec, playerctl next"
        ", XF86AudioPlay, exec, playerctl play-pause"

        "CTRL SHIFT, w, killactive"

        # Launchers etc
        "$mainMod, RETURN, exec, kitty"
        "$mainMod, J, exec, ags -t dashboard"
        "$mainMod, H, exec, ags -t utility"
        "$mainMod, L, exec, ags -t control"
        "$mainMod, R, exec, ags -t notrofi"

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
        
        # Switch to next/previous workspace
        "$mainMod, TAB, workspace, +1"
        "$mainMod SHIFT, TAB, workspace, -1"

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
       
        # Move/resize with kb
        "ALT_L CTRL, h, resizeactive, -90 0"
        "ALT_L CTRL, l, resizeactive, 90 0"
        "ALT_L CTRL, j, resizeactive, 0 90"
        "ALT_L CTRL, k, resizeactive, 0 -90"
        
        "ALT_L SHIFT, h, movewindow, l"
        "ALT_L SHIFT, l, movewindow, r"
        "ALT_L SHIFT, j, movewindow, u"
        "ALT_L SHIFT, k, movewindow, d"

        # More resizing
        "$mainMod, f, fullscreen"
        "$mainMod, m, fullscreen, 1" # Maximize

        "$mainMod, v, togglefloating" # Floating
      ];
      
      bindm = [
        # Move/resize windows with mainMod + LMB/RMB and dragging
        "$mainMod, mouse:272, movewindow"
        "$mainMod, mouse:273, resizewindow"
      ];

    };
  };
}

