import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetBox from '../../../widgets/dashbox.js'

import Accounts from './accounts.js'
import Transactions from './transactions.js'
import Trends from './trends.js'
import Reimbursements from './reimbursements.js'

export default () => Widget.Box({
  vertical: true,
  hexpand: true,
  spacing: 12,
  children: [
    DashWidgetBox(Accounts()),
    Widget.Box({
      spacing: 12,
      vertical: false,
      children: [
        DashWidgetBox(Widget.Scrollable({
          hscroll: 'never',
          vscroll: 'always',
          child: Transactions()
        })),
        DashWidgetBox(Trends()),
        DashWidgetBox(Reimbursements()),
      ]
    }),
  ]
})
