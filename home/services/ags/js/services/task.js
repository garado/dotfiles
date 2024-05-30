
// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄

// Defines interface between TaskWarrior and ags config.

import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'

/*************************************************
 * CUSTOM DATATYPES
/*************************************************/

function TagData(name) {
  this.name = name
  this.projects = {}
}

function ProjectData(tag, projectName) {
  this.tag = tag
  this.name = projectName
  this.tasks = {}
}

/*************************************************
 * SERVICE DEFINITION
/*************************************************/

class TaskService extends Service {
  static {
    Service.register (
      this,
      { // Signals
        'task-added':     ['string', 'string', 'jsobject'],
      },
      { // Properties
        /* Name of the currently selected tag. */
        'active-tag':     ['string', 'rw'],

        /* Name of the currently selected project. */
        'active-project': ['string', 'rw'],

        /* jsobject for currently selected task. */
        'active-task':    ['jsobject', 'rw'],

        /* Array of currently active tags. */
        'tags':           ['jsobject', 'r'],
        
        /* Array of projects for the currently active tag. */
        'projects-in-active-tag':           ['jsobject', 'r'],

        /* Makes #taskData available publicly. */
        'task-data':      ['jsobject', 'r'],

        'popup-state':    ['string', 'rw'],
      },
    )
  }

  constructor(taskdata) {
    super()
    this.#taskDataDirectory = taskdata
    this.#initData()

    Utils.monitorFile(this.#taskDataDirectory, (file, event) => {
      this.#initData()
    })
  }


  /*********************************
   * PRIVATE VARIABLES
   *********************************/

  #taskDataDirectory = ''
  #taskData = {}

  #activeTag = ''
  #activeProject = ''
  #activeTask = {}

  #tags = []
  #projectsInActiveTag = []
  
  #savedActiveTag = ''
  #savedActiveProject = ''

  #popupState = 'modify'

  /*********************************
   * GETTERS/SETTERS
   *********************************/

  get tags() {
    return this.#tags
  }

  get projectsInActiveTag() {
    return this.#projectsInActiveTag
  } 

  set projectsInActiveTag(projects) {
    this.#projectsInActiveTag = projects
    this.changed('projects-in-active-tag')
  } 
  
  set popup_state(state) {
    this.#popupState = state
    this.changed('popup-state')
  }
  
  get popup_state() {
    return this.#popupState
  }

  /**
   * Getter for task data.
   * This is invoked from the UI.
   */
  get task_data() {
    return this.#taskData
  } 
  
  /**
   * Getter for the active tag.
   * This is invoked from the UI.
   */
  get active_tag() {
    return this.#activeTag
  } 

  /**
   * Setter for the active tag.
   * This is invoked from the UI.
   */
  set active_tag(tag) {
    if (tag == this.#activeTag) return
    this.#activeTag = tag
    this.#activeProject = Object.keys(this.#taskData[tag].projects)[0]
    this.changed('active-tag')
    this.changed('active-project')

    // Since the active tag is changing, we should also
    // change the 'projectsInActiveTag' property
    this.#projectsInActiveTag = Object.keys(this.#taskData[tag].projects)
    this.changed('projects-in-active-tag')

    this.#fetchTasks()
  } 
  
  /**
   * Getter for the active project.
   * This is invoked from the UI.
   */
  get active_project() {
    return this.#activeProject
  } 
  
  /**
   * Setter for the active project.
   * This is invoked from the UI.
   */
  set active_project(project) {
    if (project == this.#activeProject) return
    this.#activeProject = project
    this.changed('active-project')
    this.#fetchTasks()
  } 

  get active_task() {
    return this.#activeTask
  }
  
  set active_task(t) {
    this.#activeTask = t
    this.changed('active-task')
  }

  /*********************************
   * PUBLIC FUNCTIONS
   *********************************/

  /**
   * Executes `task mod` or `task add`.
   */
  execute(tdata) {
    let cmd = ''
    if (this.#popupState == 'add') {
      cmd  = `task rc.data.location="${this.#taskDataDirectory}" add `
      cmd += `tag:"${tdata.tags[0]}" project:"${tdata.project}" due:"${tdata.due}" `
      cmd += `description:"${tdata.description}" `
    } else if (this.#popupState == 'modify') {
      cmd  = `task rc.data.location="${this.#taskDataDirectory}" uuid:"${tdata.uuid}" mod `
      cmd += `tag:"${tdata.tags[0]}" project:"${tdata.project}" due:"${tdata.due}" `
      cmd += `description:"${tdata.description}" `
    }
  
    Utils.execAsync(`bash -c '${cmd}'`)
      .then(out => print(out))
      .catch(err => log)
  }


  /**
   * Executes `task delete` for the currently active task.
   */
  delete() {
    if (this.#activeTask.uuid) {
      const cmd = `echo 'yes' | task rc.data.location="${this.#taskDataDirectory}" delete ${this.#activeTask.uuid}`
      Utils.execAsync(`bash -c '${cmd}'`)
        .then(out => print(out))
        .catch(err => log)
    }
  }

  done() {
    if (this.#activeTask.uuid) {
      const cmd = `echo 'yes' | task rc.data.location="${this.#taskDataDirectory}" done ${this.#activeTask.uuid}`
      Utils.execAsync(`bash -c '${cmd}'`)
        .then(out => print(out))
        .catch(err => log)
    }
  }

  undo() {

  }

  /*********************************
   * PRIVATE FUNCTIONS
   *********************************/

  #initData() {
    this.#initTags()
  }

  /**
   * @brief Fetch initial list of tags from TaskWarrior.
   **/
  #initTags() {
    const cmd = `task rc.data.location='${this.#taskDataDirectory}' status:pending _unique tags`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        const tags = out.split('\n')

        this.#tags = tags
        this.changed('tags')

        tags.map(tagName => {
          this.#taskData[tagName] = new TagData(tagName)

          if (this.#activeTag == '') {
            this.#activeTag = tagName
          }

          this.#initProjects(tagName)
        })

      })
      .catch(err => print(err))
  }

  /**
  * @brief Fetch projects for a given tag.
  **/
  #initProjects(tag) {
    const cmd = `task rc.data.location='${this.#taskDataDirectory}' tag:'${tag}' status:pending _unique project`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        const projects = out.split('\n')
        projects.map(projectName => {

          if (this.#activeTag == tag && this.#activeProject == '') {
            this.#activeProject = projectName
            this.projectsInActiveTag = projects
          }

          this.#taskData[tag].projects[projectName] = new ProjectData(tag, projectName)
          this.#fetchTasks(tag, projectName)
        })
      })
      .catch(err => print(err))
  }

  /**
  * @brief Fetch tasks for the currently active tag and project.
  **/
  #fetchTasks(t = this.#activeTag, p = this.#activeProject) {
    const p_cmd = p == '(none)' ? '' : p
    const cmd = `task status:pending tag:'${t}' project:'${p_cmd}' rc.data.location='${this.#taskDataDirectory}' export`

    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        const tasks = JSON.parse(out) // array of objects
        this.#taskData[t].projects[p].tasks = tasks
        this.emit('task-added', t, p, tasks)
      })
      .catch(err => print(err))
  }
}

const service = new TaskService(UserConfig.task.directory)

export default service
