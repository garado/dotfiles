
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
        'active-tab-index-changed': ['int'],
        'page-index-changed': ['int'],
      },
      { // Properties
        'active-tab-index': ['int', 'rw'],
        'page-index': ['int', 'rw'],
        'num-tabs': ['int', 'rw'],
      },
    )
  }

  #activeTabIndex = 0
  #activePageIndex = 0
  #numTabs = 0
 
  get active_tab_index() {
    return this.#activeTabIndex
  }

  set active_tab_index(index) {
    this.#activeTabIndex = index
    this.emit('active-tab-index-changed', this.#activeTabIndex)
  }
  
  get num_tabs() {
    return this.#numTabs
  }
  
  set num_tabs(num) {
    this.#numTabs = num
  }

  // Use keyboard input to navigate between tabs and pages
  handleKey = (self, event) => {
    const key = (event.get_keyval()[1])
    const isNumeric = Gdk.KEY_1 <= key <= Gdk.KEY_9
    const isAlpha = Gdk.KEY_a <= key <= Gdk.KEY_z

    // Navigation keys are 1-indexed, but active tab index is 0-indexed
    // (Key 1 should switch to Tab 0)
    if (isNumeric) {
      const numkey = key - Gdk.KEY_0
      if (1 <= numkey <= 9 && numkey - 1 < this.#numTabs) {
        if (this.#activeTabIndex != numkey - 1) {
          this.#activeTabIndex = numkey - 1
          this.emit('active-tab-index-changed', this.#activeTabIndex)
        }
      }
    }
  }
}

const service = new DashService

export default service
