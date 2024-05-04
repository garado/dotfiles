
// █░█░█ █▀▀ █▀▀ █▄▀   █░█ █ █▀▀ █░█░█
// ▀▄▀▄▀ ██▄ ██▄ █░█   ▀▄▀ █ ██▄ ▀▄▀▄▀

// Google Calendar-esque calendar view.

// This code is dogshit

import Gtk from 'gi://Gtk'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import CalService from '../../../services/gcalcli.js'

import EventBox from './_eventbox.js'
import UserConfig from '../../../../userconfig.js'

const Fixed = Widget.subclass(Gtk.Fixed)

/*********************************************
 * HELPER FUNCTIONS (Shoutout StackOverflow)
 *********************************************/

function determinePlacement(dateString, eventIndex) {
  const bubbles = []
}

/**
 * Returns true if events A and B collide.
 * Note: FH stands for 'float hour'
 * It is a way to represent the time of day as a float, where every 
 * whole number represents one full hour.
 *
 * Time         Equivalent FH
 * -----        -------------
 * 12AM     ->  0.0
 * 9:15AM   ->  9.25
 * 5:30PM   ->  17.5
 * 11:59PM  ->  23.983333333
 *    
 **/
function collidesWith(a, b) {
  return a.endFH > b.startFH && a.startFH < b.endFH
}


function isWithin(a, b) {
  return a.startFH > b.startFH && a.endFH < b.endFH
}

function drawFullWidthDespiteOverlap(a, b) {
}

/*****************************************
 * WIDGETS
 *****************************************/

/**
 * The gridlines underneath the day columns.
 */
const Gridlines = Widget.DrawingArea({
  heightRequest:  CalService.HOUR_HEIGHT_PX * 24,
  widthRequest: CalService.DAY_WIDTH_PX * 7,
  className: 'weekview-gridlines',

  drawFn: (self, cr, w, h) => {
    // Get the color for the weekview-gridlines class
    const styles = self.get_style_context();
    const fg = styles.get_color(Gtk.StateFlags.NORMAL);
    cr.setSourceRGBA(fg.red, fg.green, fg.blue, 1)

    // Draw horizontal lines to separate hours
    let y = 0
    cr.moveTo(0, 0)
    for (let _ = 0; _ < 24; _++) {
      cr.lineTo(CalService.VIEWPORT_WIDTH_PX, y)
      y += CalService.HOUR_HEIGHT_PX
      cr.moveTo(0, y)
    }

    // Draw vertical lines to separate days
    let x = 0
    cr.moveTo(0, 0)
    for (let i = 0; i < 7; i++) {
      cr.lineTo(x, CalService.HOUR_HEIGHT_PX * 24)
      x += CalService.DAY_WIDTH_PX + CalService.WIDGET_SPACING_PX
      cr.moveTo(x, 0)
    }
    
    cr.stroke()
  }
})

/**
 * The labels to the left that show the hour.
 */
const HourLabels = Widget.Box({
  vertical: true,
  heightRequest: CalService.HOUR_HEIGHT_PX * 24,
  widthRequest: CalService.HOURLABEL_WIDTH_PX,

  setup: self => {
    for (let i = 0; i < 24; i++) {
      const hourLabel = Widget.Label({
        // im doing some fuckery here to align it with the hour gridlines
        // uncomment below to reveal the fuckery
        // css: `background-color: ${i % 2 ? 'red' : 'blue'}`,
        hpack: 'start',
        vpack: 'end',
        label: i == 0 ? '' : `${i}  `,
        heightRequest: i == 0 ? CalService.HOUR_HEIGHT_PX / 2 : CalService.HOUR_HEIGHT_PX,
        widthRequest: CalService.HOURLABEL_WIDTH_PX,
        className: 'hour-label',
      })
      self.add(hourLabel)
    }
  }
})

/**
 * The labels above every day column indicating the day and weekday.
 */
const DateLabels = Widget.Box({
  spacing: CalService.WIDGET_SPACING_PX,

  setup: self => {

    self.add(Widget.Box({
      visible: true,
      widthRequest: CalService.HOURLABEL_WIDTH_PX,
    }))

    for (let i = 0; i < CalService.viewrange.length; i++) {
      const name = Widget.Label({
        className: 'day-name',
        label: `${CalService.DAY_NAMES[i]}`
      })

      const number = Widget.Label({
        className: 'number',
        label: /-(\d\d)$/.exec(CalService.viewrange[i])[1]
      })

      const dateLabel = Widget.Box({
        classNames: [
          'date-label',
          CalService.viewrange[i] == CalService.today ? 'active' : '',
        ],
        widthRequest: CalService.DAY_WIDTH_PX,
        attribute: number,
        vertical: true,
        children: [
          name,
          number,
        ]
      })

      self.add(dateLabel)
    }
  }
})

/**
 * When the viewrange is changed, edit date labels to reflect the new viewrange.
 */
DateLabels.hook(CalService, (self, viewrange) => {
  if (viewrange == undefined) return

  for (let i = 0; i < viewrange.length; i++) {
    const newLabel = /-(\d\d)$/.exec(CalService.viewrange[i])[1]
    self.children[i + 1].attribute.label = newLabel


    self.children[i + 1].classNames = [
      'date-label',
      CalService.viewrange[i] == CalService.today ? 'active' : '',
    ]
  }
}, 'viewrange-changed')


/**
 * Widget containing columns for the entire week.
 **/
const DayColumns = Widget.Box({
  vexpand: false,
  spacing: CalService.WIDGET_SPACING_PX,
  heightRequest: CalService.HOUR_HEIGHT_PX * 24,
  widthRequest: CalService.DAY_WIDTH_PX * 7,
  // css: `margin-left: ${CalService.HOURLABEL_WIDTH_PX}px`,
  children: [],

  setup: self => self.hook(CalService, (self, dateString, events) => {

    // On first invocation ----------------------------------

    if (dateString === undefined && events === undefined) {
      for (let i = 0; i < 7; i++) {
        const dayColumn = Fixed({
          heightRequest: CalService.HOUR_HEIGHT_PX * 24,
          widthRequest: CalService.DAY_WIDTH_PX,
          visible: true, // needs to be forced
        })

        self.add(dayColumn)
      }

      CalService.requestData()

      return
    }

    // After first invocation --------------------------------

    const index = CalService.viewrange.indexOf(dateString)

    const thisDayColumn = self.children[index]

    thisDayColumn.get_children().forEach(element => {
      // NOTE TO SELF: without this, we get the "Attempting to call back into JSAPI during
      // the sweeping phase of GC." error for every event box.
      // on discord, aylur said somewhere that it's because a widget was created but not assigned
      // as a child. so... remove literally everything
      element.foreach(x => element.remove(x))

      thisDayColumn.remove(element)
    });

    function packEvents(group) {
      for (let i = 0; i < group.length; i++) {

        // Drawing multi-day events will be handled elsewhere
        // TODO: Implement "elsewhere"
        if (group[i].multiday) continue

        const x = (i / group.length) * (CalService.DAY_WIDTH_PX / group.length)
        const y = group[i].startFH * CalService.HOUR_HEIGHT_PX

        const eBox = EventBox(group[i])
        eBox.widthRequest = CalService.DAY_WIDTH_PX - x

        // self.children[index].child.put(eBox, x, y)
        self.children[index].put(eBox, x, y)
      }
    }

    let group = []
    let lastGroupEventEnd = null
    let placed = false

    events.forEach(currEvent => {

      if (currEvent.startFH >= lastGroupEventEnd) {
        packEvents(group)
        group = []
        lastGroupEventEnd = null
      }

      placed = false

      for (let i = 0; i < group.length; i++) {
        if (collidesWith(group[i], currEvent)) {
          group.push(currEvent)
          placed = true
          break
        }
      }

      if (!placed) {
        packEvents(group)
        group = []
        group.push(currEvent)
      }

      if (lastGroupEventEnd == null || currEvent.endFH > lastGroupEventEnd) {
        lastGroupEventEnd = currEvent.endFH
      }
    });

    if (group.length > 0) {
      packEvents(group)
    }

  }, 'viewable-day-updated')
})

export default () => Widget.Box({
  className: 'week',
  hpack: 'center',
  vpack: 'center',
  vertical: true,
  vexpand: false,
  spacing: 12,
  attribute: { name: 'Week' },
  children: [
    DateLabels,
    Widget.Scrollable({
      className: 'scroll',
      vscroll: 'always',
      hscroll: 'never',
      overlayScrolling: false, // makes scrollbar always visible
      heightRequest: CalService.HOUR_HEIGHT_PX * CalService.HOURS_VIEWABLE,
      child: Widget.Box({
        vertical: false,
        children: [
          HourLabels,
          Widget.Overlay({
            child: Gridlines,
            overlays: [Widget.Box({
              vertical: false,
              children: [
                DayColumns
              ],
            })],
          })
        ]
      })

    })
  ]
})
