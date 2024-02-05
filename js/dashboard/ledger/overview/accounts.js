
// ▄▀█ █▀▀ █▀▀ █▀█ █░█ █▄░█ ▀█▀ █▀
// █▀█ █▄▄ █▄▄ █▄█ █▄█ █░▀█ ░█░ ▄█

// Shows balances for the accounts defined in user config.
// Also shows income and expenses for the current month.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger.js'

const createAccountWidget = (data) => {
  const name = Widget.Label({
    class_name: 'account-name',
    hpack: 'start',
    label: data.display_name,
  })
  
  const amount = Widget.Label({
    class_name: 'balance',
    hpack: 'start',
    label: data.balance,
  })
  
  return Widget.Box({
    class_name: 'account',
    vertical: true,
    hexpand: false,
    hpack: 'center',
    children: [
      name,
      Widget.Box(
        { vertical: false },
        Widget.Label({
          vpack: 'start',
          class_name: 'currency',
          label: data.currency,
        }),
        amount,
      ),
    ]
  })
}

export default () => {
  return Widget.Box({
    class_name: 'accounts',
    homogeneous: true,
    spacing: 4,
    setup: self => self.hook(LedgerService, (self, accountData) => {
      if (accountData == undefined) return;
      self.children = accountData.map(x => createAccountWidget(x))
    }, 'accounts-changed'),
  })
}
