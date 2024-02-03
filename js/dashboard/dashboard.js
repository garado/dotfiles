import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import HomeTab from './home/home.js'

const TabBar = () => Widget.Box({

})

const Dashboard = () => Widget.Box({
  children: [HomeTab()]
})

export default () => Widget.Window({
  name: 'dashboard',
  class_name: 'dashboard',
  exclusivity: 'normal',
  layer: 'top',
  monitor: 0,
  child: Dashboard()
})
