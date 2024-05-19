
// ▄▀█ █▀▀ █▀▀ █▀█ █░█ █▄░█ ▀█▀ █▀
// █▀█ █▄▄ █▄▄ █▄█ █▄█ █░▀█ ░█░ ▄█

// Shows balances for the accounts defined in user config.
// Also shows net worth and monthly income/expenses.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger/ledger.js/'

const createAccountWidget = (data) => {
  const name = Widget.Label({
    className: 'account-name',
    hpack: 'start',
    label: data.displayName.toUpperCase(),
  })
  
  const amount = Widget.Label({
    className: 'balance',
    hpack: 'start',
    label: String(data.balance.toFixed(2)),
  })
  
  return Widget.Box({
    className: 'account',
    vertical: true,
    hexpand: false,
    hpack: 'start',
    vpack: 'center',
    children: [
      amount,
      name,
    ]
  })
}

const netWorth = () => Widget.Box({
  setup: self => self.hook(LedgerService, (self, netWorth) => {
    if (netWorth == undefined) return;
    self.children.forEach(x => self.remove(x))

    const data = {
      displayName: 'Net Worth',
      balance: netWorth,
    }

    self.add(createAccountWidget(data))
  }, 'net-worth-changed'),
})

const income = () => Widget.Box({
  setup: self => self.hook(LedgerService, (self, income) => {
    if (income == undefined) return;
    self.children.forEach(x => self.remove(x))

    const data = {
      displayName: 'Income This Month',
      balance: income,
    }

    self.add(createAccountWidget(data))
  }, 'monthly-income-changed'),
})

const expenses = () => Widget.Box({
  setup: self => self.hook(LedgerService, (self, expenses) => {
    if (expenses == undefined) return;
    self.children.forEach(x => self.remove(x))

    const data = {
      displayName: 'Expenses This Month',
      balance: expenses,
    }

    self.add(createAccountWidget(data))
  }, 'monthly-expenses-changed'),
})

const userDefinedAccounts = () => Widget.Box({
  vertical: true,
  spacing: 20,
  setup: self => self.hook(LedgerService, (self, accountData) => {
    if (accountData == undefined) return;
    self.children.forEach(x => self.remove(x))
    accountData.map(x => self.add(createAccountWidget(x)) )
  }, 'accounts-changed'),
})

export default () => {
  return Widget.Box({
    className: 'accounts',
    spacing: 20,
    vertical: true,
    children: [
      netWorth(),
      income(),
      expenses(),
      userDefinedAccounts(),
    ]
  })
}
