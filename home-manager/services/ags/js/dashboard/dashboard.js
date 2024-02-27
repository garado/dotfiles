
// █▀▄ ▄▀█ █▀ █░█ █▄▄ █▀█ ▄▀█ █▀█ █▀▄
// █▄▀ █▀█ ▄█ █▀█ █▄█ █▄█ █▀█ █▀▄ █▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import HomeTab from './home/home.js'
import LedgerTab from './ledger/ledger.js'
import DashService from './service.js'

const tabData = [
  {
    content: HomeTab(),
    icon: "home",
  },
  {
    content: LedgerTab(),
    icon: "dollar-sign",
  },
]

const tabDataLength = Array.from({ length: tabData.length }, (_, i) => i)

const TabContent = Widget.Box({
  class_name: 'tab-container',
  children: [ tabData[0].content ]
})

const TabBar = Widget.Box({
  class_name: 'tab-bar',
  vertical: true,
  homogeneous: true,

  // Create a tab bar entry for every tab defined in tabData
  children: tabDataLength.map(thisTabIndex => Widget.EventBox({
    child: Widget.Icon({
      icon: tabData[thisTabIndex].icon,
      class_name: 'tab-bar-icon'
    }),

    on_primary_click: function() {
      DashService.active_tab_index = thisTabIndex
    },

    // TODO: Not working
    class_name: DashService
      .bind('active_tab_index')
      .as(activeIndex => 
      `${thisTabIndex == activeIndex ? 'active-tab-bar-entry' : ''}`),
  }))
})

DashService.connect('active_tab_index_changed', (self, value) => {
  TabContent.remove(TabContent.children[0])
  TabContent.children = [ tabData[value].content ]
})

export default () => Widget.Window({
  name: 'dashboard',
  class_name: 'dashboard',
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
}).on("key-press-event", DashService.handleKey)
