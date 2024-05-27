
import Header from './_header.js'
import List from './_list.js'
import Entry from './_entry.js'

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

