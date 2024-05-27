
// █░█ █▀█ █▀▄▀█ █▀▀
// █▀█ █▄█ █░▀░█ ██▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

import DashWidgetContainer from '../../widgets/dashWidgetContainer.js'

import Profile from './_profile.js'
import Clock from './_clock.js'
import Quote from './_quote.js'
import Github from './_github.js'
//
import Agenda from './_agenda.js'
import Player from './_player.js'

import Rss from './_rss.js'

// import Weather from './_weather.js'

const Left = () => Widget.Box({
  className: 'left',
  spacing: 12,
  vertical: true,
  vexpand: false,
  children: [
    Profile(),
    Clock(),
    // Player(),
    DashWidgetContainer(Quote()),
  ]
})

const Center = () => Widget.Box({
  className: 'center',
  spacing: 12,
  vexpand: false,
  vertical: true,
  children: [
    DashWidgetContainer(Agenda()),
    Player(),
  ]
})

const Right = () => Widget.Box({
  className: 'right',
  spacing: 12,
  vexpand: false,
  vertical: true,
  children: [
    // DashWidgetContainer(Weather()),
    Rss(),
    DashWidgetContainer(Github()),
  ]
})

export default () => Widget.Box({
  className: 'home',
  vexpand: false,
  spacing: 12,
  children: [
    Left(),
    Center(),
    Right(),
  ],
})
