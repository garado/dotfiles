
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger.js'

const createDebtWidget = (rData) => {
  const accountTitle = Widget.Label({
    class_name: 'debts-account',
    hpack: 'start',
    label: rData.account
  })
  
  // Parse account total
  const amounts = rData.transactions.map(x => { return x.amount })
  let totalAmount = 0
  amounts.forEach(n => totalAmount += n);

  const total_owed = Widget.Box({
    vertical: true,
    class_name: totalAmount > 0 ? 'owes-you' : 'you-owe',
    children: [
      Widget.Label({
        label: totalAmount > 0 ? 'they owe' : 'you owe',
        hpack: 'end',
        class_name: 'owe-type',
      }),
      Widget.Label({
        class_name: 'debts-amount',
        hpack: 'end',
        label: String(totalAmount.toFixed(2))
      }),
    ]
  })

  let transactionWidgets = []
  rData.transactions.forEach(x => {
    const desc = Widget.Label({
      class_name: 'desc',
      hpack: 'start',
      label: x.description,
    })
    
    const amount = Widget.Label({
      class_name: 'amount',
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
    spacing: 6,
    children: [
      Widget.CenterBox({
        class_name: 'top',
        hexpand: true,
        start_widget: accountTitle,
        end_widget: total_owed,
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
    vexpand: true,
    hexpand: true,
    vertical: true,
    homogeneous: true,
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
    class_name: 'debts',
    children: [
      Widget.Label({
        label: 'Debts',
        class_name: 'ledger-header',
      }),
      debtBox(),
    ]
  })
}
