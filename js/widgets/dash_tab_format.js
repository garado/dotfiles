import Widget from 'resource:///com/github/Aylur/ags/widget.js'

export default (name, pages, actions) => {
  const headerBar = Widget.CenterBox({
    hexpand: true,
    start_widget: Widget.Label({
      class_name: 'header',
      vpack: 'center',
      hpack: 'start',
      label: name,
    }),
    // end_widget:
  })

  const content = pages[0]

  return Widget.Box({
    class_name: 'dashtab',
    vertical: true,
    spacing: 12,
    children: [
      headerBar,
      content,
    ]
  })
}
