
import App from 'resource:///com/github/Aylur/ags/app.js'
import Dashboard from './dashboard/dashboard.js'
import Bar from './bar.js'
import Control from './control/main.js'
import Kitty from './kitty.js'
import NotRofi from './notrofi/notrofi.js'
import DashTaskMod from './dashboard/tasks/overview/_entryPopup.js'
import { NotificationPopups } from './notifications.js'

const windows = [
  'dashboard',
  'control',
  'notrofi',
  'kitty',
  'dash-taskmod',
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
    DashTaskMod(),
  ],

  // When opening a window, close all the other ones 
  onWindowToggled: function(windowName, visible) {
    if (windowName == 'control') {
      const ctrl = App.getWindow('control')
      ctrl.attribute.value = visible
    }

    if (windowName == 'dash-taskmod') return

    if (visible) {
      const windowsToClose = windows.filter(function(x) { return x != windowName });
      windowsToClose.map((w) => { App.closeWindow(w) }) 
    }
  },

  closeWindowDelay: {
    'control': 250,
  }
})
