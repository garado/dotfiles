
// █▀▄ ▄▀█ █▀ █░█   ▀█▀ ▄▀█ █▄▄   █░░ ▄▀█ █▄█ █▀█ █░█ ▀█▀
// █▄▀ █▀█ ▄█ █▀█   ░█░ █▀█ █▄█   █▄▄ █▀█ ░█░ █▄█ █▄█ ░█░

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

/** 
 * Args: name pages
 **/
export default (args) => {
  const content = Widget.Box({
    children: [ args.pages[0] ]
  })

  const headerBar = Widget.CenterBox({
    hexpand: true,

    // Tab header
    startWidget: Widget.Label({
      className: 'header',
      vpack: 'center',
      hpack: 'start',
      label: args.name,
    }),

    // If there is more than 1 page, create buttons to
    // navigate between pages
    setup: (self) => {
      if (args.pages.length == 1) return

      self.endWidget = Widget.Box({
        spacing: 10,
        vpack: 'center',
        hpack: 'end',
        setup: (self) => {
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
    }
  })

  return Widget.Box({
    className: 'dashtab',
    vertical: true,
    spacing: 12,
    children: [
      headerBar,
      content,
    ]
  })
}
