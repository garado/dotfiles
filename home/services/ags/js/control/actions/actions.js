
// █▀█ █░█ █ █▀▀ █▄▀   ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
// ▀▀█ █▄█ █ █▄▄ █░█   █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█

// Initially shows only a grid of quick actions.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js'

import Audio from './_audio.js'
import Bluetooth from './_bluetooth.js'
import Network from './_network.js'
import Hyprctl from './_hyprctl.js'
import Monitor from './_monitor.js'

const revealQAContents = Variable(false)

const QuickActionContents = Widget.Box({
  vertical: true,
})

/* Create a quick action button */
function CreateQuickAction(qa) {
  return Widget.Button({
    attribute: qa,
    onClicked: (self) => {
      if (QuickActionContents.children.length != 0) {
        QuickActionContents.remove( QuickActionContents.children[0] )
      }
      QuickActionContents.children = [ self.attribute ]
      revealQAContents.value = true
    },
    child: Widget.Icon({
      className: 'qa-icon',
      icon: qa.attribute,
    })
  })
}

const Label = Widget.Label({
  className: 'ctrl-header',
  hpack: 'start',
  label: 'Quick actions'
})

const QuickActionGrid = Widget.Box({
  name: 'quickActionsGrid',
  spacing: 20,
  className: 'grid',
  children: [
    CreateQuickAction(Monitor()),
    CreateQuickAction(Bluetooth()),
    CreateQuickAction(Audio()),
    CreateQuickAction(Network()),
    CreateQuickAction(Hyprctl()),
  ]
})

export default () => Widget.Box({
  class_name: 'quick-actions',
  spacing: 12,
  vexpand: true,
  vertical: true,
  children: [
    Label,
    QuickActionGrid,
    Widget.Box({ visible: true, vexpand: true, heightRequest: 400 },
    Widget.Revealer({
      revealChild: revealQAContents.bind(),
      transitionDuration: 100,
      transition: 'slide_down',
      child: QuickActionContents,
    })
    )
  ]
})
