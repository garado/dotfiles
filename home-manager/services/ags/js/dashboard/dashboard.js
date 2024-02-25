
// █▀▄ ▄▀█ █▀ █░█ █▄▄ █▀█ ▄▀█ █▀█ █▀▄
// █▄▀ █▀█ ▄█ █▀█ █▄█ █▄█ █▀█ █▀▄ █▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Variable from 'resource:///com/github/Aylur/ags/variable.js'

import HomeTab from './home/home.js'
import LedgerTab from './ledger/ledger.js'

const activeTabIndex = Variable(0)

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
  children: tabDataLength.map(thisTabIndex => Widget.EventBox({
    class_name: activeTabIndex.bind('value').as(activeIndex => 
      `${thisTabIndex === activeIndex ? 'active-tab-bar-entry' : ''}`),

    child: Widget.Icon({
      icon: tabData[thisTabIndex].icon,
      class_name: 'tab-bar-icon'
    }),

    on_primary_click: function() {
      activeTabIndex.value = thisTabIndex
    }
  }))
})

activeTabIndex.connect('changed', ({ value }) => {
  TabContent.remove(TabContent.children[0])
  TabContent.children = [ tabData[value].content ]
})

const Dash = Widget.Box({
  children: [
    TabBar,
    TabContent,
  ],
})

export default () => Widget.Window({
  name: 'dashboard',
  class_name: 'dashboard',
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  keymode: 'exclusive',
  child: Dash,
})
