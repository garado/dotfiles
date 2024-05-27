
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
        'tag-added':      ['string'],
        'project-added':  ['string', 'string'],
        'task-added':     ['string', 'string', 'jsobject'],
        
        // 'tag-removed': ['jsobject'],
        // 'project-removed': ['string', 'string'],
        // 'task-removed': ['jsobject'],
      },
      { // Properties
        /* Name of the currently selected tag. */
        'active-tag':     ['string', 'rw'],

        /* Name of the currently selected project. */
        'active-project': ['string', 'rw'],

        /* jsobject for currently selected task. */
        'active-task':    ['jsobject', 'rw'],

        'projects-in-active-tag': ['jsobject', 'r'],

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

  // TODO make this private
  #popupState = 'modify'

  // Getters and setters for private variables

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

  // get projects-in-active-tag() {
  //   return this.#taskData[this.#activeTag].projects[this.#activeProject]
  // }

  get projects_in_active_tag() {
    const projects = this.#taskData[this.#activeTag].projects
    return Object.keys(projects)
  } 

  /*********************************
   * PUBLIC FUNCTIONS
   *********************************/

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
      .then(err => log)
  }


  /*********************************
   * PRIVATE FUNCTIONS
   *********************************/

  #initData() {
    this.#initTags()
  }

  /**
   * @brief Fetch initial list of tags from TaskWarrior.
   *
   * Sample command output below.
   *
   * ```
   * Tag      Count
   * -------- -----
   * ags          4
   * personal     5
   * ```
   *
   * This function extracts 'ags' and 'personal' from the
   * output text.
   **/
  #initTags() {
    const cmd = `task tags status:pending rc.data.location='${this.#taskDataDirectory}'`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        const re = /[a-z]+/

        const tags = out.split('\n').slice(2)

        tags.map(tagstr => {
          const tagName = re.exec(tagstr)[0]
          this.#taskData[tagName] = new TagData(tagName)

          // Signals
          if (this.#activeTag == '') {
            this.#activeTag = tagName
          }
          this.emit('tag-added', tagName);

          this.#initProjects(tagName)
        })

      })
      .catch(err => print(err))
  }

  /**
  * @brief Fetch projects for a given tags.
  **/
  #initProjects(tag) {
    const cmd = `task tag:'${tag}' projects rc.data.location='${this.#taskDataDirectory}' | head -n -2`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        // TODO capture group to remove parens
        const re = /\(?[a-z]+\)?/
        out = out.split('\n').splice(2)
        out.map(pstr => {
          const projectName = re.exec(pstr)[0]

          if (this.#activeTag == tag && this.#activeProject == '') {
            this.#activeProject = projectName
          }

          this.#taskData[tag].projects[projectName] = new ProjectData(tag, projectName)
          this.emit('project-added', tag, projectName)
          this.#fetchTasks(tag, projectName)
        })
      })
      .catch(err => print(err))
  }

  /**
  * @brief Fetch tasks for the currently active tag and project.
  **/
  #fetchTasks(t = this.#activeTag, p = this.#activeProject) {
    // const t = this.#activeTag
    // const p = this.#activeProject

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
