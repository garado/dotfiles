import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetBox from '../../../widgets/dashbox.js'

import Accounts from './accounts.js'
import Transactions from './transactions.js'

export default () => Widget.Box({
  vertical: true,
  children: [
    DashWidgetBox(Accounts()),
    DashWidgetBox(Transactions()),
  ]
})
