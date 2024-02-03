import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import App from 'resource:///com/github/Aylur/ags/app.js'

import DashWidgetBox from '../../widgets/dashbox.js'
import Profile from './components/profile.js'
import Clock from './components/clock.js'
import Quote from './components/quote.js'
import Github from './components/github.js'

const Left = () => Widget.Box({
  spacing: 8,
  vertical: true,
  children: [
    DashWidgetBox(Profile()),
    DashWidgetBox(Clock()),
    DashWidgetBox(Quote()),
    DashWidgetBox(Github()),
  ]
})

export default () => Widget.Box({
  class_name: 'home',
  vertical: true,
  children: [
    Left(),
  ]
})
