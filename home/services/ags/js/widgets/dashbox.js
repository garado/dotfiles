import Widget from 'resource:///com/github/Aylur/ags/widget.js'

export default widget => Widget.CenterBox({
  class_name: 'widget-container',
  center_widget: Widget.Box({
    class_name: 'widget-container-padding',
    children: [widget],
  })
})
