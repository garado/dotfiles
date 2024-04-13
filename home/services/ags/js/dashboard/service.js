
// █▀▄ ▄▀█ █▀ █░█   █▀ █▀▀ █▀█ █░█ █ █▀▀ █▀▀
// █▄▀ █▀█ ▄█ █▀█   ▄█ ██▄ █▀▄ ▀▄▀ █ █▄▄ ██▄

// State management for dashboard.

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
        'active_tab_index': ['int', 'rw'],
        'num_tabs': ['int', 'rw'],
      },
    )
  }

  #active_tab_index = 0
  #num_tabs = 0
 
  get active_tab_index() {
    return this.#active_tab_index
  }

  set active_tab_index(index) {
    this.#active_tab_index = index
    this.emit('active_tab_index_changed', index)
  }
  
  get num_tabs() {
    return this.#num_tabs
  }
  
  set num_tabs(num) {
    this.#num_tabs = num
  }

  // Use keyboard input to navigate between tabs
  handleKey = (self, event) => {
    const key = (event.get_keyval()[1] - Gdk.KEY_0) - 1
    if (1 <= key <= 9 && key < this.#num_tabs) {
      this.active_tab_index = key
    }
  }
}

const service = new DashService

export default service
