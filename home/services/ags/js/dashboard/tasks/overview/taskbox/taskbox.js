
import Header from './header.js'
import List from './list.js'
import Entry from './entry.js'

export default Widget.Box({
  className: 'taskbox',
  vexpand: true,
  vertical: true,
  homogeneous: false,
  children: [
    Header(),
    List(),
    Entry(),
  ],
})

