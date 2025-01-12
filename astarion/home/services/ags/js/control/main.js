
// █▀▀ █▀█ █▄░█ ▀█▀ █▀█ █▀█ █░░
// █▄▄ █▄█ █░▀█ ░█░ █▀▄ █▄█ █▄▄

// OLD SHITTY VERSION

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js'

import actions from './actions/actions.js'
// import Notifications from './notifications.js'

log('program', 'Entering control.js')

// Show hostname, os, wm
const SystemInfo = () => {
  // TODO: Don't block
  const hostname = Utils.exec('cat /etc/hostname')
  const os = Utils.exec("sh -c 'cat /etc/os-release | grep '^NAME=''")
              .replace("NAME=", "")
  const wm = Utils.exec("sh -c 'echo $XDG_CURRENT_DESKTOP'")
  
  const labels = Widget.Box({
    vertical: true,
    class_name: 'accent',
    children: [
      Widget.Label('host'),
      Widget.Label('os'),
      Widget.Label('wm'),
    ]
  })

  const vars = Widget.Box({
    vertical: true,
    children: [
      Widget.Label(hostname),
      Widget.Label(os),
      Widget.Label(wm),
    ]
  })

  return Widget.Box({
    vertical: false,
    vpack: 'center',
    spacing: 8,
    children: [
      labels,
      vars,
    ],
  })
}

const ProfileSystemInfo = () => {
  const Picture = Widget.Box({
    class_name: 'pfp',
    css: `background-image: url("${UserConfig.pfp}")`
  })

  return Widget.Box({
    hpack: 'center',
    vertical: true,
    spacing: 12,
    children: [
      Picture,
      SystemInfo(),
    ]
  })
}

const SystemStats = Widget.Box({
  vertical: true,
})

// Assemble all components
const Control = Widget.Box({
  class_name: 'control',
  vertical: true,
  spacing: 12,
  children: [
    ProfileSystemInfo(),
    SystemStats,
    actions(),
  ]
})

const revealerState = Variable(false)

export default () => Widget.Window({
  name: 'control',
  attribute: revealerState,
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  anchor: ['top', 'bottom', 'right'],
  keymode: 'exclusive',
  child: Widget.Box({
    className: 'control-wrapper',
    css: 'padding: 1px',
    child: Widget.Revealer({
      revealChild: revealerState.bind(),
      transitionDuration: 250,
      transition: 'slide_right',
      child: Control,
    })
  })
})
