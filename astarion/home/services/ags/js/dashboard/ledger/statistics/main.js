
// █▀ ▀█▀ ▄▀█ ▀█▀ █ █▀ ▀█▀ █ █▀▀ █▀
// ▄█ ░█░ █▀█ ░█░ █ ▄█ ░█░ █ █▄▄ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger/ledger.js/'

import Graph from './_graph.js'
import StockBox from './_stockbox.js'

const GraphBox = Widget.Box({
  vertical: true,
  hexpand: true,
  children: [
    Widget.Label({
      xalign: 0,
      className: 'header',
      label: 'FIRE progress'
    }),
    Graph(),
  ]
})

export default () => Widget.Box({
  name: 'statistics',
  vertical: false,
  hexpand: true,
  className: 'statistics',
  children: [
    StockBox(),
    GraphBox,
  ]
})
