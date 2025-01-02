
/* █▀▀ █▀▀ ▄▀█ █░░ █▀▀ █░░ █ */
/* █▄█ █▄▄ █▀█ █▄▄ █▄▄ █▄▄ █ */

/**
 * A service to interface with gcalcli. Also provides
 * helper functions and stores variables for the UI.
 */

/*************************************************
 * IMPORTS
 *************************************************/

import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'

/*************************************************
 * MODULE-LEVEL CONSTANTS
 *************************************************/

const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]

const MS_PER_DAY = 1000 * 60 * 60 * 24

const TMPFILE = '/tmp/ags/gcalcli'

/**
 * The user's UTC offset.
 *
 * date +%z returns "-0700" for UTC-7, so there's extra math to
 * convert that string to a usable integer.
 */
const USER_UTC_OFFSET = Number(Utils.exec("date +%z")) / 100

/*************************************************
 * CUSTOM DATATYPES
 *************************************************/

/**
 * Specifies how data is ordered when parsing
 * lines from gcalcli.
 */
const DataFields = [
  'startDate',
  'startTime',
  'endDate',
  'endTime',
  'description',
  'location',
  'calendar',
]

/*************************************************
 * SERVICE DEFINITION
 *************************************************/

class GcalcliService extends Service {
  static {
    Service.register (
      this,
      { /* Signals --------------------- */

        /**
         * Emitted by this service when event data for a date within the 
         * viewable range has changed.
         *
         * @purpose This tells the weekview UI that it can start drawing.
         *
         * @example
         * The week beginning 2024 5 May includes the dates 05/05 - 05/11.
         * When parsing events from gcalcli, once ALL events for a date in that
         * range have parsed, this signal is emitted. The signal is NOT
         * emitted for dates outside the viewable range.
         *
         * @param {string} the date that was updated (YYYY-MM-DD)
         * @param {array} contains events for that day
         */
        'viewable-day-updated': ['string', 'jsobject'],

        /**
         * Emitted by this service when the viewable range has changed.
         *
         * NOTE TO SELF:
         * If I make the UI bind to the viewrange property, I might be able to remove this
         *
         * @purpose Tells the UI that it needs to clear and redraw its widgets.
         */
        'viewrange-changed': ['jsobject'],
      },

      { /* Properties --------------------- */
        'viewrange': ['jsobject', 'r'],

        'today': ['string', 'r'],
      },
    )
  }

  /******************************
   * PRIVATE VARIABLES
   ******************************/

  /**
   * Container for all events parsed from gcalcli.
   * The keys are dates in the form YYYY-MM-DD.
   * The value for each key is an array of events associated with that date.
   *
   * @example
   *
   * #eventData = {
   *  '2024-05-02': [
   *    { ... }, // data for an event on may 2
   *    { ... }, // another event on may 2
   *  ],
   *  '2024-05-03': [
   *    { ... },
   *  ],
   * }
   */
  #eventData = {}

  /**
   * Array of currently viewable date strings (YYYY-MM-DD).
   * Always starts on a Sunday and always 7 elements long.
   */
  #viewrange = []

  #todayDateStr = this.getDateStr(new Date())
  
  /******************************
   * PUBLIC VARIABLES
   ******************************/

  /**
   * These are constants that the UI uses.
   * They are stored here to provide easy access for the UI, which is
   * distributed across multiple files.
   * TODO: Make these tied to rem instead of hardcoded pixel values
   */

  VIEWPORT_WIDTH_PX  = 1670
  VIEWPORT_HEIGHT_PX = 900
  
  HOURLABEL_WIDTH_PX = 24
  
  WIDGET_SPACING_PX = 6

  DATELABEL_HEIGHT_PX = 100
  
  DAY_WIDTH_PX = (this.VIEWPORT_WIDTH_PX / 7) - this.WIDGET_SPACING_PX
  
  HOUR_HEIGHT_PX = 90
  
  HOURS_VIEWABLE = this.VIEWPORT_HEIGHT_PX / this.HOUR_HEIGHT_PX
  
  MS_PER_HOUR = 60 * 60 * 1000
  // MS_PER_DAY = this.MS_PER_HOUR * 24
  
  DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  /******************************
   * PUBLIC FUNCTIONS
   ******************************/

  get viewrange() {
    return this.#viewrange
  }

  get today() {
    return this.#todayDateStr
  }

  /**
   * @param 
   */
  viewrangeRequestSet(d = new Date()) {
    this.#initViewrange()
  }

  requestRefresh() {
    this.#updateCache()
  }

  /**
   * @param {int} +1 if next week; -1 if previous week
   */
  viewrangeRequestIter(dir) {
    const newDayOffset = 7 * dir
    const newWeekStart = new Date(this.#viewrange[1])
    newWeekStart.setUTCHours(newWeekStart.getUTCHours() + (newDayOffset * 24))
    this.#initViewrange(newWeekStart)
  }

  requestData() {
    this.#readCache()
  }

  /**
   * @param {Date} a date object to convert
   * @return {Date} a date object converted to local time
   */
  isoDateToLocal(date) {
    date.setUTCHours(date.getUTCHours() + USER_UTC_OFFSET)
    return date
  }

  /**
   * Given a date object, return the DateString.
   * For this applicaiton, a DateString is the date in YYYY-MM-DD.
   */
  getDateStr(date) {
    return this.isoDateToLocal(date).toISOString().split('T')[0]
  }

  /******************************
   * PRIVATE FUNCTIONS
   ******************************/

  /**
   * Function to run on service initialization.
   */
  constructor() {
    log('gcalcliService', 'Constructing gcalcli service')
    super()
    this.#initViewrange()
  }

  /**
   * Initializes viewrange data.
   */
  #initViewrange(d = new Date()) {
    // Initialize the timestamp to the Sunday of the current week
    let ts = d.setDate(d.getDate() - d.getDay())

    this.#viewrange = []

    for (let i = 0; i < 7; i++) {
      const localDate = this.isoDateToLocal(new Date(ts))
      const dateStr = this.getDateStr(localDate)

      this.#viewrange.push(dateStr)

      this.emit('viewable-day-updated', dateStr, this.#eventData[dateStr] ? this.#eventData[dateStr] : [])

      ts += MS_PER_DAY
    }

    this.emit('viewrange-changed', this.#viewrange)
  }

  /**
   * Fetch data from cache file.
   */
  #readCache() {
    const cmd = `cat '${TMPFILE}'`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => this.#updateData(out))
      .catch(err => {
        // If file doesn't exist, go to update cache
        if (err.includes('No such file or directory')) {
          this.#updateCache()
        } else {
          print(`CalService: readCache: ${err}`)
        }
      })
  }

  /**
   * Fetch from gcalcli.
   * TODO: Store in tmpfile (if command successful)
   * TODO: ui needs to make a request to call this function
   */
  #updateCache() {
    log('gcalcliService', 'Updating cache')
    const cmd = "gcalcli agenda '1 month ago' 'in 1 months' --details calendar --details location --military --tsv"
    Utils.execAsync(`bash -c "${cmd}"`)
      .then(out => this.#updateData(out))
      .catch(err => {
        if (err.includes('expired or revoked.')) {
          console.log('Gcalcli: updateCache: Authentication expired!')
        } else {
          log('gcalcliService', `updateCache: ${err}`)
        }
      })
  }

  /**
   * Update event data with gcalcli TSV output.
   *
   * @param TSV output from gcalcli.
   **/
  #updateData(out) {
    log('gcalcliService', 'Updating data')
    this.#eventData = {}

    let thisDateStr = ''

    /* Remove the CSV header */
    out = out.slice(out.indexOf("\n") + 1);

    out.split('\n').forEach(eventLine => {
      const rawData = eventLine.split('\t')

      // Populate event data with information parsed from TSV
      const event = {}
      for (let i = 0; i < rawData.length; i++) {
        event[DataFields[i]] = rawData[i]
      }

      event.multiday = event.startDate != event.endDate

      // When we're done parsing events for a given day
      if (thisDateStr == '') {
        thisDateStr = event.startDate
      } else if (thisDateStr != event.startDate) {

        // If this day is within the viewrange
        if (this.#viewrange.indexOf(thisDateStr) != -1) {

          // Preprocessing: Sort by start time, then end time
          this.#eventData[thisDateStr] = this.#eventData[thisDateStr].sort(function(a, b) {
            if (a.startFH < b.startFH) return -1
            if (a.startFH > b.startFH) return 1
            if (a.endFH < b.endFH) return -1
            if (a.endFH > b.endFH) return 1
            return 0
          })

          // Tell UI to draw
          if (this.#eventData[thisDateStr].length > 0) {
            this.emit('viewable-day-updated', thisDateStr, this.#eventData[thisDateStr])
          }
        }

        thisDateStr = event.startDate
      }

      // Get unix epoch timetamps
      event.startTS = new Date(`${event.startDate} ${event.startTime}`).getTime()
      event.endTS = new Date(`${event.endDate} ${event.endTime}`).getTime()

      // Get fractional hours. 5:30PM -> 17.5; 9:15AM -> 9.25
      const startRe = /(\d\d):(\d\d)/.exec(event.startTime)
      event.startFH = Number(startRe[1]) + (Number(startRe[2]) / 60)
      
      const endRe = /(\d\d):(\d\d)/.exec(event.endTime)
      event.endFH = Number(endRe[1]) + (Number(endRe[2]) / 60)

      // Insert into database.
      if (this.#eventData[event.startDate] === undefined) {
        this.#eventData[event.startDate] = []
      }

      this.#eventData[event.startDate].push(event)
    })
  }
}

const service = new GcalcliService

export default service
