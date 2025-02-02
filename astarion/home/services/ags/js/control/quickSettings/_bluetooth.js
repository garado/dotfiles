
/* █▄▄ █░░ █░█ █▀▀ ▀█▀ █▀█ █▀█ ▀█▀ █░█ */
/* █▄█ █▄▄ █▄█ ██▄ ░█░ █▄█ █▄█ ░█░ █▀█ */

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

import QuickSettingsTemplate from './_template.js'

const bt = await Service.import('bluetooth')

/*******************************************************
 * MODULE-LEVEL VARIABLE
 *******************************************************/

const revealerState = Variable(false)

/*******************************************************
 * SUBWIDGETS
 *******************************************************/

/**
 * Widget representing a single device
 */
const Device = (dev) => {
  return Widget.Label({
    label: `${dev.name} - (${dev.battery_level})`,
  })
}

/*******************************************************
 * WIDGETS
 *******************************************************/

/**
 * Button showing setting status.
 * Clicking reveals the rest of the content.
 */
const Overview = Widget.EventBox({
  className: 'overview',
  child: Widget.Box({
    classNames: ['overview-content'],
    hexpand: true,
    spacing: 10,
    children: [
      Widget.Icon('bluetooth'),
      Widget.Label({
        label: bt.bind('connected-devices').as(dev => dev.length > 0 ? dev[0].name : 'Not connected'),
      }),
    ],
    setup: self => self
      .bind('prop', bt, 'connected-devices', dev => {
        self.toggleClassName('active', dev.length > 0)
      })
  }),
  onPrimaryClick: () => {
    revealerState.setValue(!revealerState.value)
  }
})

/**
 * Content to be revealed after button is pressed.
 */
const Content = Widget.Box({
  className: 'content',
  children: bt.bind('devices').as(x => x.map(Device)),
})

/**
 * Content to be revealed after button is pressed.
 */
const ContentReveal = Widget.Box({
    css: 'padding: 1px',
    child: Widget.Revealer({
      revealChild: revealerState.bind(),
      transitionDuration: 250,
      transition: 'slide_down',
      child: Content,
    })
  })


/**
 * Final widget assembly
 */
export default () => Widget.Box({
  className: 'quick-settings-item',
  child: Widget.Box({
    vertical: true,
    children: [
      Overview,
      ContentReveal,
    ]
  }),
})
