import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetBox from '../../../widgets/dashbox.js'

import Accounts from './accounts.js'
import Transactions from './transactions.js'
import Trends from './trends.js'
import Debts from './debts.js'

const RightBox = Widget.Box({
  vertical: true,
  homogeneous: false,
  spacing: 12,
  children: [
    DashWidgetBox(Debts()),
    DashWidgetBox(Trends()),
  ]
})

export default () => Widget.Box({
  vertical: true,
  hexpand: true,
  homogeneous: false,
  spacing: 12,
  children: [
    DashWidgetBox(Accounts()),
    Widget.Box({
      spacing: 12,
      vertical: false,
      vexpand: true,
      children: [
        DashWidgetBox(Transactions()),
        RightBox,
      ]
    }),
  ]
})
