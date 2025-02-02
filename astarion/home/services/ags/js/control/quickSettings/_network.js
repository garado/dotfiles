
/* █▄▄ █░░ █░█ █▀▀ ▀█▀ █▀█ █▀█ ▀█▀ █░█ */
/* █▄█ █▄▄ █▄█ ██▄ ░█░ █▄█ █▄█ ░█░ █▀█ */

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

import QuickSettingsTemplate from './_template.js'

const nw = await Service.import('network')

/*******************************************************
 * MODULE-LEVEL VARIABLE
 *******************************************************/

const revealerState = Variable(false)

/*******************************************************
 * SUBWIDGETS
 *******************************************************/

/**
 * Widget representing a single network.
 */
const Connection = (con) => {
  return Widget.EventBox({
    hexpand: true,
    classNames: [
      'connection',
      con.active ? 'active' : '',
    ],
    child: Widget.Label({
      label: con.ssid,
      xalign: 0,
    }),
    onPrimaryClick: self => {

    }
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
    className: 'overview-content',
    hexpand: true,
    spacing: 10,
    children: [
      Widget.Icon('wifi'),
      Widget.Label({
        label: nw.wifi.bind('ssid').as(ssid => ssid || 'Unknown'),
      })
    ],
    setup: self => self
      .bind('prop', nw.wifi, 'ssid', ssid => {
        self.toggleClassName('active', ssid)
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
  vertical: true,
  spacing: 6,
  children: nw.wifi.bind('access-points').as(x => x.map(Connection)),
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
