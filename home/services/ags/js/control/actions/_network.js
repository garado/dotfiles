
// █▄░█ █▀▀ ▀█▀ █░█░█ █▀█ █▀█ █▄▀
// █░▀█ ██▄ ░█░ ▀▄▀▄▀ █▄█ █▀▄ █░█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const nw = await Service.import('network')

// Current connection -------------------

const currentConnContent = Widget.Box({
  hexpand: true,
  children: [
    Widget.Label({
      label: nw.wifi.bind('ssid'),
      hpack: 'start',
    }),
    Widget.Label({
      label: nw.wifi.bind('internet'),
      hpack: 'end',
    }),
  ]
})

const currentConn = Widget.Box({
  vertical: true,
  spacing: 10,
  hexpand: true,
  children: [
    Widget.Label({
      label: 'Current connection',
      className: 'ctrl-header',
      hpack: 'start',
    }),
    currentConnContent,
  ]
})

// --------------------------------------

export default () => Widget.Box({
  hpack: 'start',
  spacing: 30,
  className: 'network',
  attribute: 'wifi', // icon
  vexpand: true,
  vertical: true,
  children: [
    currentConn,
  ]
})
