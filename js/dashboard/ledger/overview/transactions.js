
// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█

// Displays the last n transactions.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger.js'

/* @param tdata */
const createTransactionWidget = (tdata) => {
  if (tdata == null) return;
      
  const icon = Widget.CenterBox({
    class_name: 'iconbox',
    center_widget: Widget.Label({
      hexpand: false,
      vexpand: false,
      class_name: 'icon',
      label: 'X',
    })
  })

  const date = Widget.Label({
    class_name: 'date',
    hpack: 'end',
    label: tdata.date,
  })
  
  const desc = Widget.Label({
    class_name: 'description',
    hpack: 'start',
    label: tdata.description,
  })

  const acct = Widget.Label({
    class_name: 'account',
    hpack: 'start',
    label: tdata.isIncome ? tdata.sources[0].account : tdata.targets[0].account,
  })

  const amnt = Widget.Label({
    class_name: tdata.isIncome ? 'amount-green' : 'amount',
    hpack: 'end',
    label: `${tdata.isIncome ? '+' : ''}${tdata.amount.toFixed(2)}`
  })

  const start = Widget.Box({
    vertical: false,
    spacing: 12,
    children: [
      icon,
      Widget.Box({
        vertical: true,
        children: [ desc, acct ],
      }),
    ],
  })
  
  const end = Widget.Box({
    vertical: true,
    children: [
      amnt,
      date,
    ],
  })

  return Widget.CenterBox({
    class_name: 'transaction',
    hexpand: true,
    start_widget: start,
    end_widget: end,
  })
}

const transactionWidget = () => Widget.Box({
  class_name: 'transactions',
  vexpand: true,
  hexpand: false,
  vertical: true,
  homogeneous: true,
  spacing: 14,
  setup: self => self.hook(LedgerService, (self, transactionData) => {
    if (transactionData == undefined) return;
    self.children = transactionData.map(x => createTransactionWidget(x))
  }, 'transactions-changed'),
})


export default () => {
  return Widget.Box({
    vertical: true,
    class_name: 'transactions',
    children: [
      Widget.Label({
        label: 'Transaction history',
        class_name: 'ledger-header',
      }),
      Widget.Scrollable({
        hscroll: 'never',
        vscroll: 'always',
        child: transactionWidget(),
      })
    ]
  })
}
