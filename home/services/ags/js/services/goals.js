
// █▀▀ █▀█ ▄▀█ █░░ █▀
// █▄█ █▄█ █▀█ █▄▄ ▄█

/**
 * Interfaces with goals contained within Taskwarrior.
 * 
 * Similar to the other Task service, but this takes a different enough
 * approach to storing and sorting data that it made more sense to
 * create an entirely new service.
 *
 * The Task service sorts strictly by tag and project:
 *
 * task.data = {
 *    tagName1: {
 *      projectName1: [], // array of tasks
 *      projectName2: [], // array of tasks
 *    },
 *    tagName2: {
 *      projectName3: [], // array of tasks
 *      projectName4: [], // array of tasks
 *    }
 * }
 *
 * The Goal service organizes data by hierarchically using task 
 * dependencies. The end result is a tree where each node can contain 
 * any number of child nodes.
 *
 * Each tag represents a broad goal category, and each tag gets its
 * own tree.
 *
 * goal.data = {
 *    tagName1: rootNodeA,
 *    tagName2: rootNodeB,
 * }
 *
 * `task export` returns all tasks in a flat unsorted array, so this
 * service processes the array to rebuild the hierarchy.
 */

import Gio from 'gi://Gio'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'

/*************************************************
 * MODULE-LEVEL VARIABLES
/*************************************************/

/**
 * The user's UTC offset.
 *
 * date +%z returns "-0700" for UTC-7, so there's extra math to
 * convert that string to a usable integer.
 */
const USER_UTC_OFFSET = Number(Utils.exec("date +%z")) / 100

/*************************************************
 * SERVICE DEFINITION
/*************************************************/

class GoalService extends Service {
  static {
    Service.register (
      this,
      { // Signals
        'render-goals':     ['jsobject'],
        'request-sidebar':  ['boolean'],
      },
      { // Properties
        /* Makes #taskData available publicly. */
        'data':      ['jsobject', 'r'],

        'sidebar-data': ['jsobject', 'rw'],
        
        'sidebar-breadcrumbs': ['jsobject', 'rw'],

        'ui-settings': ['jsobject', 'rw'],
      },
    )
  }
  
  /***************************************
   * PRIVATE VARIABLES
   ***************************************/

  // Private variables
  #dataDirectory = ''

  #data = {}

  #uiSettings = {
    completed: true,
    pending: true,
    developed: true,
    undeveloped: true,
  }

  /**
   * Initialize with some dummy data
   */
  #defaultSidebarData = {
    isDefault: true,
    parent: { description: 'Placeholder' },
    children: [],
    description: 'Placeholder',
  }

  #sidebarData = this.#defaultSidebarData

  /**
   * The sidebar has a navigation thingy
   */
  #sidebarBreadcrumbs = []

  /***************************************
   * PUBLIC FUNCTIONS
   ***************************************/

  get data() {
    return this.#data
  }

  get ui_settings() {
    return this.#uiSettings
  }

  set_settings (propertyName, state) {
    this.#uiSettings[propertyName] = state
    this.emit('render-goals', this.#data)
  }

  /* Sidebar data -------------------- */
  get sidebar_data() {
    return this.#sidebarData
  }

  set sidebar_data(data) {
    this.#sidebarData = data
    this.notify('sidebar-data')
  }

  resetSidebarData() {
    this.#sidebarData = this.#defaultSidebarData
    this.notify('sidebar-data')
  }
  
  /* Breadcrumbs -------------------- */
  get sidebar_breadcrumbs() {
    return this.#sidebarBreadcrumbs
  }
  
  set sidebar_breadcrumbs(crumb) {
    this.#sidebarBreadcrumbs = crumb
    this.notify('sidebar-breadcrumbs')
  }

  pushBreadcrumb(crumb) {
    this.#sidebarBreadcrumbs.push(crumb)
    this.notify('sidebar-breadcrumbs')
  }

  followBreadcrumbs(dir) {
    if (dir < 0) {
      this.#sidebarData = this.#sidebarBreadcrumbs.pop()
      this.notify('sidebar-data')
      this.notify('sidebar-breadcrumbs')
    }
  }

  popBreadcrumbs() {
    this.#sidebarBreadcrumbs.pop()
  }

  /**
   * This function is called when a goal is clicked.
   * It emits the 'request-sidebar' signal which is caught by
   * the Overview widget, which will reveal the Sidebar widget.
   */
  requestSidebar(state) {
    this.emit('request-sidebar', state)
  }

  toggleStatus(goal) {
    const cmd = `task ${goal.uuid} mod status:${goal.status == 'pending' ? 'completed' : 'pending'}`
    // print(cmd)
  }

  /**
   * Turn a string given in TaskWarrior's weird format to a date object.
   * The TaskWarrior format is:
   *    YYYYMMDDThhmmssZ
   * This function first converts it to
   *    YYYY-MM-DDThh:mm:ssZ
   * And from there it can be directly turned into a date object.
   *
   * TODO the task service uses this too; put this function in a shared file
   */
  tasktimeToDateObj(tasktime) {
    const re = /(\d\d\d\d)(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)Z/.exec(tasktime)
    const convert = `${re[1]}-${re[2]}-${re[3]}T${re[4]}:${re[5]}:${re[6]}Z`
    return new Date(convert)
  }

  /**
   * Convert a date object to the form YYYY-MM-DD.
   */
  dateToYYYYMMDD(date) {
    date.setUTCHours(date.getUTCHours() + USER_UTC_OFFSET)
    return date.toISOString().split('T')[0]
  }

  /**
   * Convert a TaskWarrior time string to a YYYY-MM-DD string.
   */
  tasktimeToYYYYMMDD(tasktime) {
    const date = this.tasktimeToDateObj(tasktime)
    return this.dateToYYYYMMDD(date)
  }

  /***************************************
   * PRIVATE FUNCTIONS
   ***************************************/

  constructor(taskdata) {
    super()

    this.#dataDirectory = taskdata

    this.#fetchGoals()

    // NEED TO FIX: 
    // this WILL BREAK if you have too many files changed at once
    // figure out a way to get it to not spam?
    Utils.monitorFile(this.#dataDirectory, (file, event) => {
      this.#fetchGoals()
    })
  }

  /**
   * Fetch all goals and store them.
   */
  #fetchGoals() {
    const cmd = `task status:pending or status:completed rc.data.location='${this.#dataDirectory}' export`

    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        this.#data = {}
        const goals = JSON.parse(out)
        goals.forEach(g => this.#insertGoal(g))

        // TODO sort by due date, then completion percentage, then description

        this.emit('render-goals', this.#data)
      })
      .catch(err => print(`GoalService: fetchGoals: ${err}`))
  }

  /**
   * Insert goals into tree.
   */
  #insertGoal(goal) {
    if (!goal.tags || goal.tags.length == 0) {
      print(`GoalService: insertGoal: Goal "${goal.description}" has no associated tag`)
      return
    }

    const category = goal.tags[0]

    if (!goal.depends) goal.depends = []
    goal.children = []

    // Check empty case
    if (this.#data[category] == undefined) {
      this.#data[category] = {
        description: 'Root',
        children: [],
        depends: [],
        uuid: '',
      }

      goal.parent = this.#data[category]
      goal.parent.children.push(goal)

      return
    }

    // Is it a child of any existing goals?
    const parent = this.#isDependency(goal)

    if (parent) {
      // If it is: Insert into the parent.
      goal.parent = parent
      parent.children.push(goal)
      return
    } else {
      // If is it not: Insert at top level.
      goal.parent = this.#data[category]
      this.#data[category].children.push(goal)
    }

    // Is it a parent of any existing goals?
    const foundChildren = []
    this.#findDependencies(goal, foundChildren)

    if (foundChildren) {
      // If the current goal is a parent:
      // Remove the found child from its existing parent.
      foundChildren.forEach(child => {
        const indexWithinPreviousParent = child.parent.children.indexOf(child)
        child.parent.children.splice(indexWithinPreviousParent, 1)

        // Insert the found child into the current goal.
        child.parent = goal
        goal.children.push(child)
      })
    }
  }

  /**
   * Check if the given goal is a child of any other goals that
   * were already inserted.
   */
  #isDependency(goal, nodeToSearch) {
    if (nodeToSearch == undefined) {
      nodeToSearch = this.#data[goal.tags[0]]
    }

    if (nodeToSearch.depends.includes(goal.uuid)) {
      return nodeToSearch
    } else {
      for (let i = 0; i < nodeToSearch.children.length; i++) {
        const childNode = nodeToSearch.children[i]
        const parent = this.#isDependency(goal, childNode)
        if (parent) return parent
      }
      return null
    }
  }

  /**
   * Check if the given goal is the parent of any other goals
   * that were already inserted.
   */
  #findDependencies(goal, foundChildren, nodeToSearch) {
    if (nodeToSearch == undefined) {
      nodeToSearch = this.#data[goal.tags[0]]
    }

    if (goal.uuid == nodeToSearch.uuid) return

    if (goal.depends.includes(nodeToSearch.uuid)) {
      foundChildren.push(nodeToSearch)
    }

    for (let i = 0; i < nodeToSearch.children.length; i++) {
      const searchChild = nodeToSearch.children[i]
      this.#findDependencies(goal, foundChildren, searchChild)
    }
  }

  /**
   * Recursively print hierarchy for a goal.
   */
  #printGoal(goal, offset = 0) {
    print(`${' '.repeat(offset * 2)} - ${goal.status == 'completed' ? 'DONE: ' : ''}${goal.description}`)
    goal.children.forEach(child => this.#printGoal(child, offset + 1))
  }

  /**
   * Print the hierarchy for all categories.
   */
  #printAll(node = this.#data) {
    const categories = Object.keys(node)

    categories.forEach(category => {
      print(category.toUpperCase())
      const rootNode = this.#data[category]
      this.#printGoal(rootNode)
    })
  }
}

const service = new GoalService(UserConfig.goals.directory)

export default service
