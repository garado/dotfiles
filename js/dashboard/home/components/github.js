import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const Splash = Widget.Label({
  class_name: 'splash',
  label: 'Mechromancer',
})

export default () => Widget.Box({
  spacing: 4,
  class_name: 'github',
  hexpand: true,
  vertical: true,
  children: [
    Widget.Label({
      class_name: 'header',
      label: '2358',
    }),
    Widget.Label({
      class_name: 'subheader',
      label: 'lifetime contributions',
    })
  ]
})
