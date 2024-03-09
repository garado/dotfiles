import App from 'resource:///com/github/Aylur/ags/app.js'
import Bar from './bar/bar.js'
import Dashboard from './dashboard/dashboard.js'
import Control from './control/control.js'
import NotRofi from './notrofi/notrofi.js'

const windows = [
  "dashboard",
  "control",
  "notrofi",
]

App.config({
  style: '/tmp/ags/style.css',
  windows: [
    Bar(0),
    Dashboard(),
    Control(),
    NotRofi(),
  ],

  // When opening a window, close all the other ones 
  onWindowToggled: function(windowName, visible) {
    if (visible) {
      const windowsToClose = windows.filter(function(x) { return x != windowName });
      windowsToClose.map((w) => { App.closeWindow(w) }) 
    }
  }

})
