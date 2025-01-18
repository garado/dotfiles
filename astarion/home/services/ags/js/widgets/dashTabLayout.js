
// █▀▄ ▄▀█ █▀ █░█   ▀█▀ ▄▀█ █▄▄   █░░ ▄▀█ █▄█ █▀█ █░█ ▀█▀
// █▄▀ █▀█ ▄█ █▀█   ░█░ █▀█ █▄█   █▄▄ █▀█ ░█░ █▄█ █▄█ ░█░

// Provides a consistent implementation for the top content bar.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

/** 
 * @param args.name     tab label to display
 * @param args.pages    array of different pages to switch through
 * @param args.actions  widget to display in top left
 */
export default (args) => {
  const actions = Widget.Box({
    hpack: 'end',
    setup: self => {

      if (!args.actions) return

      self.spacing = 4

      args.actions.forEach(action => {
        const actionBtn = Widget.Button({
          className: 'action-btn',
          canFocus: false,
          vpack: 'center',
          child: Widget.Label(action.name),
          onPrimaryClick: action.onPrimaryClick,
        })
        self.add(actionBtn)
      })
    }
  })

  const pages = Widget.Box({
    setup: self => {
      if (args.pages.length == 1) return
      
      self.spacing = 10
      self.vpack = 'center'
      self.hpack = 'end'

      args.pages.map(p => {
        self.add(Widget.Button({
          child: Widget.Label(p.attribute.name),
          attribute: p,
          onPrimaryClick: (self) => {
            if (content.children[0] != self.attribute) {
              content.foreach(e => content.remove(e))
              content.add(self.attribute)
            }
          }
        }))
      })
    }
  })

  const tabHeader = Widget.Label({
    className: 'header',
    vpack: 'center',
    hpack: 'start',
    label: args.name,
    useMarkup: true,
  })

  const headerBar = Widget.CenterBox({
    hexpand: true,

    startWidget: tabHeader,

    endWidget: Widget.Box({
      hpack: 'end',
      children: [
        // args.actions,
        actions,
        pages,
      ],
    })
  })

  const content = Widget.Box({
    children: [ args.pages[0] ]
  })

  return Widget.Box({
    className: 'dashtab',
    vertical: true,
    spacing: 12,
    children: [
      headerBar,
      content,
    ],

    // Provide functions
    attribute: {
      'setHeader': (header) => {
        tabHeader.label = header
      },
    },
  })
}
