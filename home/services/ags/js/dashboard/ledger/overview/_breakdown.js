
// █▄▄ █▀█ █▀▀ ▄▀█ █▄▀ █▀▄ █▀█ █░█░█ █▄░█
// █▄█ █▀▄ ██▄ █▀█ █░█ █▄▀ █▄█ ▀▄▀▄▀ █░▀█

import Gtk from 'gi://Gtk?version=3.0';
import LedgerService from '../../../services/ledger/ledger.js/'
import PieChart from '../../../widgets/piechart.js'

/**
 * Draw a simple dot with Cairo.
 * Used for the Legend.
 */
const dot = (className) => Widget.DrawingArea({
  className: className ? className : '',
  hpack: 'center',
  vpack: 'center',
  setup: (self) => {
    const w = 14

    self.set_size_request(w, w)

    self.connect('draw', (_, cr) => {
      const styles = self.get_style_context();
      const fg = styles.get_color(Gtk.StateFlags.NORMAL);
      cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha)

      // Draw a dot
      const center = w / 2
      const rad = w / 3 
      const angle1 = 0
      const angle2 = 2 * Math.PI

      // It's slightly off-center (vertically) so offset yc by 1
      cr.arc(center, center + 1, rad, angle1, angle2)

      cr.fill()
      cr.stroke()
    })
  }
})

const Legend = (entries) => {
  const createEntry = (entry, index) => Widget.Box({
    vpack: 'center',
    spacing: 4,
    vertical: false,
    children: [
      dot(`pie-slice-${index+1}`),
      Widget.Box({
        vertical: false,
        children: [
          Widget.Label({
            label: entry.account 
          }),
          Widget.Label({
            className: 'amount-text',
            label: `   ${entry.amount}`
          }),
        ]
      })
    ]
  })

  return Widget.Box({
    vertical: true,
    setup: (self) => {
      entries.forEach((entry, index) => {
        self.add(createEntry(entry, index))
      });
    }
  })
}

const pieChart = Widget.Box({
  hpack: 'center',
  vpack: 'center',
  spacing: 24,
  children: [
    Widget.Label({
      className: 'placeholder-text',
      label: 'Nothing here yet.'
    })
  ],

  setup: self => self.hook(LedgerService, (self, breakdownData) => {
    if (breakdownData === undefined) return;

    // Remove placeholder
    self.foreach(x => self.remove(x))

    // Put amounts from all breakdownData entries into array
    const values = []
    for (const [_, data] of breakdownData.entries()) {
      values.push(data.amount)
    }

    self.children = [
      PieChart(values),
      Legend(breakdownData),
    ]

  }, 'breakdown-changed'),
})

export default () => {
  return Widget.Box({
    vertical: true,
    hexpand: true,
    className: 'breakdown',
    children: [
      Widget.Label({
        label: 'Monthly Breakdown',
        className: 'dash-widget-header',
      }),
      pieChart,
    ]
  })
}
