
/* █░░ █▀▀ █▀▄ █▀▀ █▀▀ █▀█ */
/* █▄▄ ██▄ █▄▀ █▄█ ██▄ █▀▄ */

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashTabLayout from '../../common/dashTabLayout.js'

import Overview from './overview/main.js'
import Statistics from './statistics/main.js'

export default () => {
  const layout = DashTabLayout({
    name: 'Ledger',
    pages: [
      Overview(),
      Statistics(),
    ],
  })

  /* Keybinds setup */
  const keys = {
    'H': () =>  { layout.iterTab(-1) },
    'L': () =>  { layout.iterTab(1) },
  }

  return Widget.Box({
    className: 'ledger',
    spacing: 12,
    children: [
      layout
    ],
    attribute: {
      keys: keys,
    }
  })
}
