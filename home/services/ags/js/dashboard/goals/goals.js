
// █▀▀ █▀█ ▄▀█ █░░ █▀
// █▄█ █▄█ █▀█ █▄▄ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabLayout from '../../widgets/dashTabLayout.js'

import Overview from './overview/overview.js'

export default () => Widget.Box({
  className: 'goals',
  spacing: 12,
  children: [
    Overview()
  ]
})
