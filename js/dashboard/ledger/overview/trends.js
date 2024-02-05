
// ▀█▀ █▀█ █▀▀ █▄░█ █▀▄ █▀
// ░█░ █▀▄ ██▄ █░▀█ █▄▀ ▄█

// My shitty implementation of a graph widget

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';

import LedgerService from '../../../services/ledger.js'

const LineGraph = (self) => Widget.DrawingArea({
  class_name: 'balance-graph',
  setup: self => self.hook(LedgerService, (self, yearlyBalances) => {
    if (yearlyBalances == undefined) return;

    // TODO: These are hardcoded for now because idk how ags autosets
    // widget height and width
    const h = 200
    const w = 400
    self.set_size_request(h, w)

    const xMax = yearlyBalances.length
    const yMax = Math.max(...yearlyBalances)

    self.connect('draw', (_, cr) => {
      // Get color
      const styles = self.get_style_context();
      const fg = styles.get_color(Gtk.StateFlags.NORMAL);
      const bg = styles.get_background_color(Gtk.StateFlags.NORMAL);

      // Draw vertical lines
      cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha)
      for (let i = 0; i < yearlyBalances.length; i++) {
        const xScaled = (i / xMax) * w
        cr.moveTo(xScaled, 0)
        cr.lineTo(xScaled, h)
      }
      cr.stroke()

      // Draw graph
      const PADDING = 10
      cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha)
      cr.moveTo(0, h)
      for (let i = 0; i < yearlyBalances.length; i++) {
        // Normalize values to fit in widget
        const xScaled = ((i+1) / xMax) * w
        const yScaled = ((yearlyBalances[i] / yMax) * h) - PADDING

        cr.lineTo(xScaled, h - yScaled)
        cr.stroke()
        cr.moveTo(xScaled, h - yScaled)
      }
      cr.stroke()
    })
  }, 'yearly-balances-changed'),
});

export default () => Widget.Box({
  class_name: 'yearly-balance',
  vertical: true,
  spacing: 8,
  children: [
    Widget.Label({
      class_name: 'balance-header',
      label: 'Balance this year',
    }),
    LineGraph(),
  ]
})
