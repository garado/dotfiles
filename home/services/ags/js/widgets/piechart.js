
// █▀█ █ █▀▀   █▀▀ █░█ ▄▀█ █▀█ ▀█▀
// █▀▀ █ ██▄   █▄▄ █▀█ █▀█ █▀▄ ░█░

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';

// "values" is an array of numbers
// widget will calculate everything for you
export default (values) => Widget.DrawingArea({
  widthRequest:  200,
  heightRequest: 200,

  drawFn: (self, cr, w, h) => {

    const radius = w / 2
    
    const center = {
      x: w / 2,
      y: h / 2,
    }
    
    cr.setLineWidth(2)

    const maxValue = values.reduce((partialSum, a) => partialSum + a, 0);

    let r = 1 // to change color
    let lastAngle = 0
      
    for (let i = 0; i < values.length; i++) {
      // Get color
      self.className = `pie-slice-${i+1}`
      const styles = self.get_style_context();
      const fg = styles.get_color(Gtk.StateFlags.NORMAL);
      cr.setSourceRGBA(fg.red, fg.green, fg.blue, 1)

      // Max angle is Math.PI * 2
      const startAngle = lastAngle
      const diff = (values[i] / maxValue) * (Math.PI * 2)

      cr.arc(center.x, center.y, radius, startAngle, startAngle + diff)
      cr.lineTo(center.x, center.y)
      cr.fill()

      lastAngle = startAngle + diff
    }

  },
})
