
// █▀▄ ▄▀█ █▀ █░█ █▄▄ █▀█ ▄▀█ █▀█ █▀▄
// █▄▀ █▀█ ▄█ █▀█ █▄█ █▄█ █▀█ █▀▄ █▄▀

import App from 'resource:///com/github/Aylur/ags/app.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import DashService from './service.js'
import UserConfig from '../../userconfig.js'

import HomeTab from './home/home.js'
import LedgerTab from './ledger/ledger.js'
import CalendarTab from './calendar/calendar.js'
import TasksTab from './tasks/tasks.js'
import GoalsTab from './goals/goals.js'
import LifeTab from './life/life.js'

const tabData = [
  {
    content: HomeTab(),
    icon: "home",
    name: 'Home',
  },
  {
    content: LedgerTab(),
    icon: "dollar-sign",
    name: 'Ledger',
  },
  {
    content: CalendarTab(),
    icon: "calendar",
    name: 'Events',
  },
  {
    content: TasksTab(),
    icon: "check-square",
    name: 'Tasks',
  },
  {
    content: GoalsTab(),
    icon: "target",
    name: 'Goals',
  },
  {
    content: LifeTab(),
    icon: "watch",
    name: 'Life',
  },
]

DashService.numTabs = tabData.length

// Set up binds for each tab
for (let i = 0; i < tabData.length; i++) {
  if (tabData[i].content.attribute && tabData[i].content.attribute.keys) {
    DashService.addTabBinds(i, tabData[i].content.attribute.keys)
  }
}

const TabContent = Widget.Box({
  className: 'tab-container',
  children: [ tabData[0].content ]
})

const CreateTabBarEntry = tabIndex => {
  return Widget.EventBox({
    attribute: tabIndex,
        
    child: Widget.Icon({
      hpack: 'center',
      vpack: 'center',
      icon: tabData[tabIndex].icon,
      className: 'tab-bar-entry'
    }),

    on_primary_click: function() {
      DashService.active_tab_index = tabIndex
    },

    // BUG: Why does passing an argument not work?
    setup: self => self.hook(DashService, () => {
      if (DashService.active_tab_index === undefined) return
      self.toggleClassName('active', self.attribute == DashService.active_tab_index)
    }, 'active-tab-index-changed')
  })
}

const tabDataLength = Array.from({ length: tabData.length }, (_, i) => i)

const TabBar = Widget.CenterBox({
  className: 'tab-bar',
  vexpand: true,
  vpack: 'center',
  vertical: true,
  centerWidget: Widget.Box({
    vertical: true,
    children: tabDataLength.map(thisTabIndex => CreateTabBarEntry(thisTabIndex))
  })
})

DashService.connect('active_tab_index_changed', (self, value) => {
  TabContent.remove(TabContent.children[0])
  TabContent.children = [ tabData[value].content ]
})

export default () => Widget.Window({
  name: 'dashboard',
  className: 'dashboard',
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  keymode: 'exclusive',
  child: Widget.Box({
    children: [
      TabBar,
      TabContent,
    ]
  }),
})
  .on("key-press-event", DashService.handleKey)
  .hook(App, (self, windowName, visible) => {
    if (windowName == self.name) {
      DashService.dash_state = visible
    }
  }, 'window-toggled')
