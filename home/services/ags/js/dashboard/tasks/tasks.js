
// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabLayout from '../../widgets/dashTabLayout.js'

import TaskService from '../../services/task.js'

import Overview from './overview/overview.js'

export default() => Widget.Box({
  className: 'tasks',
  spacing: 12,
  children: [
    DashTabLayout({
      name: 'Taskwarrior',
      pages: [ Overview() ],
    })
  ]
})
