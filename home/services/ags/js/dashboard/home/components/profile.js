import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import UserConfig from '../../../../userconfig.js'

const Username = Widget.Label({
  class_name: 'username',
  label: 'Alexis G.',
})

const Picture = Widget.Box({
  class_name: 'pfp',
  css: `background-image: url("${UserConfig.pfp}")`
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
