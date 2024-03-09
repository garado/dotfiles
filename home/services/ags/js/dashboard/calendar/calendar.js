
// █▀▀ ▄▀█ █░░ █▀▀ █▄░█ █▀▄ ▄▀█ █▀█
// █▄▄ █▀█ █▄▄ ██▄ █░▀█ █▄▀ █▀█ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabFormat from '../../widgets/dash_tab_format.js'

import Week from './week/week.js'
import Schedule from './schedule/schedule.js'

export default () => Widget.Box({
  class_name: 'ledger',
  spacing: 12,
  children: [
    DashTabFormat(
      'Calendar',
      [ Week(), Schedule() ],
    )
  ]
})
