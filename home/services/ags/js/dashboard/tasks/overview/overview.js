
// ▀█▀ ▄▀█ █▀ █▄▀   █▀█ █░█ █▀▀ █▀█ █░█ █ █▀▀ █░█░█
// ░█░ █▀█ ▄█ █░█   █▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀ █ ██▄ ▀▄▀▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import DashWidgetContainer from '../../../widgets/dashWidgetContainer.js'

import Sidebar from './_sidebar.js'
import TaskList from './tasklist/tasklist.js'
import Gtk from 'gi://Gtk?version=3.0';

const sbar = Sidebar()

const Overview = Widget.Box({
  name: 'dashboard-tasks-overview',
  className: 'overview',
  vertical: false,
  hexpand: true,
  homogeneous: false,
  spacing: 12,
  attribute: {},
  children: [
    DashWidgetContainer(sbar),
    TaskList,
  ]
})

/*******************************
 * KEYBINDS
 *******************************/

/* By default Tab and ShiftTab move to the next focusable item 
 * This focusArea overrides it so it moves to the next area */
const focusArea = [
  sbar.attribute.taglist,
  sbar.attribute.projectlist,
  TaskList,
]

let currentFocusAreaIndex = 0

const moveIndex = (dir) => {
  if (dir > 0) {
    currentFocusAreaIndex = (currentFocusAreaIndex + 1) % focusArea.length
  } else if (dir < 0) {
    currentFocusAreaIndex = (focusArea.length + (currentFocusAreaIndex - 1) % focusArea.length ) 
                              % focusArea.length 
  }
}

const keys = {
  'j': () => { Overview.emit("move-focus", 0) },
  'k': () => { Overview.emit("move-focus", 1) },
  'h': () => { sbar.attribute.taglist.emit("focus", 0) },
  'l': () => { TaskList.emit("focus", 0) },
  'Tab': () => {
    moveIndex(1)
    focusArea[currentFocusAreaIndex].emit("focus", 0)
  },
  'ShiftTab': () => {
    moveIndex(-1)
    focusArea[currentFocusAreaIndex].emit("focus", 0)
  },
}

Overview.attribute.keys = keys

export default Overview
