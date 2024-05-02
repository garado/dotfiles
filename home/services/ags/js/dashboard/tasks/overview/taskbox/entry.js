

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import TaskService from '../../../../services/task.js'

const entry = Widget.Entry({
  hexpand: true,
  placeholderText: 'Enter shit here',
  onAccept: ({ text }) => print(text),
})

export default () => Widget.Box({
  className: 'tasklist-entry',
  spacing: 12,
  hexpand: true,
  vertical: false,
  children: [
    entry
  ]
})
