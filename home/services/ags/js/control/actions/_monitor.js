
// █▀▄▀█ █▀█ █▄░█ █ ▀█▀ █▀█ █▀█
// █░▀░█ █▄█ █░▀█ █ ░█░ █▄█ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const hypr = await Service.import('hyprland')

// List of active monitors -------------------

// const currentConnContent = Widget.Box({
//   hexpand: true,
//   children: [
//     Widget.Label({
//       label: nw.wifi.bind('ssid'),
//       hpack: 'start',
//     }),
//     Widget.Label({
//       label: nw.wifi.bind('internet'),
//       hpack: 'end',
//     }),
//   ]
// })
//

const CreateMonitorWidget = (m) => {
  const mon = Widget.Label({
    className: 'monitor-list-item',
    label: m.name,
    xalign: 0,
  })

  return mon
}

const monitorListContent = Widget.Box({
  vertical: true,
  children: hypr.bind('monitors').as(m => m.map(CreateMonitorWidget))
})


const monitorList = Widget.Box({
  vertical: true,
  spacing: 10,
  hexpand: true,
  children: [
    Widget.Label({
      label: 'Monitor settings',
      className: 'ctrl-header',
      hpack: 'start',
    }),
    monitorListContent,
  ]
})

// --------------------------------------

export default () => Widget.Box({
  hpack: 'start',
  spacing: 30,
  className: 'monitor',
  attribute: 'monitor', // icon
  vexpand: true,
  vertical: true,
  children: [
    monitorList,
  ]
})
