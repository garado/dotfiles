

// █▀ █▀▀ █░█ █▀▀ █▀▄ █░█ █░░ █▀▀   █░█ █ █▀▀ █░█░█
// ▄█ █▄▄ █▀█ ██▄ █▄▀ █▄█ █▄▄ ██▄   ▀▄▀ █ ██▄ ▀▄▀▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
// import Webkit from 'gi://WebKit2'; ???

export default () => Widget.Box({
  class_name: 'ledger',
  attribute: { name: 'Schedule' },
  spacing: 12,
  children: [
    Widget.Label("Schedule view")
  ]
})
