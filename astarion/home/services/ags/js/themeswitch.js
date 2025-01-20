
/* █░█ █▀█ ▀█▀   █▀█ █▀▀ █░░ █▀█ ▄▀█ █▀▄ */
/* █▀█ █▄█ ░█░   █▀▄ ██▄ █▄▄ █▄█ █▀█ █▄▀ */

import Gdk from "gi://Gdk"
import App from 'resource:///com/github/Aylur/ags/app.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../userconfig.js'

log('program', 'Entering hotreload.js')

/****************************************************
 * MODULE-LEVEL VARIABLES
 ****************************************************/

const windowRevealerState = Variable(false)

const WINDOW_NAME = 'theme'

/* Widget forward declarations */
let themeList
let textEntry


/****************************************************
 * WIDGET DEFINITIONS
 ****************************************************/

const ThemeButton = (theme) => {
  const themeName = theme[0]
  const themeDetails = theme[1]

  const label = Widget.Label({
    label: themeName
  })

  return Widget.Button({
    name: themeName,
    hexpand: true,
    className: 'theme-btn',
    canFocus: true,
    child: label,
    onClicked: () => {
      App.closeWindow(WINDOW_NAME)
      textEntry.set_text('')

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

const ThemeList = () => {
  textEntry = Widget.Entry({
    className: 'entry',
    hexpand: 'center',
    vpack: 'center',
    hpack: 'center',
    placeholderText: 'Select a theme',

    /* Filter the theme list */
    onChange: ({ text }) => themeList.children.forEach(item => {
      item.visible = item.name.match(text ?? '');
    }),

    /* Select the first theme on Entry */
    onAccept: (self) => {
      const matches = themeList.children.filter(x => x.visible)

      if (matches.length > 0) {
        matches[0].emit('clicked')
      }
    },
  })

  themeList = Widget.Box({
    vertical: true,
    children: Object.entries(UserConfig.themes).map(entry => ThemeButton(entry))
  }) 

  const top = Widget.Box({
    vertical: true,
    children: [
      textEntry,
    ]
  })

  const bottom = Widget.Box({
    children: [themeList],
  })

  return Widget.Box({
    className: 'theme',
    vertical: true,
    children: [
      top,
      bottom,
    ]
  })
}

/****************************************************
 * BINDS
 ****************************************************/

const handleKey = (self, event) => {
  const keyval = event.get_keyval()[1]

  switch (keyval) {
    case Gdk.KEY_Escape:
      App.closeWindow(WINDOW_NAME)
      textEntry.emit('grab-focus')
      return true

    default: 
      if (    keyval != Gdk.KEY_Return 
          && keyval != Gdk.KEY_Shift_R 
          && keyval != Gdk.KEY_ISO_Left_Tab
          && keyval != Gdk.KEY_Tab
          && keyval != Gdk.KEY_Shift_L 
          && !textEntry.has_focus) {
        textEntry.emit('grab-focus')
        return true
      }
      break
  }
}


/****************************************************
 * EXPORT
 ****************************************************/

export default () => Widget.Window({
  name: WINDOW_NAME,
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  keymode: 'exclusive',
  attribute: windowRevealerState,
  child: Widget.Box({
    css: 'padding: 1px',
    child: Widget.Revealer({
      revealChild: windowRevealerState.bind(),
      transitionDuration: 150,
      transition: 'slide_down',
      child: ThemeList(),
    })
  })
}).on("key-press-event", handleKey)
