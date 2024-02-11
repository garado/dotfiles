import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

import HomeTab from './home/home.js'
import LedgerTab from './ledger/ledger.js'

// TODO organize this data more efficiently
const tab_contents = [
  HomeTab(),
  LedgerTab(),
]

const tab_icons = [
  // Utils.lookUpIcon('user-home-symbolic'),
  // Utils.lookUpIcon('face-plain-symbolic'),
  "1",
  "2",
]

const tab_indices = []
for (let i = 0; i < tab_contents.length; i ++) {
  tab_indices.push(i)
}

const Content = Widget.Box({
  class_name: 'tab-container',
  children: [ tab_contents[1] ],
})

const createNewTabBtn = (index = 0) => Widget.EventBox({
  class_name: 'tab-bar-entry',
  child: Widget.Label(tab_icons[index]),
  on_primary_click: function() {
    Content.remove(Content.children[0])
    Content.add(tab_contents[index])
  }
})

const Dash = Widget.Box({
  children: [
    Widget.Box({
      class_name: 'tab-bar',
      vertical: true,
      homogeneous: true,
      children: tab_indices.map(createNewTabBtn)
    }),
    Content,
  ],
})

export default () => Widget.Window({
  name: 'dashboard',
  class_name: 'dashboard',
  exclusivity: 'normal',
  layer: 'top',
  monitor: 0,
  child: Dash,
})
