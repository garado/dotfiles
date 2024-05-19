import App from 'resource:///com/github/Aylur/ags/app.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import Gtk from 'gi://Gtk?version=3.0';

// Custom icons
Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets/icons`);
Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets/icons/feather`);

function loadSASS() {
  const sass = `${App.configDir}/sass/base.sass`
  const css = `/tmp/ags/style.css`

  // compile, reset, apply
  Utils.exec(`sass ${sass} ${css}`)
  App.resetCss()
  App.applyCss(css)
}

loadSASS()

Utils.monitorFile(`${App.configDir}/sass`, loadSASS)

await import(`file://${App.configDir}/js/main.js`)
