
// █▄▀ █ ▀█▀ ▀█▀ █▄█   █▀ █▀▀ █▀ █▀ █ █▀█ █▄░█   █░░ ▄▀█ █░█ █▄░█ █▀▀ █░█ █▀▀ █▀█
// █░█ █ ░█░ ░█░ ░█░   ▄█ ██▄ ▄█ ▄█ █ █▄█ █░▀█   █▄▄ █▀█ █▄█ █░▀█ █▄▄ █▀█ ██▄ █▀▄

import App from 'resource:///com/github/Aylur/ags/app.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../userconfig.js'

log('program', 'Entering kitty.js')

function CreateSessionButton(session_name) {
  return Widget.Button({
    onClicked: () => {
      Utils.execAsync(`bash -c 'kitty --session ${UserConfig.kitty.sessions_path}/${session_name} & disown'`)
      App.closeWindow('kitty')
    },
    child: Widget.Label({
      className: 'text',
      label: session_name
    })
  })
}

const SessionList = Widget.Box({
  className: 'session-list',
  vertical: true,
  spacing: 12,
  setup(self) {
    const sessions = Utils.exec(`ls ${UserConfig.kitty.sessions_path}`).split('\n')
    sessions.map(s => { 
      const btn = CreateSessionButton(s) 
      self.add(btn)
    })
  },
})

const Kitty = Widget.Box({
  vertical: true,
  className: 'kitty',
  children: [
    Widget.Label({
      className: 'title',
      label: 'Launch Session'
    }),
    SessionList,
  ]
})

export default () => Widget.Window({
  name: 'kitty',
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  keymode: 'exclusive',
  child: Kitty,
})
