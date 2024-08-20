
// █▄░█ █▀█ ▀█▀ █▀█ █▀█ █▀▀ █
// █░▀█ █▄█ ░█░ █▀▄ █▄█ █▀░ █

import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import App from 'resource:///com/github/Aylur/ags/app.js'
import Gdk from "gi://Gdk";
import Variable from 'resource:///com/github/Aylur/ags/variable.js'


const { query } = await Service.import('applications');

/****************************
 * MODULE-LEVEL VARIABLES
 ****************************/

const WINDOW_NAME = 'notrofi'

const CurrentTabIndex = Variable(0)

let applications = query('')

/****************************
 * TEXT ENTRY AND UI
 ****************************/

/**
 * The textbox where you type stuff
 */
const Entry = Widget.Entry({
  className: 'entry',
  hexpand: 'center',
  vpack: 'center',
  hpack: 'center',

  // Launch the first item on Entry
  onAccept: (self) => {
    if (CurrentTabIndex.value == 0 && applications[0]) {
      App.closeWindow(WINDOW_NAME);
      applications[0].launch()
      self.set_text('')
    }
  },
})

const TopPart = () => Widget.Box({
  className: 'top-part',
  vertical: false,
  children: [
    Widget.Box({
      spacing: 12,
      className: 'entry-container',
      vpack: 'center',
      hpack: 'center',
      children: [
        Widget.Icon('search'),
        Entry,
      ]
    })
  ]
})

/****************************
 * APP LAUNCHER
 ****************************/

const CreateAppEntry = (app) => Widget.Button({
  className: 'item',
  child: Widget.Box({
    children: [
      Widget.Label({
        className: 'title',
        label: app.name,
        hpack: 'start',
        vpack: 'center',
        truncate: 'end',
      }),
    ],
  }),
  onClicked: () => {
    App.closeWindow(WINDOW_NAME);
    app.launch();
  },
  attribute: app,
});

const AppContent = Widget.Box({
  vertical: true,
  setup: self => self.hook(Entry, (self) => {
    applications = query(Entry.text)
    self.children = applications.map(CreateAppEntry)
  }, 'changed')
})

const Applications = Widget.Scrollable({
  child: AppContent,
  heightRequest: 300,
})

/****************************
 * CLIENTS
 ****************************/

const CreateClientEntry = (client) => {
  const content = Widget.Box({
    className: 'client',
    spacing: 8,
    children: [
      Widget.Label({
        className: 'workspace-id',
        label: `${client.workspace.id}`,
      }),
      Widget.Label({
        className: 'title',
        truncate: 'end',
        label: `${client.initialTitle} (${client.title})`,
      }),
    ]
  })

  return Widget.Button({
    className: 'item',
    child: content,
  })
}

const ClientContent = Widget.Box({
  vertical: true,
  children: Hyprland.bind('clients').as(c => c
    .toSorted((a, b) => a.workspace.id > b.workspace.id)
    .map(CreateClientEntry))
})

const Clients = Widget.Scrollable({
  heightRequest: 300,
  child: ClientContent,
})


/****************************
 * TABS
 ****************************/

Applications.hook(CurrentTabIndex, (self) => {
  if (CurrentTabIndex.value == undefined) return
  self.visible = CurrentTabIndex.value == 0
}, 'changed')

Clients.hook(CurrentTabIndex, (self) => {
  if (CurrentTabIndex.value == undefined) return
  self.visible = CurrentTabIndex.value == 1
}, 'changed')

const Tabs = () => Widget.Box({
  className: 'tab-container',
  hexpand: true,
  vertical: false,
  spacing: 8,
  children: [
    Widget.Button({
      child: Widget.Icon({
        hexpand: true,
        icon: 'grid',
      }),
      onClicked: () => { CurrentTabIndex.value = 0 },
      setup: self => self.hook(CurrentTabIndex, (self) => {
        self.className = CurrentTabIndex.value == 0 ? 'active' : ''
      }, 'changed')
    }),
    Widget.Button({
      child: Widget.Icon({
        hexpand: true,
        icon: 'layers',
      }),
      onClicked: () => { CurrentTabIndex.value = 1 },
      setup: self => self.hook(CurrentTabIndex, (self) => {
        self.className = CurrentTabIndex.value == 1 ? 'active' : ''
      }, 'changed')
    }),
  ]
})

/****************************
 * ASSEMBLE
 ****************************/

const BottomPart = Widget.Box({
  className: 'content',
  vertical: true,
  hexpand: true,
  children: [
    Applications,
    Clients,
  ]
})

const NotRofi = Widget.Box({
  className: 'notrofi',
  vertical: true,
  hexpand: true,
  children: [
    TopPart(),
    BottomPart,
    Tabs(),
  ]
})

// Extra keybinds
const handleKey = (self, event) => {
  const keyval = event.get_keyval()[1]
  switch (keyval) {
    case Gdk.KEY_Escape:
      App.closeWindow(WINDOW_NAME)
      break
    case Gdk.KEY_J:
      BottomPart.emit('move-focus', 0)
      return true
    case Gdk.KEY_K:
      BottomPart.emit('move-focus', 1)
      return true
    case Gdk.KEY_H:
      CurrentTabIndex.value = 0
      return true
    case Gdk.KEY_L:
      CurrentTabIndex.value = 1
      return true
    default:
      if (!Entry.has_focus) {
        Entry.emit('grab-focus')
      }
      break
  }
}

export default () => Widget.Window({
  name: WINDOW_NAME,
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  keymode: 'exclusive',
  child: NotRofi,
}).on("key-press-event", handleKey)
