import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import App from 'resource:///com/github/Aylur/ags/app.js'

const Workspaces = () => Widget.Box({
  class_name: 'workspaces',
  children: Hyprland.bind('workspaces').transform(ws => {
    return ws.map(({ id }) => Widget.Button({
      on_clicked: () => Hyprland.sendMessage(`dispatch workspace ${id}`),
      child: Widget.Label(`${id}`),
      class_name: Hyprland.active.workspace.bind('id')
      .transform(i => `${i === id ? 'focused' : ''}`),
    }));
  }),
});

const date = Variable('', {
  poll: [1000, "date '+%d %b %H:%M'"],
})

const Datetime = () => Widget.Label({
  label: date.bind()
})

// ------------

const Left = () => Widget.Box({
  children: [Widget.Label('cozy-ags')]
})

const Center = () => Widget.Box({
  children: [Workspaces()]
})

const Right = () => Widget.Box({
  hpack: 'end',
  children: [Datetime()]
})

export default (monitor = 0) => Widget.Window({
  name: `bar-${monitor}`, // name has to be unique
  class_name: 'bar',
  monitor,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    start_widget: Left(),
    center_widget: Workspaces(),
    end_widget: Right(),
  }),
});
