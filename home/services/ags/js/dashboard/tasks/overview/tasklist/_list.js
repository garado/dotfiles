
// ▀█▀ ▄▀█ █▀ █▄▀   █░░ █ █▀ ▀█▀
// ░█░ █▀█ ▄█ █░█   █▄▄ █ ▄█ ░█░

// A list of pending tasks within the currently selected tag/project.

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import TaskService from '../../../../services/task.js'

/**
 * Create a single task entry button.
 */
const CreateTaskEntry = (data) => {
  const task = Widget.Box({
    spacing: 4,
    hexpand: true,
    className: data.urgency > 6 ? 'urgent' : '',
    children: [
      Widget.Label({
        className: 'active-indicator',
        label: TaskService.bind('activeTask').as(task => `${task.uuid === data.uuid ? 'ꞏ' : ''}`),
      }),
      Widget.Label({
        className: 'description',
        hexpand: true,
        hpack: 'start',
        label: data.description,
      }),
      Widget.Label({
        className: 'due',
        hexpand: true,
        hpack: 'end',
        label: data.due ? data.due : 'no due date',
      })
    ]
  })

  return Widget.Button({
    className: 'item',
    hexpand: true,
    child: task,
    attribute: data,

    setup: (self) => {
      self.connect("focus", () => {
        TaskService.active_task = self.attribute
      })
    }
  })
}

const placeholder = Widget.Label({
  class_name: 'placeholder-text',
  label: 'No tasks found.'
})

const TaskBox = Widget.Box({
  className: 'tasklist',
  hexpand: true,
  vexpand: true,
  vertical: true,
  spacing: 8,
  attribute: { hasPlaceholder: true },
  children: [ 
    placeholder,
  ],
})

/**
  * Invoked whenever a new task is added for the currently active tag and
  * project.
  */
TaskBox.hook(TaskService, (self, tag, project, task) => {
  if (tag == undefined || project == undefined || task == undefined) return
  if (tag != TaskService.active_tag && project != TaskService.active_project) return

  // Remove placeholder when necessary
  if (self.attribute.hasPlaceholder == true) {
    self.attribute.hasPlaceholder = false
    self.remove(placeholder)
  }

  const newTasks = task.map(t => CreateTaskEntry(t))
  self.children = newTasks
}, 'task-added')

export default () => {
  return TaskBox
}
