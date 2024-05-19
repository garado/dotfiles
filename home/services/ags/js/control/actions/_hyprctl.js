
// █░█ █▄█ █▀█ █▀█ █▀▀ ▀█▀ █░░
// █▀█ ░█░ █▀▀ █▀▄ █▄▄ ░█░ █▄▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const hyprland = await Service.import('hyprland')

// --------------------------------------

export default () => Widget.Box({
  hpack: 'start',
  spacing: 30,
  className: 'hyprctl',
  attribute: 'power', // icon
  vexpand: true,
  vertical: true,
  children: [
    // settings,
    // devices,
  ]
})
