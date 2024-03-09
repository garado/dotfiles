
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger.js'

const createDebtWidget = (rData) => {
  const whoOwesYou = Widget.Label({
    class_name: 'debts-account',
    hpack: 'start',
    label: rData.account
  })
  
  // Parse total amount owed
  const amounts = rData.transactions.map(x => { return x.amount })
  let totalAmountOwed = 0
  amounts.forEach(n => totalAmountOwed += n);

  // Text saying either "you owe" or "you're owed"
  const oweText = Widget.Label({
    label: totalAmountOwed > 0 ? "you're owed" : 'you owe',
    class_name: totalAmountOwed > 0 ? 'owe-type greentext' : 'owe-type redtext',
  })
  
  const oweAmount = Widget.Label({
    hpack: 'end',
    class_name: totalAmountOwed > 0 ? 'debts-amount greentext' : 'debts-amount redtext',
    label: String(totalAmountOwed.toFixed(2))
  })

  // Creates a widget for every transaction
  // (If someone owes you $52 for X and $56 for Y,
  // this will create 2 widgets: one for X, one for Y)
  let transactionWidgets = []
  rData.transactions.forEach(x => {
    const desc = Widget.Label({
      class_name: 'desc',
      hpack: 'start',
      truncate: 'end',
      label: x.description,
    })
    
    const amount = Widget.Label({
      class_name: 'entry-amount',
      hpack: 'end',
      label: String(x.amount.toFixed(2)),
    })

    transactionWidgets.push(Widget.CenterBox({
      class_name: 'transaction',
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
        class_name: 'entry-top',
        hexpand: true,
        hpack: 'end',
        end_widget: oweText,
      }),
      Widget.CenterBox({
        class_name: 'entry-top',
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
    class_name: 'debts',
    vertical: true,
    spacing: 14,
    children: [ 
      Widget.Label({
        class_name: 'placeholder-text',
        label: 'Nothing to see here.'
      })
    ],
    setup: self => self.hook(LedgerService, (self, debtData) => {
      if (debtData === undefined) return;
      self.children = debtData.map(x => createDebtWidget(x))
    }, 'debts'),
})

export default () => {
  return Widget.Box({
    vertical: true,
    vexpand: true,
    hexpand: true,
    children: [
      Widget.Label({
        label: 'Debts',
        class_name: 'widget-header',
      }),
      debtBox(),
    ]
  })
}
