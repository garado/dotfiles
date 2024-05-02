
// ▀█▀ ▄▀█ █▀ █▄▀   █▀█ █░█ █▀▀ █▀█ █░█ █ █▀▀ █░█░█
// ░█░ █▀█ ▄█ █░█   █▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀ █ ██▄ ▀▄▀▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetContainer from '../../../widgets/dashWidgetContainer.js'

import Sidebar from './sidebar.js'
import TaskBox from './taskbox/taskbox.js'

export default () => Widget.Box({
  name: 'dashboard-tasks-overview',
  className: 'overview',
  vertical: false,
  hexpand: true,
  homogeneous: false,
  spacing: 12,
  children: [
    DashWidgetContainer(Sidebar()),
    TaskBox,
  ]
})
