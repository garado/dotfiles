
// █▀█ █░█ █▀▀ █▀█ █░█ █ █▀▀ █░█░█
// █▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀ █ ██▄ ▀▄▀▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import GoalService from '../../services/goals.js'
import DashService from '../service.js'

import Categories from './_categories.js'
import Sidebar from './_sidebar.js'
import Gdk from "gi://Gdk";

/****************************************************
 * FILTERS
 ****************************************************/

const FILTER_GROUP_SPACING = 8

const StatusButton = (text, propertyName, defaultState = true) => Widget.ToggleButton({
  child: Widget.Label({
    label: text,
  }),
  active: defaultState,
  setup: (self) => {
    self.className = self.active ? 'toggled' : ''
    GoalService.ui_settings[propertyName] = self.active
  },
  onToggled: (self) => { 
    self.className = self.active ? 'toggled' : ''
    GoalService.set_settings(propertyName, self.active)
  },
})

const StatusFilter = Widget.Box({
  spacing: FILTER_GROUP_SPACING,
  vertical: false,
  children: [
    StatusButton('Completed', 'completed', false),
    StatusButton('In progress', 'pending'),
    StatusButton('Failed', 'failed', false),
  ],
})

const DevelopmentFilter = Widget.Box({
  spacing: FILTER_GROUP_SPACING,
  vertical: false,
  children: [
    StatusButton('Developed', 'developed'),
    StatusButton('In development', 'undeveloped'),
  ],
})

const Filters = Widget.Box({
  className: 'filters',
  vertical: false,
  spacing: 12,
  hpack: 'end',
  children: [
    StatusFilter,
    Widget.Label('and'),
    DevelopmentFilter,
  ]
})

/**
 * Contents
 */
const TopBar = Widget.CenterBox({
  startWidget: Widget.Label({
    className: 'header',
    hpack: 'start',
    label: 'Goals',
  }),
  endWidget: Filters,
})

const MainWidget = Widget.Scrollable({
  className: 'main',
  hscroll: 'never',
  vscroll: 'always',
  overlayScrolling: false,
  child: Widget.Box({
    vertical: true,
    children: [
      TopBar,
      Categories(),
    ],
  })
})

const SidebarReveal = Widget.Revealer({
  transitionDuration: 250,
  transition: 'slide_left',
  revealChild: false,
  hexpand: false,
  child: Sidebar,
})

// Hide the sidebar when switching dashboard tabs
SidebarReveal.hook(DashService, (self, tabIndex) => {
  if (tabIndex == undefined) return
  self.revealChild = false
  MainWidget.css = 'opacity: 1; transition: 0.1s all'
  GoalService.resetSidebarData()
}, 'active-tab-index-changed')

SidebarReveal.hook(GoalService, (self, state) => {
  if (state == undefined) return
  self.revealChild = state
  MainWidget.css = `opacity: ${state ? '0.8' : '1'}; transition: 0.2s all`
}, 'request-sidebar')

const Contents = Widget.Overlay({
  child: MainWidget,
  passThrough: true,
  overlays: [
    Widget.Box({
      // Note to self: 
      // If you want to put a revealer in an overlay,
      // you have to put the revealer in a box, and put the box in the overlay
      // otherwise it won't animate
      hpack: 'end',
      hexpand: false,
      children: [SidebarReveal]
    }),
  ],
})

const Overview = () => Widget.Box({
  className: 'overview',
  vertical: true,
  children: [
    Contents,
  ]
})

/****************************************************
 * KEYBINDS
 ****************************************************/

const keys = {
  'Esc': () => { 
    GoalService.requestSidebar(false) 
    GoalService.resetSidebarData()
  },
}

/****************************************************
 * EXPORT
 ****************************************************/

export default () => Widget.Box({
  className: 'goals',
  spacing: 12,
  attribute: {
    keys: keys
  },
  children: [
    Overview()
  ]
})
