import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js'

function Workspaces() {
  const workspaces = Hyprland.bind('workspaces');
  const activeId = Hyprland.active.workspace.bind('id');
  return Widget.Box({
    class_name: 'workspaces',
    children: workspaces.as(ws => ws.map(({ id }) => Widget.EventBox ({
      on_clicked: () => Hyprland.messageAsync(`dispatch workspace ${id}`),
      child: Widget.Label(`${id}`),
      class_name: activeId.as(i => `${i === id ? 'focused' : ''}`),
    }))),
  });
}

const date = Variable('', {
  poll: [1000, "date '+%H:%M'"],
})

const Datetime = Widget.Label({
  label: date.bind()
})

// ------------

const Left = Widget.Box({
  class_name: 'left',
  children: [
    Widget.Icon({icon: 'nix'})
  ]
})

const Center = Widget.Box({
  class_name: 'center',
  children: [Workspaces()]
})

const Right = Widget.Box({
  hpack: 'end',
  class_name: 'right',
  children: [Datetime]
})

export default (monitor = 0) => Widget.Window({
  name: `bar-${monitor}`, // name has to be unique
  monitor,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    class_name: 'bar',
    start_widget: Left,
    center_widget: Center,
    end_widget: Right,
  }),
});
