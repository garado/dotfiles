import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabFormat from '../../widgets/dash_tab_format.js'

import Overview from './overview/overview.js'

export default () => Widget.Box({
  class_name: 'ledger',
  spacing: 12,
  children: [
    DashTabFormat(
      'Ledger',
      [ Overview() ],
    )
  ]
})
