import App from 'resource:///com/github/Aylur/ags/app.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import Gtk from 'gi://Gtk?version=3.0';

// Custom icons
Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets/icons`);
Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets/icons/feather`);

// Compile SASS
const sass = `${App.configDir}/sass/base.sass`
const css = `/tmp/ags/style.css`
Utils.exec(`sass ${sass} ${css}`)

await import(`file://${App.configDir}/js/main.js`)
