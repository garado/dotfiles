
// ▀█▀ ▄▀█ █▀ █▄▀   █▀█ █░█ █▀▀ █▀█ █░█ █ █▀▀ █░█░█
// ░█░ █▀█ ▄█ █░█   █▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀ █ ██▄ ▀▄▀▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetBox from '../../../widgets/dashbox.js'

import Sidebar from './sidebar.js'
// import TaskBox from './taskbox/taskbox.js'

export default () => Widget.Box({
  name: 'dashboard-tasks-overview',
  className: 'overview',
  vertical: false,
  hexpand: true,
  homogeneous: false,
  spacing: 12,
  children: [
    DashWidgetBox(Sidebar()),
    // TaskBox,
  ]
})
