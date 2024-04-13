
// ▀█▀ █▀█ █▀▀ █▄░█ █▀▄ █▀
// ░█░ █▀▄ ██▄ █░▀█ █▄▀ ▄█

// Show graph of total account balance over time.

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from 'gi://Gdk';

import LedgerService from '../../../services/ledger/ledger.js/'
import FancyGraph from '../../../widgets/fancy-graph.js'

/* Animated line graph ---------------------------------- */

const LineGraph = () => Widget.Box({
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
      FancyGraph({
        w: 1400,
        h: 500,
        grid: false,
        values: yearlyBalances,
        className: 'balance-graph',
      }),
    ]
  }, 'yearly-balances-changed')
})

const GraphAnimationStack = () => Widget.Overlay({
  child: Widget.Revealer({
    revealChild: false,
    transition: 'slide_left',
    transitionDuration: 800,
    child: Widget.Box({
      className: 'animator',
      vexpand: false,
      hexpand: false,
      css: 'min-height: 500px; min-width: 1300px',
    }),
    setup: self => self.poll(1000, () => {
      self.revealChild = !self.revealChild
    })
  }),
  overlays: [
    LineGraph(),
  ] 
})

export default () => Widget.Box({
  className: 'graph',
  vertical: false,
  children: [
    GraphAnimationStack(),
  ]
})
