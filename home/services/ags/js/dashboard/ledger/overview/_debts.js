
// █▀▄ █▀▀ █▄▄ ▀█▀ █▀   ▄▀█ █▄░█ █▀▄   █░░ █ ▄▀█ █▄▄ █ █░░ █ ▀█▀ █ █▀▀ █▀
// █▄▀ ██▄ █▄█ ░█░ ▄█   █▀█ █░▀█ █▄▀   █▄▄ █ █▀█ █▄█ █ █▄▄ █ ░█░ █ ██▄ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger/ledger.js/'

/**
 * Create widget for a single account
 */
const createDebtWidget = (data) => {
  const whoOwesYou = Widget.Label({
    className: 'debts-account',
    hpack: 'start',
    label: data.account,
  })
  
  // Parse total amount owed
  const amounts = data.transactions.map(x => { return x.amount })
  let totalAmountOwed = 0
  amounts.forEach(n => totalAmountOwed += n);

  // Text saying either "you owe" or "you're owed"
  const oweText = Widget.Label({
    label: totalAmountOwed > 0 ? "you're owed" : 'you owe',
    className: totalAmountOwed > 0 ? 'owe-type greentext' : 'owe-type redtext',
  })
  
  const oweAmount = Widget.Label({
    hpack: 'end',
    className: totalAmountOwed > 0 ? 'debts-amount greentext' : 'debts-amount redtext',
    label: String(totalAmountOwed.toFixed(2))
  })

  // Creates a widget for every transaction
  // (If someone owes you $52 for X and $56 for Y,
  // this will create 2 widgets: one for X, one for Y)
  let transactionWidgets = []
  data.transactions.forEach(x => {
    const desc = Widget.Label({
      className: 'desc',
      hpack: 'start',
      truncate: 'end',
      label: x.description,
    })
    
    const amount = Widget.Label({
      className: 'entry-amount',
      hpack: 'end',
      label: String(x.amount.toFixed(2)),
    })

    transactionWidgets.push(Widget.CenterBox({
      className: 'transaction',
      hexpand: true,
      start_widget: desc,
      end_widget: amount,
    }))
  });

  return Widget.Box({
    vertical: true,
    hexpand: true,
    spacing: 6,
    children: [
      Widget.CenterBox({
        className: 'entry-top',
        hexpand: true,
        hpack: 'end',
        end_widget: oweText,
      }),
      Widget.CenterBox({
        className: 'entry-top',
        hexpand: true,
        start_widget: whoOwesYou,
        end_widget: oweAmount,
      }),
      Widget.Box({
        hexpand: true,
        vertical: true,
        spacing: 6,
        children: transactionWidgets
      }),
    ]
  })
}

const debtBox = () => Widget.Box({
    hexpand: true,
    className: 'debts',
    vertical: true,
    spacing: 14,
    children: [ 
      Widget.Label({
        className: 'placeholder-text',
        label: 'Nothing to see here.'
      })
    ],
    setup: self => self.hook(LedgerService, (self, debtData) => {
      if (debtData === undefined) return
      self.children.forEach(e => self.remove(e));
      debtData.map(x => self.add(createDebtWidget(x)))
    }, 'debts'),
})

export default () => {
  return Widget.Box({
    vertical: true,
    vexpand: true,
    hexpand: true,
    children: [
      Widget.Label({
        label: 'Debts and Liabilities',
        className: 'dash-widget-header',
      }),
      Widget.Scrollable({
        hexpand: true,
        vexpand: true,
        css: 'min-width: 20rem;',
        hscroll: 'never',
        child: debtBox(),
      })
    ]
  })
}
