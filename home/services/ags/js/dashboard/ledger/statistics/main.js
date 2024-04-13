
// █▀ ▀█▀ ▄▀█ ▀█▀ █ █▀ ▀█▀ █ █▀▀ █▀
// ▄█ ░█░ █▀█ ░█░ █ ▄█ ░█░ █ █▄▄ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger/ledger.js/'

import Graph from './_graph.js'

export default () => Widget.Box({
  className: 'statistics',
  attribute: { name: 'Statistics' },
  children: [
    Graph(),
  ]
})
