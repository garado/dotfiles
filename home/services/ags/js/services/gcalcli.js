
// █▀▀ █▀▀ ▄▀█ █░░ █▀▀ █░░ █
// █▄█ █▄▄ █▀█ █▄▄ █▄▄ █▄▄ █

import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'

class GcalcliService extends Service {
  static {
    Service.register (
      this,
      { // Signals
        // '': [''],
      },
      { // Properties
      },
    )
  }

  // Private variables
  // #contribData = []

  constructor() {
    super()

    // const url = `https://github-contributions.vercel.app/api/v1/${username}`
    // Utils.execAsync(['curl', url])
    //   .then(x => {
    //   })
    //   .catch(console.error)
  }
}

const service = new GcalcliService

export default service
