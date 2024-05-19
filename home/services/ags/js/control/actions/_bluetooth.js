
// █▄▄ █░░ █░█ █▀▀ ▀█▀ █▀█ █▀█ ▀█▀ █░█
// █▄█ █▄▄ █▄█ ██▄ ░█░ █▄█ █▄█ ░█░ █▀█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const bt = await Service.import('bluetooth')

// Settings widget -----------------------

const statusSwitch = Widget.Box({
  vertical: false,
  homogeneous: true,
  spacing: 20,
  children: [
    Widget.Label({
      label: 'Status',
      hpack: 'start',
    }),
    Widget.Switch({
      state: bt.enabled,
      onActivate: (self) => {
        bt.enabled = !self.state
      }
    })
  ],
})

const settings = Widget.Box({
  spacing: 10,
  vertical: true,
  children: [
    Widget.Label({
      label: 'Quick settings',
      className: 'ctrl-header',
      hpack: 'start',
    }),
    statusSwitch,
  ],
})

// Device list widget -----------------------

const deviceList = Widget.Box({
  vertical: true,
  homogeneous: true,
  spacing: 20,
  children: bt.bind('devices').as(d => d.map(d => {
    return Widget.Label(d.alias)
  }))
})

const devices = Widget.Box({
  vertical: true,
  spacing: 10,
  children: [ 
    Widget.Label({
      label: 'Devices',
      className: 'ctrl-header',
      hpack: 'start',
    }),
    deviceList,
  ]
})

// --------------------------------------

export default () => Widget.Box({
  hpack: 'start',
  spacing: 30,
  className: 'bluetooth',
  attribute: 'bluetooth', // icon
  vexpand: true,
  vertical: true,
  children: [
    settings,
    devices,
  ]
})
