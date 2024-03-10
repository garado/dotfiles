import App from 'resource:///com/github/Aylur/ags/app.js'
import Bar from './bar/bar.js'
import Dashboard from './dashboard/dashboard.js'
import Control from './control/control.js'
import Kitty from './kitty.js'
import NotRofi from './notrofi/notrofi.js'
import { NotificationPopups } from './notifications.js'

const windows = [
  "dashboard",
  "control",
  "notrofi",
  "kitty",
]

App.config({
  style: '/tmp/ags/style.css',
  windows: [
    Bar(0),
    Dashboard(),
    Control(),
    NotRofi(),
    NotificationPopups(),
    Kitty(),
  ],

  // When opening a window, close all the other ones 
  onWindowToggled: function(windowName, visible) {
    if (visible) {
      const windowsToClose = windows.filter(function(x) { return x != windowName });
      windowsToClose.map((w) => { App.closeWindow(w) }) 
    }
  }

})

Utils.timeout(100, () => Utils.notify({
  summary: "Notification Popup Example",
  body: "Lorem ipsum dolor sit amet, qui minim labore adipisicing "
  + "minim sint cillum sint consectetur cupidatat.",
  actions: {
    "Cool": () => print("pressed Cool"),
  },
}))

