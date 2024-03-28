
// ▀█▀ ▄▀█ █▀ █▄▀ █░█░█ ▄▀█ █▀█ █▀█ █ █▀█ █▀█
// ░█░ █▀█ ▄█ █░█ ▀▄▀▄▀ █▀█ █▀▄ █▀▄ █ █▄█ █▀▄

import Utils from 'resource:///com/github/Aylur/ags/utils.js'
import UserConfig from '../../userconfig.js'

/*************************************************
 * CUSTOM DATATYPES
/*************************************************/

/* taskData
 * {
 *    'ags':
 *
 *    'personal':
 * }
 */

function TagData(name) {
  this.name = name
  this.projects = {}
}

function ProjectData(tag, name) {
  this.tag = tag
  this.name = name
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
        'tag-added': ['string'],
        'tag-removed': ['jsobject'],
        'project-added': ['string', 'string'],
        'project-removed': ['string', 'string'],
        'task-added': ['jsobject'], // type: list
        'task-removed': ['jsobject'],
      },
      { // Properties
        'active-tag': ['string', 'rw'],
        'active-project': ['string', 'rw'],
        'active-projects': ['jsobject', 'r'],
        'task-data': ['jsobject', 'r'],
      },
    )
  }

  constructor(taskdata) {
    super()
    this.#taskDataDirectory = taskdata
    this.#initData()
  }

  // Private variables
  #taskDataDirectory = ''
  #taskData = {}

  #activeTag = ''
  #activeProject = ''

  // Getters and setters for private variables

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
    this.changed('active-tag')
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
    this.#activeProject = project
    this.changed('active-project')
  } 

  get active_project() {
    return this.#taskData[this.#activeTag].projects[this.#activeProject]
  }
  
  get projects() {
    return this.#taskData[this.#activeTag].projects
  } 

  // Private functions

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
    const cmd = `task tags rc.data.location='${this.#taskDataDirectory}'`
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
    const cmd = `task tag:${tag} projects rc.data.location='${this.#taskDataDirectory}' | head -n -2`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        // TODO capture group to remove parens
        const re = /\(?[a-z]+\)?/
        out = out.split('\n').splice(2)
        out.map(pstr => {
          const project = re.exec(pstr)[0]

          // Signals
          if (this.#activeTag == tag && this.#activeProject == '') {
            this.#activeProject = project
          }
          this.emit('project-added', tag, project)

          this.#taskData[tag].projects[project] = new ProjectData(tag, project)
          this.#initTasks(tag, project)
        })
      })
      .catch(err => print(err))
  }

  /**
  * @brief Fetch tasks for a given tag and project.
  **/
  #initTasks(t, p) {
    // const cmd = `task tag:'${t}' project:'${p}' export`
    // Utils.execAsync(['bash', '-c', cmd])
    //   .then(out => {
    //     out = JSON.parse(out)
    //     // this.emit('tasks-added', tag, project, out)
    //     // this.#taskData[t][p].tasks = out
    //   })
    //   .catch(err => print(err))
  }
}

// const service = new TaskService(UserConfig.task.directory)
const service = new TaskService(UserConfig.goals.directory)

export default service
