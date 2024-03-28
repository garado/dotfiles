
// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabFormat from '../../widgets/dash_tab_format.js'

import TaskService from '../../services/task.js'

import Overview from './overview/overview.js'

export default() => Widget.Box({
  className: 'tasks',
  spacing: 12,
  children: [
    DashTabFormat(
      'Taskwarrior',
      [ Overview() ],
    )
  ]
})
