
// █▀▄▀█ █▀█ █▄░█ █ ▀█▀ █▀█ █▀█
// █░▀░█ █▄█ █░▀█ █ ░█░ █▄█ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const hypr = await Service.import('hyprland')

// List of active monitors -------------------

const CreateMonitorWidget = (m) => {
  const icon = Widget.Button({
    child: Widget.Icon({
      icon: 'monitor'
    }),
    onClicked: () => {

    }
  })

  const name = Widget.Label({
    label: m.name,
    xalign: 0,
  })

  return Widget.Box({
    vertical: false,
    spacing: 12,
    className: 'monitor-list-item',
    children: [
      icon,
      name,
    ]
  })
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
