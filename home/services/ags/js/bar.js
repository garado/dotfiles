
// █▄▄ ▄▀█ █▀█
// █▄█ █▀█ █▀▄

import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js'
const battery = await Service.import('battery')
 
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
  const batteryPercent = battery.bind('percent').as(p => `${p}`)
  const batteryCharging = battery.bind('charging')

  return Widget.Label({
    className: 'battery',
    label: batteryPercent,
    class_name: batteryCharging.value ? 'greentext' : ''
  })
}

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
  class_name: 'center',
  children: [Workspaces()]
})

const Bottom = Widget.Box({
  vpack: 'end',
  hpack: 'center',
  spacing: 4,
  class_name: 'right',
  vertical: true,
  children: [
    Battery(),
    Time(),
  ]
})

export default (monitor = 0) => Widget.Window({
  name: `bar-${monitor}`, // name has to be unique
  monitor,
  anchor: ['left', 'top', 'bottom'],
  vexpand: true,
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    vertical: true,
    hpack: 'center',
    class_name: 'bar',
    start_widget: Top,
    center_widget: Center,
    end_widget: Bottom,
  }),
});
