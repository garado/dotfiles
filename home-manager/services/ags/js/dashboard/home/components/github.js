
// █▀▀ █ ▀█▀ █░█ █░█ █▄▄   █▀▀ █▀█ █▄░█ ▀█▀ █▀█ █ █▄▄ █▀
// █▄█ █ ░█░ █▀█ █▄█ █▄█   █▄▄ █▄█ █░▀█ ░█░ █▀▄ █ █▄█ ▄█

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Gtk from 'gi://Gtk?version=3.0'
import GithubService from '../../../services/github.js'

// Create one contrib square
const ContribBox = (intensity = 0) => Widget.DrawingArea({
  class_name: `intensity-${intensity}`,
  hpack: 'center',
  vpack: 'center',
  setup: (self) => {
    // Size
    const w = 10
    self.set_size_request(w, w)
      
    const styles = self.get_style_context();
    const fg = styles.get_background_color(Gtk.StateFlags.NORMAL);

    self.connect('draw', (_, cr) => {
      cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha)
      cr.rectangle(0, 0, w, w)
      cr.fill()
    })
  }
})

// Squares representing contrib amount
const Grid = Widget.subclass(Gtk.Grid)
const contribContainer = Grid({
  hexpand: true,
  vexpand: true,
  hpack: 'center',
  vpack: 'center',
  row_spacing: 2,
  column_spacing: 2,
  class_name: 'contrib-container',
  setup: self => self.hook(GithubService, (self, contribData) => {
    if (contribData === undefined) return

    const maxContribBoxes = 210

    const numRows = 7
    for (let i = 0; i < numRows; i++) {
      self.insert_row(i)
    }

    const numCols = Math.ceil(maxContribBoxes / numRows)
    for (let i = 0; i < numCols; i++) {
      self.insert_column(i)
    }

    const span = 1

    for (let i = 0; i < maxContribBoxes; i++) {
      const intensity = contribData[i].intensity;
      // const intensity = Math.floor((Math.random() * 4))
      self.attach(ContribBox(intensity), Math.floor(i / numRows), (i % numRows), span, span)
    }

    self.show_all()
  }, 'contrib-data-changed'),
})

const totalContribs = Widget.Label({
  class_name: 'header',
  label: '-',
  setup: self => self.hook(GithubService, (self, contribCount) => {
    if (contribCount == undefined) return
    self.label = String(contribCount)
  }, 'contrib-count-changed')
})

export default () => Widget.Box({
  class_name: 'github',
  hexpand: true,
  vertical: true,
  spacing: 2,
  children: [
    totalContribs,
    Widget.Label({
      class_name: 'subheader',
      label: 'total lifetime contributions',
    }),
    contribContainer,
  ]
})
