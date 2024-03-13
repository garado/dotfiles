import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetBox from '../../../widgets/dashbox.js'

import Accounts from './accounts.js'
import Transactions from './transactions.js'
import Trends from './trends.js'
import Debts from './debts.js'
import Budget from './budget.js'

const LeftBox = Widget.Box({
  vertical: true,
  homogeneous: false,
  spacing: 12,
  children: [
    Accounts(),
    DashWidgetBox(Debts()),
  ]
})

const CenterBox = Widget.Box({
  homogeneous: false,
  vertical: true,
  spacing: 12,
  children: [
    DashWidgetBox(Transactions()),
  ]
})
  
const RightBox = Widget.Box({
  vertical: true,
  homogeneous: false,
  spacing: 12,
  children: [
    DashWidgetBox(Budget()),
    DashWidgetBox(Trends()),
  ]
})

export default () => Widget.Box({
  vertical: false,
  hexpand: true,
  homogeneous: false,
  spacing: 12,
  children: [
    LeftBox,
    CenterBox,
    RightBox,
  ]
})
