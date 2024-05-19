
// █▀▀ █ ▀█▀ █░█ █░█ █▄▄   █▀ █▀▀ █▀█ █░█ █ █▀▀ █▀▀
// █▄█ █ ░█░ █▀█ █▄█ █▄█   ▄█ ██▄ █▀▄ ▀▄▀ █ █▄▄ ██▄

import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'

const username = UserConfig.github.username

class GithubService extends Service {
  static {
    Service.register (
      this,
      { // Signals
        'contrib-data-changed': ['jsobject'],
        'contrib-count-changed': ['int'],
      },
      { // Properties
      },
    )
  }

  // Private variables
  #contribData = []
  #contribCount = 0

  constructor() {
    super()

    // BUG: using utils.fetch causes ags to hang - not sure why
    const url = `https://github-contributions.vercel.app/api/v1/${username}`
    Utils.execAsync(['curl', url])
      .then(x => {
        const out = JSON.parse(x)

        // API returns data for the entire year including days 
        // in the future, so remove the last (365 - day of year)
        // entries.
        const daysLeftInYear = 365 - Number(Utils.exec("date +%j"))
        this.#contribData = out.contributions.slice(daysLeftInYear)
        this.emit('contrib-data-changed', this.#contribData)

        // Count total contribs
        this.#contribCount = 0
        out.years.forEach(y => this.#contribCount += y.total );
        this.emit('contrib-count-changed', this.#contribCount)
      })
      .catch(err => print('GithubService: Failed to get contribution data'))
  }
}

const service = new GithubService

export default service
