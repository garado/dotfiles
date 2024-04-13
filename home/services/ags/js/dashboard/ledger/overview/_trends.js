
// ▀█▀ █▀█ █▀▀ █▄░█ █▀▄ █▀
// ░█░ █▀▄ ██▄ █░▀█ █▄▀ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from 'gi://Gdk';

import LedgerService from '../../../services/ledger/ledger.js/'
import SimpleGraph from '../../../widgets/simple-graph.js'

export default () => Widget.Box({
  className: 'yearly-balance',
  vertical: true,
  vexpand: false,
  spacing: 8,

  children: [
    Widget.Label({
      className: 'placeholder-text',
      label: "Couldn't render account growth graph.",
    }),
  ],

  setup: self => self.hook(LedgerService, (self, yearlyBalances) => {
    if (yearlyBalances === undefined) return

    self.children.forEach(x => self.remove(x))

    // Calculate percent increase/decrease
    const start = yearlyBalances[0]
    const end = yearlyBalances[yearlyBalances.length - 1]

    const upOrDown = start < end ? 'Up' : 'Down'
    const percent = Math.round(((end - start) / start) * 100)

    self.children = [
      SimpleGraph({
        grid: false,
        values: yearlyBalances,
        className: 'balance-graph',
      }),
      Widget.Label({
        className: 'percent-text',
        label: `${upOrDown} ${percent}% this year.`
      })
    ]

  }, 'yearly-balances-changed')
})
