
// ▀█▀ █▀█ ▄▀█ █▄░█ █▀ ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
// ░█░ █▀▄ █▀█ █░▀█ ▄█ █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█

// Displays the last n transactions.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger/ledger.js/'

/** 
 * @function createTransactionWidget
 * @param tdata */
const createTransactionWidget = (tdata) => {
  if (tdata == null) return;

  const iconAccount = tdata.isIncome ?
    tdata.sources[0].account : tdata.targets[0].account

  const icon = Widget.CenterBox({
    className: 'iconbox',
    center_widget: Widget.Icon({
      icon: LedgerService.tdataToIcon(tdata.description, iconAccount)
    })
  })

  const date = Widget.Label({
    className: 'date',
    hpack: 'start',
    label: tdata.date,
  })
  
  const desc = Widget.Label({
    className: 'description',
    hpack: 'start',
    label: tdata.description,
  })

  const amnt = Widget.Label({
    className: tdata.isIncome ? 'amount-green' : 'amount',
    hpack: 'end',
    label: `${tdata.isIncome ? '+' : ''}${tdata.amount.toFixed(2)}`
  })

  const start = Widget.Box({
    vertical: false,
    spacing: 18,
    children: [
      icon,
      Widget.Box({
        vertical: true,
        children: [ desc, date ],
      }),
    ],
  })
  
  const end = Widget.Box({
    vertical: true,
    children: [
      amnt,
    ],
  })

  return Widget.CenterBox({
    className: 'transaction',
    hexpand: true,
    start_widget: start,
    end_widget: end,
  })
}

const transactionWidget = () => Widget.Box({
  className: 'transactions',
  vexpand: true,
  hexpand: false,
  vertical: true,
  homogeneous: true,
  spacing: 14,
  children: [
    Widget.Label({
      className: 'placeholder-text',
      label: "No recent transactions found.",
    })
  ],

  setup: self => self.hook(LedgerService, (self, transactionData) => {
    if (transactionData === undefined) return;
    self.children.forEach(x => self.remove(x))
    self.children = transactionData.map(x => createTransactionWidget(x))
    // why doesnt this work???
    // transactionData.map(x => self.add(createTransactionWidget(x)))
  }, 'transactions-changed'),
})


export default () => {
  return Widget.Box({
    vertical: true,
    className: 'transactions',
    children: [
      Widget.Label({
        label: 'Recent Transactions',
        className: 'dash-widget-header',
      }),
      Widget.Scrollable({
        hscroll: 'never',
        vscroll: 'always',
        child: transactionWidget(),
      })
    ]
  })
}
