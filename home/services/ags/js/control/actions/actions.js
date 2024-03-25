
// █▀█ █░█ █ █▀▀ █▄▀   ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
// ▀▀█ █▄█ █ █▄▄ █░█   █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█

// Initially shows only a grid of quick actions.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

import Audio from './_audio.js'
import Bluetooth from './_bluetooth.js'

const QuickActionContents = Widget.Box({
  css: 'padding: 1px',
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
    },
    child: Widget.Icon({
      className: 'qa-icon',
      icon: qa.attribute,
    })
  })
}

const Label = Widget.Label({
  className: 'header',
  hpack: 'start',
  label: 'Quick actions'
})

const QuickActionGrid = Widget.Box({
  name: 'quickActionsGrid',
  spacing: 20,
  className: 'grid',
  children: [
    CreateQuickAction(Bluetooth()),
    CreateQuickAction(Audio()),
  ]
})

export default () => Widget.Box({
  class_name: 'quick-actions',
  spacing: 20,
  vexpand: true,
  vertical: true,
  children: [
    Label,
    QuickActionGrid,
    QuickActionContents,
  ]
})
