
// █▀█ █░█ █ █▀▀ █▄▀   ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
// ▀▀█ █▄█ █ █▄▄ █░█   █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../../userconfig.js'

const Label = Widget.Label({
  label: 'Quick Actions'
})

function CreateQuickAction(qa) {
  return Widget.EventBox({
    className: 'qa-button',
    onPrimaryClick: qa.function,
    child: Widget.Icon({
      className: 'qa-icon',
      icon: qa.icon
    })
  })
}

const QuickActionGrid = () => {
  const Grid = Widget.Box({
    name: 'quickActionsGrid',
    class_name: 'grid',
    hpack: 'center',
  })

  for (let i = 0; i < UserConfig.quick_actions.length; i++) {
    const qa = UserConfig.quick_actions[i];
    Grid.add(CreateQuickAction(qa))
  }

  return Grid
}


export default () => Widget.Box({
  class_name: 'quickActions',
  hpack: 'center',
  vertical: true,
  children: [
    Label,
    QuickActionGrid(),
  ]
})
