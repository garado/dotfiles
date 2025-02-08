
// ▀█▀ █▀█ █▀▀ █▄░█ █▀▄ █▀
// ░█░ █▀▄ ██▄ █░▀█ █▄▀ ▄█

// Show graph of total account balance over time.

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from 'gi://Gdk';

import LedgerService from '../../../services/ledger/ledger.js/'
import FancyGraph from '../../../widgets/fancy-graph-2.js'

/* Animated line graph ---------------------------------- */

const LineGraph = () => Widget.Box({
  className: 'yearly-balance',
  vertical: true,
  vexpand: false,
  hexpand: false,
  spacing: 8,

  children: [
    Widget.Label({
      className: 'placeholder-text',
      label: "Couldn't render account growth graph.",
    }),
  ],

  setup: self => self.hook(LedgerService, (self, balancesOverTime) => {
    if (balancesOverTime === undefined) return

    self.children.forEach(x => self.remove(x))

    // Calculate percent increase/decrease
    const start = balancesOverTime[0]
    const end = balancesOverTime[balancesOverTime.length - 1]

    const upOrDown = start < end ? 'Up' : 'Down'
    const percent = Math.round(((end - start) / start) * 100)

    self.children = [
      FancyGraph({
        wRequest: 1000,
        hRequest: 500,
        grid: false,
        yIntersectLabel: true,
        graphs: [
          {
            name: 'Balance over time',
            values: balancesOverTime,
            calculateFit: true,
            className: 'balance',
            xIntersect: {
              enable: true,
              label: true,
              labelTransform: (x) => { return `${Math.round(x / 1000)}k` },
            },
          },
          {
            name: 'FIRE target',
            values: Array.from({ length: 365 * 21 }, (_, i) => i * 103.82),
            className: 'target',
            dashed: true,
            xIntersect: {
              enable: true,
              label: true,
              labelTransform: (x) => { return `${Math.round(x / 1000)}k` },
            },
          },
        ],

        className: 'fire-graph',
      }),
    ]
  }, 'yearly-balances-changed')
})

const GraphAnimationStack = () => Widget.Overlay({
  className: 'graph',
  child: Widget.Revealer({
    revealChild: false,
    transition: 'slide_right',
    transitionDuration: 1600,
    child: Widget.Box({
      className: 'animator',
      vexpand: false,
      hexpand: false,
      css: 'min-height: 500px; min-width: 1300px',
    }),
    // setup: self => self.poll(5000, () => {
    //   self.revealChild = !self.revealChild
    // }),
    setup: self => self.revealChild = !self.revealChild
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
