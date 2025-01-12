
// █▀ ▀█▀ ▄▀█ ▀█▀ █ █▀ ▀█▀ █ █▀▀ █▀
// ▄█ ░█░ █▀█ ░█░ █ ▄█ ░█░ █ █▄▄ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger/ledger.js/'

import Graph from './_graph.js'

const GraphBox = Widget.Box({
  vertical: true,
  hexpand: true,
  children: [
    Widget.Label({
      xalign: 0,
      className: 'header',
      label: 'Balance over time'
    }),
    Graph(),
  ]
})

export default () => Widget.Box({
  vertical: false,
  className: 'statistics',
  attribute: { name: 'Statistics' },
  children: [
    GraphBox
  ]
})
