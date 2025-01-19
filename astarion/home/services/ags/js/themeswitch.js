
/* █░█ █▀█ ▀█▀   █▀█ █▀▀ █░░ █▀█ ▄▀█ █▀▄ */
/* █▀█ █▄█ ░█░   █▀▄ ██▄ █▄▄ █▄█ █▀█ █▄▀ */

import App from 'resource:///com/github/Aylur/ags/app.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../userconfig.js'

log('program', 'Entering hotreload.js')

/****************************************************
 * MODULE-LEVEL VARIABLES
 ****************************************************/

const WINDOW_NAME = 'theme'

let themeList


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
    child: label,
    onClicked: () => {
      App.closeWindow(WINDOW_NAME)

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

      /**
       * ags
       * sed: @import themes/oldtheme ==> @import themes/newtheme
       */
      if (themeDetails.ags) {
        const cmd = `sed -i \"s#import.*theme.*#import themes/${themeDetails.ags}#g\" $AGSCFG/sass/_theme.sass`
        Utils.execAsync(`bash -c '${cmd}'`)
          .catch(err => { print(err) })
      }
    }
  })
}

const ThemeList = () => {
  const entry = Widget.Entry({
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
      self.set_text('')

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
      entry,
    ]
  })

  const bottom = Widget.Box({
    children: [themeList],
  })

  return Widget.Box({
    className: 'container',
    vertical: true,
    children: [
      top,
      bottom,
    ]
  })
}


/****************************************************
 * EXPORT
 ****************************************************/

export default () => Widget.Window({
  name: WINDOW_NAME,
  className: 'theme',
  exclusivity: 'normal',
  layer: 'top',
  visible: 'false',
  keymode: 'exclusive',
  child: ThemeList(),
})
