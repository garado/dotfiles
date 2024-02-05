
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger.js'

const createReimbursementWidget = (rData) => {
  const accountTitle = Widget.Label({
    class_name: 'reimbursements-account',
    hpack: 'start',
    label: rData.account
  })
  
  // Parse account total
  const amounts = rData.transactions.map(x => { return x.amount })
  let totalAmount = 0
  amounts.forEach(n => totalAmount += n);
  
  const amount = Widget.Label({
    class_name: 'reimbursements-amount',
    hpack: 'end',
    label: String(totalAmount)
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
      label: String(x.amount),
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
        end_widget: amount,
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

export default () => {
  return Widget.Box({
    class_name: 'reimbursements',
    vexpand: true,
    hexpand: true,
    vertical: true,
    homogeneous: true,
    spacing: 14,
    setup: self => self.hook(LedgerService, (self, reimbursementData) => {
      if (reimbursementData === undefined) return;
      self.children = reimbursementData.map(x => createReimbursementWidget(x))
    }, 'reimbursements'),
  })
}
