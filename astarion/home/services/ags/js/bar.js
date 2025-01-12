
// █▄▄ ▄▀█ █▀█
// █▄█ █▀█ █▀▄

import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js'
const battery = await Service.import('battery')

log('program', 'Entering bar.js')

function Workspaces() {
  const activeId = Hyprland.active.workspace.bind('id');
  const array = Array.from({length: 9}, (_, i) => i + 1)

  return Widget.Box({
    vertical: true,
    spacing: 8,
    hpack: 'center',
    className: 'workspaces',
    children: array.map(i => Widget.EventBox({
      onClicked: () => Hyprland.messageAsync(`dispatch workspaces ${i}`),
      child: Widget.Label(`${i}`),
      attribute: i,

      // classNames doesn't seem to play well with reactive elements, 
      // so I have to chain binds
      setup: self => self
        // Apply 'not-empty' class if this workspace has clients
        .bind('prop', Hyprland, 'workspaces', ws => {
          const notEmpty = ws.find(x => x.name == self.attribute)
          self.toggleClassName('not-empty', notEmpty != undefined)
        })

        // Apply 'focused' class if this is the active workspace
        .bind('prop', Hyprland.active.workspace, 'id', id => {
          self.toggleClassName('focused', id === self.attribute)
        })
    }))
  });
}

const Time = () => {
  const hour = Variable('', {
    poll: [1000, "date '+%H'"],
  })

  const min = Variable('', {
    poll: [1000, "date '+%M'"],
  })

  return Widget.Box({
    vertical: true,
    className: 'time',
    children: [
      Widget.Label({ label: hour.bind() }),
      Widget.Label({ label: min.bind() }),
    ]
  })
}

const Battery = () => {
  const batteryPercent = battery.bind('percent').as(p => `${Math.round(p)}`)
  const batteryCharging = battery.bind('charging')

  return Widget.Label({
    className: 'battery',
    label: batteryPercent,
    className: batteryCharging.value ? 'greentext' : ''
  })
}

// @TODO Find a way to do this without polling
const capsLockListen = Variable('1', {
  /* To check caps lock status, this checks the status of the Caps Lock key backlight */
  poll: [300, 'bash -c "brightnessctl -d input0::capslock g"'],
})

const CapsLock = () => Widget.Icon({
  visible: capsLockListen.bind().as(value => (value.trim() == '1') ? true : false),
  icon: 'chevrons-up',
  halign: 'center',
  valign: 'center',
})

// ------------

const Top = Widget.Box({
  vpack: 'start',
  hpack: 'center',
  className: 'top',
  children: [
    Widget.Icon({icon: 'nix'})
  ]
})

const Center = Widget.Box({
  vpack: 'center',
  hpack: 'center',
  className: 'center',
  children: [Workspaces()]
})

const Bottom = Widget.Box({
  vpack: 'end',
  hpack: 'center',
  spacing: 10,
  className: 'right',
  vertical: true,
  children: [
    CapsLock(),
    Battery(),
    Time(),
  ]
})

export default (monitor = 0) => Widget.Window({
  name: `bar-${monitor}`,
  monitor,
  anchor: ['left', 'top', 'bottom'],
  hexpand: true,
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    vertical: true,
    hpack: 'center',
    className: 'bar',
    startWidget: Top,
    centerWidget: Center,
    endWidget: Bottom,
  }),
});
