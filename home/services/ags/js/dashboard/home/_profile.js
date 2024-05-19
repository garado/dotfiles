import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import UserConfig from '../../../../userconfig.js'

const Username = Widget.Label({
  className: 'username',
  label: 'Alexis G.',
})

const Picture = Widget.Box({
  className: 'pfp',
  hexpand: false,
  vexpand: false,
  css: `background-image: url("${UserConfig.pfp}")`
})

const FakeBar = Widget.CircularProgress({
  className: 'pbar',
  rounded: false,
  value: 1,
  child: Widget.Box({
    hpack: 'center',
    vpack: 'center',
    children: [ Picture ]
  }),
})

const Splash = Widget.Label({
  className: 'splash',
  label: 'Mechromancer',
})

export default () => Widget.Box({
  spacing: 6,
  className: 'profile',
  hexpand: true,
  vertical: true,
  children: [
    // Widget.Box({
    //   hpack: 'center',
    //   vpack: 'center',
    //   children: [ FakeBar ],
    // }),
    FakeBar,
    Username,
    Splash,
  ]
})
