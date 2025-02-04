
/* █▄░█ █▀█ ▀█▀ █▀█ █▀█ █▀▀ █ */
/* █░▀█ █▄█ ░█░ █▀▄ █▄█ █▀░ █ */

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import App from 'resource:///com/github/Aylur/ags/app.js'
import Gdk from "gi://Gdk"
import Variable from 'resource:///com/github/Aylur/ags/variable.js'
import UserConfig from '../../userconfig.js'

const Hyprland = await Service.import('hyprland')
const { query } = await Service.import('applications')

log('program', 'Entering notrofi.js')

/****************************
 * MODULE-LEVEL VARIABLES
 ****************************/

const WINDOW_NAME = 'notrofi'

const currentTabIndex = Variable(0)
const revealerState = Variable(false)

let applications = query('')
let themeButtons = []
let sessionButtons = []

let tabCount

/****************************
 * HELPER FUNCTIONS
 ****************************/

/**
 * Iterate through tabs
 * left: dir -1
 * right: dir 1
 */
const iterTab = (dir) => {
  let newIndex = (currentTabIndex.value + (1 * dir)) % (tabCount)
  if (newIndex < 0) newIndex = tabCount - 1
  currentTabIndex.value = newIndex
}


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
    if (currentTabIndex.value == 0 && applications[0]) {
      App.closeWindow(WINDOW_NAME)
      applications[0].launch()
      self.set_text('')
    } else if (currentTabIndex.value == 2) {
      const matches = themeButtons.filter(x => x.visible)

      if (matches.length > 0) {
        App.closeWindow(WINDOW_NAME)
        matches[0].emit('clicked')
        self.set_text('')
      }
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
        Widget.Icon('magnifying-glass-symbolic'),
        Entry,
      ]
    })
  ]
})

/****************************
 * APP LAUNCHER
 ****************************/

const AppEntry = (app) => Widget.Button({
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
    App.closeWindow(WINDOW_NAME)
    Entry.set_text('')
    app.launch()
  },
  attribute: app,
})

const AppContent = Widget.Box({
  vertical: true,
  setup: self => self.hook(Entry, (self) => {
    applications = query(Entry.text)
    self.children = applications.map(AppEntry)
  }, 'changed')
})

const Applications = Widget.Scrollable({
  child: AppContent,
  heightRequest: 300,
})

/****************************
 * CLIENTS
 ****************************/

const ClientEntry = (client) => {
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
    attribute: client,
    className: 'item',
    child: content,
    onClicked: (self) => {
      Hyprland.messageAsync(`dispatch focuswindow pid:${self.attribute.pid}`)
      App.closeWindow(WINDOW_NAME)
      Entry.set_text('')
    }
  })
}

const ClientContent = Widget.Box({
  vertical: true,
  children: Hyprland.bind('clients').as(c => c
    .toSorted((a, b) => a.workspace.id > b.workspace.id)
    .map(ClientEntry))
})

const Clients = Widget.Scrollable({
  heightRequest: 300,
  child: ClientContent,
})


/****************************
 * THEME SWITCHER
 ****************************/

const ThemeButton = (theme) => {
  const themeName = theme[0]
  const themeDetails = theme[1]

  const label = Widget.Label({
    label: themeName,
    xalign: 0,
  })

  return Widget.Button({
    name: themeName,
    hexpand: true,
    className: 'item',
    canFocus: true,
    child: label,
    onClicked: () => {
      App.closeWindow(WINDOW_NAME)
      Entry.set_text('')

      /* Tell other widgets the theme changed */
      globalThis.systemTheme.setValue(themeName)

      /* Wallpaper */
      if (themeDetails.wallpaper) {
        Utils.execAsync(`swww img ${themeDetails.wallpaper} --transition-type fade --transition-step 20 \
           --transition-fps 255 --transition-duration 1.5 --transition-bezier .69,.89,.73,.46`)
          .catch(err => { print(err) })
      }

      /* Kitty */
      if (themeDetails.kitty) {
        Utils.exec(`kitty +kitten themes "${themeDetails.kitty}"`)
        Utils.execAsync(`bash -c "pgrep kitty | xargs kill -USR1"`)
      }

      /* Nvim (NvChad) */
      if (themeDetails.nvim) {
        const nvimPath = "$NVCFG/chadrc.lua"
        const nvimCmd = `sed -i 's/theme = \\".*\\"/theme = \\"${themeDetails.nvim}\\"/g'`
        Utils.exec(`bash -c "${nvimCmd} ${nvimPath}"`)
        Utils.execAsync("bash -c 'python3 $AGSCFG/scripts/nvim-reload.py'")
          .then(out => print)
          .catch(err => { print(err) })
      }

      /* ags */
      if (themeDetails.ags) {
        /* sass: @import themes/oldtheme ==> @import themes/newtheme */
        const sassCmd = `sed -i \"s#import.*theme.*#import themes/${themeDetails.ags}#g\" $AGSCFG/sass/_colorscheme.sass`
        Utils.execAsync(`bash -c '${sassCmd}'`)
          .catch(err => { print(err) })

        /* agscfg: currentTheme: 'kanagawa' => currentTheme: 'newTheme' */
        const configCmd = `sed -i \"s#currentTheme.*#currentTheme: \\"${themeName}\\",#g\" $AGSCFG/userconfig.js`
        Utils.execAsync(`bash -c '${configCmd}'`)
          .catch(err => { print(err) })
      }
    }
  })
}

const ThemeContent = Widget.Box({
  vertical: true,
  children: Object.entries(UserConfig.themes).map(ThemeButton),
  setup: self => self.hook(Entry, (self) => {
    self.children.forEach(item => {
      item.visible = item.name.match(Entry.text ?? '')
    })
    themeButtons = self.children
  }, 'changed')
})

const Theme = Widget.Scrollable({
  child: ThemeContent,
  heightRequest: 300,
})

/*********************************
 * TERMINAL SESSION LAUNCHER
 *********************************/

const SessionButton = (sessionName) => {
  const label = Widget.Label({
    label: sessionName,
    xalign: 0,
  })

  return Widget.Button({
    name: sessionName,
    hexpand: true,
    className: 'item',
    canFocus: true,
    child: label,
    onClicked: () => {
      App.closeWindow(WINDOW_NAME)
      Entry.set_text('')
      Utils.execAsync(`bash -c 'kitty --session ${UserConfig.kitty.sessions_path}/${sessionName} & disown'`)
    }
  })
}

const SessionContent = Widget.Box({
  vertical: true,
  setup: self => {
    /* Populate */
    const sessions = Utils.exec(`ls ${UserConfig.kitty.sessions_path}`).split('\n')
    self.children = sessions.map(SessionButton)

    /* Hook text entry */
    self.hook(Entry, (self) => {
      self.children.forEach(item => {
        item.visible = item.name.match(Entry.text ?? '')
      })
      sessionButtons = self.children
    }, 'changed')
  }
})

const Session = Widget.Scrollable({
  child: SessionContent,
  heightRequest: 300,
})


/****************************
 * TABS
 ****************************/

Applications.hook(currentTabIndex, (self) => {
  if (currentTabIndex.value == undefined) return
  self.visible = currentTabIndex.value == 0
}, 'changed')

Clients.hook(currentTabIndex, (self) => {
  if (currentTabIndex.value == undefined) return
  self.visible = currentTabIndex.value == 1
}, 'changed')

Theme.hook(currentTabIndex, (self) => {
  if (currentTabIndex.value == undefined) return
  self.visible = currentTabIndex.value == 2
}, 'changed')

Session.hook(currentTabIndex, (self) => {
  if (currentTabIndex.value == undefined) return
  self.visible = currentTabIndex.value == 3
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
        icon: 'squares-four-symbolic',
      }),
      onClicked: () => { currentTabIndex.value = 0 },
      setup: self => self.hook(currentTabIndex, (self) => {
        self.className = currentTabIndex.value == 0 ? 'active' : ''
      }, 'changed')
    }),
    Widget.Button({
      child: Widget.Icon({
        hexpand: true,
        icon: 'cards-symbolic',
      }),
      onClicked: () => { currentTabIndex.value = 1 },
      setup: self => self.hook(currentTabIndex, (self) => {
        self.className = currentTabIndex.value == 1 ? 'active' : ''
      }, 'changed')
    }),
    Widget.Button({
      child: Widget.Icon({
        hexpand: true,
        icon: 'palette-symbolic',
      }),
      onClicked: () => { currentTabIndex.value = 2 },
      setup: self => self.hook(currentTabIndex, (self) => {
        self.className = currentTabIndex.value == 2 ? 'active' : ''
      }, 'changed')
    }),
    Widget.Button({
      child: Widget.Icon({
        hexpand: true,
        icon: 'terminal-symbolic',
      }),
      onClicked: () => { currentTabIndex.value = 3 },
      setup: self => self.hook(currentTabIndex, (self) => {
        self.className = currentTabIndex.value == 3 ? 'active' : ''
      }, 'changed')
    }),
  ],
  setup: self => {
    tabCount = self.children.length
  }
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
    Theme,
    Session,
  ]
})

const NotRofi = Widget.Box({
  classNames: ['notrofi', 'dropshadow'],
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
      Entry.emit('grab-focus')
      break
    case Gdk.KEY_J:
      NotRofi.emit('move-focus', 0)
      return true
    case Gdk.KEY_K:
      NotRofi.emit('move-focus', 1)
      return true
    case Gdk.KEY_H:
      iterTab(-1)
      return true
    case Gdk.KEY_L:
      iterTab(1)
      return true
    case Gdk.KEY_Tab:
      NotRofi.emit('move-focus', 0)
      return true
    case Gdk.KEY_ISO_Left_Tab:
      NotRofi.emit('move-focus', 1)
      return true
    case Gdk.KEY_1:
      currentTabIndex.value = 0
      return true
    case Gdk.KEY_2:
      currentTabIndex.value = 1
      return true
    case Gdk.KEY_3:
      currentTabIndex.value = 2
      return true
    case Gdk.KEY_4:
      currentTabIndex.value = 3
      return true
    default:
      if (    keyval != Gdk.KEY_Return 
          && keyval != Gdk.KEY_Shift_R 
          && keyval != Gdk.KEY_Shift_L 
          && !Entry.has_focus) {
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
  attribute: revealerState,
  keymode: 'exclusive',
  child: Widget.Box({
    css: 'padding: 1px',
      child: Widget.Revealer({
        revealChild: revealerState.bind(),
        transitionDuration: 150,
        transition: 'slide_up',
        child: NotRofi,
      })
  })
}).on("key-press-event", handleKey)
