
// █░░ █▀▀ █▀▄ █▀▀ █▀▀ █▀█
// █▄▄ ██▄ █▄▀ █▄█ ██▄ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabLayout from '../../widgets/dashTabLayout.js'

import Overview from './overview/main.js'
import Statistics from './statistics/main.js'

export default () => Widget.Box({
  class_name: 'ledger',
  spacing: 12,
  children: [
    DashTabLayout({
      name: 'Ledger',
      pages: [ Overview(), Statistics() ],
    })
  ]
})
