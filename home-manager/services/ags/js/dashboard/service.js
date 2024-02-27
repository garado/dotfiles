
// █▀▄ ▄▀█ █▀ █░█   █▀ █▀▀ █▀█ █░█ █ █▀▀ █▀▀
// █▄▀ █▀█ ▄█ █▀█   ▄█ ██▄ █▀▄ ▀▄▀ █ █▄▄ ██▄

// State management for dashboard.
// Also wraps keyboard input.

import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'
import Gdk from "gi://Gdk";

class DashService extends Service {
  constructor() {
    super()
  }

  static {
    Service.register (
      this,
      { // Signals
        'active_tab_index_changed': ['int'],
      },
      { // Properties
        'active_tab_index': ['int', 'rw']
      },
    )
  }

  #active_tab_index = 0
 
  get active_tab_index() {
    return this.#active_tab_index
  }

  set active_tab_index(index) {
    this.#active_tab_index = index
    this.emit('active_tab_index_changed', this.#active_tab_index)
  }

  handleKey = (self, event) => {
    const keyval = event.get_keyval()[1]
    switch (keyval) {
      case Gdk.KEY_1:
        this.active_tab_index = 0
        break
      case Gdk.KEY_2:
        this.active_tab_index = 1
        break
    }
  }
}

const service = new DashService

export default service
