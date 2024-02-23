import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const Username = Widget.Label({
  class_name: 'username',
  label: 'Alexis G.',
})

const Picture = Widget.Box({
  class_name: 'pfp',
})

const Splash = Widget.Label({
  class_name: 'splash',
  label: 'Mechromancer',
})

export default () => Widget.Box({
  spacing: 6,
  class_name: 'profile',
  hexpand: true,
  vertical: true,
  children: [
    Picture,
    Username,
    Splash,
  ]
})
