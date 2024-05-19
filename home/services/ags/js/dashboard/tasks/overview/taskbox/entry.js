
// █▀▀ █▄░█ ▀█▀ █▀█ █▄█
// ██▄ █░▀█ ░█░ █▀▄ ░█░

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import TaskService from '../../../../services/task.js'

const entry = Widget.Entry({
  hexpand: true,
  placeholderText: 'Add: ',
  onAccept: ({ text }) => {
    print(text)
  },
})

export default () => Widget.Box({
  className: 'entry',
  spacing: 12,
  hexpand: true,
  vertical: false,
  children: [
    entry
  ]
})
