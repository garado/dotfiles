import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import DashWidgetBox from '../../widgets/dashbox.js'
import Profile from './components/profile.js'
import Clock from './components/clock.js'
import Quote from './components/quote.js'
import Github from './components/github.js'

import Agenda from './components/agenda.js'
import Player from './components/player.js'

const Left = () => Widget.Box({
  class_name: 'left',
  spacing: 12,
  vertical: true,
  vexpand: true,
  children: [
    DashWidgetBox(Profile()),
    DashWidgetBox(Clock()),
    DashWidgetBox(Quote()),
    DashWidgetBox(Github()),
  ]
})

const Center = () => Widget.Box({
  class_name: 'center',
  spacing: 12,
  vexpand: true,
  vertical: true,
  children: [
    DashWidgetBox(Agenda()),
    Player(),
  ]
})

export default () => Widget.Box({
  class_name: 'home',
  spacing: 12,
  children: [
    Left(),
    Center(),
  ],
})
