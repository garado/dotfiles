
/* █▀▀ ▄▀█ █▄░█ █▀▀ █▄█   █▀▀ █▀█ ▄▀█ █▀█ █░█ */
/* █▀░ █▀█ █░▀█ █▄▄ ░█░   █▄█ █▀▄ █▀█ █▀▀ █▀█ */

/* With popups and such */

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from 'gi://Gdk';

import LedgerService from '../services/ledger/ledger.js'
  
/**
 * To get CSS information for the FancyGraph widget, you need to do some
 * weird CSS shit
 */
const setCairoColorFromClass = (cr, ...rest) => {
  const dummyWidget = new Gtk.Box()
  const dummyContext = dummyWidget.get_style_context()

  for (const c of dummyContext.list_classes()) {
    dummyContext.remove_class(c)
  }

  for (const c of rest) {
    dummyContext.add_class(c)
  }

  const color = dummyContext.get_color(Gtk.StateFlags.NORMAL)
  cr.setSourceRGBA(color.red, color.green, color.blue, color.alpha)
}


/**
 * @function fit
 * @brief Calculate line of best fit equation
 */
const fit = (points) => {
  const n = points.length

  if (n === 0) return null

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0

  for (let x = 0; x  < points.length; x++) {
    sumX += x
    sumY += points[x]
    sumXY += x * points[x]
    sumX2 += x * x
  }

  let m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2)
  let b = (sumY - m * sumX) / n

  return { slope: m, intercept: b }
}


/**
 * graphs[] is a list of graph data objects.
 *
 * Sample graph data object:
 *
 * {
 *    name:   'Graph name',
 *    values: [], // array of values to plot
 *    color:  'colorAsHexString',
 * }
 */
export default ({
  grid = true,            /* Draw background grid? */
  graphs = [],            /* Array of graph data objects */
  className = 'graph',
  yIntersect = true,
  yIntersectLabel = true,

  /* Phase these out */
  wRequest = 300,
  hRequest = 200,
  ...rest
}) => {

  /* Globals */
  const valueMax = Math.max(...graphs.map(g => Math.max(...g.values)))
  const valueMin = Math.min(...graphs.map(g => Math.min(...g.values)))
  const longestArrayLength = Math.max(...graphs.map(g => g.values.length))

  /* Initialization */
  graphs.forEach(graph => {
    if (graph.calculateFit) {
      graph.fit = fit(graph.values)
    }
  })

  /* Plot all graphs */
  const Graph = Widget.DrawingArea({
    widthRequest:  wRequest,
    heightRequest: hRequest,
    className: className,
    hpack: 'center',
    vpack: 'center',
    ...rest,

    drawFn: (self, cr, w, h) => {
      const xScale = (1 / longestArrayLength) * w
      const yScale = (1  / (valueMax - valueMin)) * h

      /* Plot vertical intersection line --------------------------------- */
      if (yIntersect && self.drawIntersect) {
        setCairoColorFromClass(cr, className, 'vertical-intersect')
        cr.moveTo(self.lastX, 0)
        cr.lineTo(self.lastX, h)
        cr.stroke()
      }

      graphs.forEach(graph => {        
        /* Plot line of best fit, if applicable ---------------------------- */
        if (graph.calculateFit) {
          setCairoColorFromClass(cr, graph.className, 'fit')
          cr.setDash([10, 5], 0) // 10-unit dash, 5-unit gap, 0 offset
          cr.moveTo(0, h)
          cr.lineTo(w, h - ((graph.fit.slope * longestArrayLength) + graph.fit.intercept) * yScale)
          cr.stroke()
          cr.setDash([], 0)
        }
        
        /* Plot values ----------------------------------------------------- */
        setCairoColorFromClass(cr, graph.className, 'plot')

        if (graph.dashed) cr.setDash([10, 5], 0)
          
        cr.moveTo(0, h)
        for (let i = 0; i < graph.values.length; i++) {
          cr.lineTo(i * xScale, h - (graph.values[i] * yScale))
        }
        cr.stroke()

        if (graph.dashed) cr.setDash([], 0) /* clear */

        /* Plot horizontal intersection line ------------------------------- */
        if (self.drawIntersect && graph.xIntersect.enable) {
          const graphIndex = Math.round((self.lastX / w) * longestArrayLength)
          if (graphIndex >= graph.values.length && !graph.calculateFit) return

          let graphY = 0
          if (graphIndex >= graph.values.length && graph.calculateFit) {
            graphY = h - (((graphIndex * graph.fit.slope) + graph.fit.intercept) * yScale)
          } else {
            graphY = h - (graph.values[graphIndex] * yScale);
          }

          setCairoColorFromClass(cr, graph.className, 'horizontal-intersect')
          cr.moveTo(0, graphY)
          cr.lineTo(w, graphY)
          cr.stroke()

          /* Draw circle at intersection */
          cr.arc(self.lastX, graphY, 4, 0, 2 * Math.PI)
          cr.fill()

          /* Label */
          if (graph.xIntersect.label) {
            let value = 0
            if (graphIndex >= graph.values.length && graph.fit) {
              value = (graph.fit.slope * graphIndex) + graph.fit.intercept
            } else {
              value = graph.values[graphIndex]
            }

            cr.setFontSize(20)

            let text = ''
            if (graph.xIntersect.labelTransform) {
              text = graph.xIntersect.labelTransform(value)
            } else {
              text = `${value}`
            }
            
            const extents = cr.textExtents(text)
            cr.moveTo(w - extents.width, graphY - 5)
            cr.showText(text)
          }
        }
      })
    }
  })

  Object.assign(Graph, {
    drawEnabled: false,
    drawIntersect: true,
    lastX: -1,
    lastY: -1,
  })

  Graph.add_events(Gdk.EventMask.LEAVE_NOTIFY_MASK)
  Graph.add_events(Gdk.EventMask.ENTER_NOTIFY_MASK)
  Graph.add_events(Gdk.EventMask.POINTER_MOTION_MASK)

  Graph.connect('leave-notify-event', (self, event) => {
    self.drawIntersect = false
    self.queue_draw()
    self.drawEnabled = false
  })

  Graph.connect('enter-notify-event', (self, event) => {
    self.drawEnabled = true 
    self.drawIntersect = true
  })

  Graph.connect('motion-notify-event', (self, event) => {
    const coords = event.get_coords()
    self.lastX = coords[1]
    self.lastY = coords[2]
    self.queue_draw()
  })

  return Graph
}
