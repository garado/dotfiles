import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import Overview from './overview/overview.js'

export default () => Widget.Box({
  class_name: 'ledger',
  spacing: 12,
  children: [Overview()]
})
