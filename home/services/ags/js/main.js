
import App from 'resource:///com/github/Aylur/ags/app.js'
import Dashboard from './dashboard/dashboard.js'
import Bar from './bar.js'
import Control from './control/control.js'
import Kitty from './kitty.js'
import NotRofi from './notrofi/notrofi.js'
import { NotificationPopups } from './notifications.js'

const windows = [
  'dashboard',
  'control',
  'notrofi',
  'kitty',
]

App.config({
  style: '/tmp/ags/style.css',
  windows: [
    Bar(0),
    Control(),
    Dashboard(),
    NotRofi(),
    NotificationPopups(),
    Kitty(),
  ],

  // When opening a window, close all the other ones 
  onWindowToggled: function(windowName, visible) {
    if (windowName == 'control') {
      const ctrl = App.getWindow('control')
      ctrl.attribute.value = visible
    }

    if (visible) {
      const windowsToClose = windows.filter(function(x) { return x != windowName });
      windowsToClose.map((w) => { App.closeWindow(w) }) 
    }
  },

  closeWindowDelay: {
    'control': 250
  }
})
