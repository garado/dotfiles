
/* █▄▄ █░░ █░█ █▀▀ ▀█▀ █▀█ █▀█ ▀█▀ █░█ */
/* █▄█ █▄▄ █▄█ ██▄ ░█░ █▄█ █▄█ ░█░ █▀█ */

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

import QuickSettingsTemplate from './_template.js'

const audio = await Service.import('audio')

/*******************************************************
 * MODULE-LEVEL VARIABLE
 *******************************************************/

const revealerState = Variable(false)

/*******************************************************
 * SUBWIDGETS
 *******************************************************/

/**
 * Widget representing a single audio stream
 */
const Speaker = (speaker) => {
  return Widget.EventBox({
    hexpand: true,
    classNames: [
      'stream',
    ],
    child: Widget.Label({
      label: speaker.description,
      xalign: 0,
    }),
    onPrimaryClick: self => {

    },
    setup: self => self
      .bind('prop', audio, 'speaker', activeSpeaker => {
        /* @TODO not working */
        self.toggleClassName('active', activeSpeaker.description == speaker.description)
      })
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
      Widget.Icon('volume-2'),
      Widget.Label({
        label: audio.bind('speaker').as(speaker => speaker.description),
      })
    ],
    setup: self => self
      // .bind('prop', nw.wifi, 'ssid', ssid => {
      //   self.toggleClassName('active', ssid)
      // })
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
  children: audio.bind('speakers').as(x => x.map(Speaker)),
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
