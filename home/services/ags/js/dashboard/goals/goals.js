
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

const FILTER_GROUP_SPACING = 8 // px

/**
 * Widget used to filter goals by certain fields
 */
const FilterButton = (text, propertyName) => Widget.ToggleButton({
  child: Widget.Label({
    label: text,
  }),
  active: GoalService.ui_settings[propertyName],
  setup: (self) => {
    self.className = self.active ? 'toggled' : ''
    GoalService.ui_settings[propertyName] = self.active
  },
  onToggled: (self) => { 
    self.className = self.active ? 'toggled' : ''
    GoalService.set_settings(propertyName, self.active)
  },
})

/**
 * Filter goals based on status (completed/pending/failed)
 */
const StatusFilter = Widget.Box({
  spacing: FILTER_GROUP_SPACING,
  vertical: false,
  children: [
    FilterButton('Completed', 'completed'),
    FilterButton('In progress', 'pending'),
    FilterButton('Failed', 'failed'),
  ],
})

/**
 * Filter goals based on development status
 * developed -> all fields are filled (namely due date, the reason 'why')
 */
const DevelopmentFilter = Widget.Box({
  spacing: FILTER_GROUP_SPACING,
  vertical: false,
  children: [
    FilterButton('Developed', 'developed'),
    FilterButton('In development', 'undeveloped'),
  ],
})

/**
 * Container for the above StatusFilter and DevelopmentFilter widgets
 */
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
 * Bar above main content
 */
const TopBar = Widget.CenterBox({
  startWidget: Widget.Label({
    className: 'header',
    hpack: 'start',
    label: 'Goals',
  }),
  endWidget: Filters,
})

/**
 * Main content
 */
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

/**
 * Animates the sidebar
 */
const SidebarReveal = Widget.Revealer({
  transitionDuration: 250,
  transition: 'slide_left',
  revealChild: false,
  hexpand: false,
  child: Sidebar,
})

/* Hide the sidebar when switching dashboard tabs */
SidebarReveal.hook(DashService, (self, tabIndex) => {
  if (tabIndex == undefined) return
  self.revealChild = false
  MainWidget.css = 'opacity: 1; transition: 0.1s all'
  GoalService.resetSidebarData()
}, 'active-tab-index-changed')

/* Toggle the sidebar on the 'request-sidebar' signal */
SidebarReveal.hook(GoalService, (self, state) => {
  if (state == undefined) return
  self.revealChild = state
  MainWidget.css = `opacity: ${state ? '0.8' : '1'}; transition: 0.2s all`
}, 'request-sidebar')

/**
 * Assemble the final UI
 * Note to self: 
 * If you want to put a revealer in an overlay,
 * you have to put the revealer in a box, and put the box in the overlay
 * otherwise it won't animate
 */
const Overview = () => Widget.Box({
  className: 'overview',
  vertical: true,
  children: [
    Widget.Overlay({
      child: MainWidget,
      passThrough: true,
      overlays: [
        Widget.Box({
          hpack: 'end',
          hexpand: false,
          children: [SidebarReveal]
        }),
      ],
    })
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
  'r': () => {
    GoalService.fetchGoals()
  },
  'h': () => {
    GoalService.followBreadcrumbs(-1)
  },
  'l': () => {
    GoalService.followBreadcrumbs(1)
  }
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
