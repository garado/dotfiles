
// █▀▀ ▄▀█ █▄░█ █▀▀ █▄█   █▀▀ █▀█ ▄▀█ █▀█ █░█
// █▀░ █▀█ █░▀█ █▄▄ ░█░   █▄█ █▀▄ █▀█ █▀▀ █▀█

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from 'gi://Gdk';

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

  // // Define popups
  // let balances = []
  // const Fixed = Widget.subclass(Gtk.Fixed)
  // const fixedBox = Fixed({
  //   hexpand: true,
  //   vexpand: true,
  //   visible: false,
  //   setup: self => self.hook(LedgerService, (self, yearlyBalances) => {
  //     if (yearlyBalances == undefined) return
  //     
  //     self.set_size_request(w, h)
  //
  //     balances = []
  //     for (let i = 0; i < yearlyBalances.length; i+=2) {
  //       balances.push(yearlyBalances[i])
  //     }
  //   }, 'yearly-balances-changed')
  // })

  // // Make popups appear on mouseover
  // let dateText = Widget.Label({
  //   class_name: 'date',
  //   label: '',
  // })
  //
  // let amountText = Widget.Label({
  //   class_name: 'amount',
  //   label: '',
  // })
  //
  // let label = Widget.Box({
  //   vertical: true,
  //   hpack: 'center',
  //   vpack: 'center',
  //   children: [
  //     dateText,
  //     amountText,
  //     cDot(),
  //   ]
  // })

  // fixedBox.put(label, -10, -10)

  const stack = Widget.Overlay({
    child: graph,
    // overlays: [
    //   // fixedBox,
    // ]
  })

  // stack.add_events(Gdk.EventMask.LEAVE_NOTIFY_MASK)
  // stack.add_events(Gdk.EventMask.ENTER_NOTIFY_MASK)
  // stack.add_events(Gdk.EventMask.POINTER_MOTION_MASK)
  
  // Hide on mouse leave
  // stack.connect('leave-notify-event', (_, event) => {
  //   label.visible = false
  // })
  //
  // // Show on mouse enter
  // stack.connect('enter-notify-event', (_, event) => {
  //   label.visible = true
  // })
  //
  // // Move label depending on mouse position
  // stack.connect('motion-notify-event', (_, event) => {
  //   const coords = event.get_coords()
  //   const mouseX = coords[1]
  //   
  //   const balIndex = Math.floor((mouseX / w) * balances.length)
  //   if (balIndex >= balances.length) return
  //
  //   amountText.label = balances[balIndex]
  //
  //   const steps = w / balances.length
  //   const xPos = (Math.floor(mouseX / steps) * (steps-1)) + 5
  //   const yPos = h - ((balances[balIndex] / Math.max(...balances)) * h)
  //
  //   const xPadding = 0
  //   const yPadding = 8.5
  //
  //   fixedBox.move(fixedBox.get_children()[0], xPos + xPadding, yPos + yPadding)
  // })

  return stack
}


export default (args) => Widget.DrawingArea({
  widthRequest:  args.w ? args.w : 300,
  heightRequest: args.h ? args.h : 200,
  hpack: 'center',
  vpack: 'center',
  className: args.className ? args.className : '',

  drawFn: (self, cr, w, h) => {
    const xMax = args.values.length
    const yMax = Math.max(...args.values)

    // Get colors
    const styles = self.get_style_context();
    const fg = styles.get_color(Gtk.StateFlags.NORMAL);
    const bg = styles.get_background_color(Gtk.StateFlags.NORMAL);

    // Grid
    if (args.grid) {
      cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha)
      for (let i = 0; i < args.values.length; i+=2) {
        const xScaled = (i / xMax) * w
        cr.moveTo(xScaled, 0)
        cr.lineTo(xScaled, h)
      }
      cr.stroke()
    }

    // Graph

    // maxPoints: set max points

    // truncate: if maxPoints is given and numberOfPoints > maxPoints 
    // and `truncate` is set, it will only plot the last maxPoints points
    // (truncate the set)

    // average: if maxPoints is given and numberOfPoints > maxPoints 
    // and `average` is set, it will plot every (numberOfPoints / maxPoints)
    // point

    const PADDING = 40
    cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha)
    cr.moveTo(0, h)
    for (let i = 0; i < args.values.length; i++) {
      // Normalize values to fit in widget
      const xScaled = ((i+1) / xMax) * w
      const yScaled = ((args.values[i] / yMax) * h) - PADDING

      cr.lineTo(xScaled, h - yScaled)
      cr.stroke()
      cr.moveTo(xScaled, h - yScaled)
    }
    cr.stroke()

  }
})
