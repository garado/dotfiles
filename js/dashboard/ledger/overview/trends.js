
// ▀█▀ █▀█ █▀▀ █▄░█ █▀▄ █▀
// ░█░ █▀▄ ██▄ █░▀█ █▄▀ ▄█

// My shitty implementation of a graph widget

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from 'gi://Gdk';

import LedgerService from '../../../services/ledger.js'


const cDot = () => Widget.DrawingArea({
  class_name: 'test',
  hpack: 'center',
  vpack: 'center',
  setup: (self) => {
    const w = 10

    self.set_size_request(w, w)

    self.connect('draw', (_, cr) => {
      const styles = self.get_style_context();
      const fg = styles.get_color(Gtk.StateFlags.NORMAL);
      cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha)

      // Draw a dot
      cr.arc(w / 2, w / 2, w / 4, 0, 2*Math.PI)
      cr.fill()
      cr.stroke()
    })
  }
})

function LineGraphTest() {
  // TODO: These are hardcoded for now because idk how ags autosets
  // widget height and width
  const h = 200
  const w = 400

  const graph = Widget.DrawingArea({
    class_name: 'balance-graph',
    hpack: 'center',
    vpack: 'center',
    setup: self => self.hook(LedgerService, (self, yearlyBalances) => {
      if (yearlyBalances == undefined) return;
      self.set_size_request(w, h)

      const xMax = yearlyBalances.length
      const yMax = Math.max(...yearlyBalances)

      self.connect('draw', (_, cr) => {
        // Get color
        const styles = self.get_style_context();
        const fg = styles.get_color(Gtk.StateFlags.NORMAL);
        const bg = styles.get_background_color(Gtk.StateFlags.NORMAL);

        // Draw grid
        cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha)
        for (let i = 0; i < yearlyBalances.length; i+=2) {
          const xScaled = (i / xMax) * w
          cr.moveTo(xScaled, 0)
          cr.lineTo(xScaled, h)
        }
        cr.stroke()

        // Draw graph
        const PADDING = 40
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
  })

  // Define popups
  let balances = []
  const Fixed = Widget.subclass(Gtk.Fixed)
  const fixedBox = Fixed({
    hexpand: true,
    vexpand: true,
    visible: false,
    setup: self => self.hook(LedgerService, (self, yearlyBalances) => {
      if (yearlyBalances == undefined) return
      
      self.set_size_request(w, h)

      balances = []
      for (let i = 0; i < yearlyBalances.length; i+=2) {
        balances.push(yearlyBalances[i])
      }
    }, 'yearly-balances-changed')
  })

  // Make popups appear on mouseover
  let dateText = Widget.Label({
    class_name: 'date',
    label: '',
  })

  let amountText = Widget.Label({
    class_name: 'amount',
    label: '',
  })

  let label = Widget.Box({
    vertical: true,
    hpack: 'center',
    vpack: 'center',
    children: [
      dateText,
      amountText,
      cDot(),
    ]
  })

  fixedBox.put(label, -10, -10)

  const stack = Widget.Overlay({
    child: graph,
    overlays: [
      fixedBox,
    ]
  })
  
  // Hide on mouse leave
  stack.add_events(Gdk.EventMask.LEAVE_NOTIFY_MASK)
  stack.connect('leave-notify-event', (_, event) => {
    label.visible = false
  })

  // Show on mouse enter
  stack.add_events(Gdk.EventMask.ENTER_NOTIFY_MASK)
  stack.connect('enter-notify-event', (_, event) => {
    label.visible = true
  })

  // Move label depending on mouse position
  stack.add_events(Gdk.EventMask.POINTER_MOTION_MASK)
  stack.connect('motion-notify-event', (_, event) => {
    const coords = event.get_coords()
    const mouseX = coords[1]
    
    const balIndex = Math.floor((mouseX / w) * balances.length)
    if (balIndex >= balances.length) return

    amountText.label = balances[balIndex]

    const steps = w / balances.length
    const xPos = (Math.floor(mouseX / steps) * steps) + 5
    const yPos = h - ((balances[balIndex] / Math.max(...balances)) * h)

    const xPadding = 0
    const yPadding = 8.5

    fixedBox.move(fixedBox.get_children()[0], xPos + xPadding, yPos + yPadding)
  })

  return stack
}

export default () => Widget.Box({
  class_name: 'yearly-balance',
  vertical: true,
  vexpand: false,
  spacing: 8,
  children: [
    Widget.Label({
      class_name: 'ledger-header',
      label: 'Balance this year',
    }),
    Widget.CenterBox({
      center_widget: LineGraphTest(),
    }),
  ]
})
