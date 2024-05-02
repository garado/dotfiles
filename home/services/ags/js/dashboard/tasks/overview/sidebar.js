
// █▀ █ █▀▄ █▀▀ █▄▄ ▄▀█ █▀█
// ▄█ █ █▄▀ ██▄ █▄█ █▀█ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import TaskService from '../../../services/task.js'

/***************************************
 * TAGS
/***************************************/

const CreateTagEntry = (tag) => {
  return Widget.Button({
    hpack: 'start',
    attribute: { tag: tag },
    hexpand: true,
    child: Widget.Box({
      vertical: false,
      spacing: 10,
      children: [
        Widget.Label({
          className: 'active-indicator',
          label: TaskService.bind('activeTag').as(a => `${a === tag ? 'ꞏ' : ''}`),
        }),
        Widget.Label(tag),
      ]
    }),
    onClicked: function() {
      TaskService.active_tag = tag
    }
  })
}

const TagList = Widget.Box({
  vertical: true,
  attribute: { hasPlaceholder: true },
  children: [ 
    Widget.Label({
      className: 'placeholder-text',
      hpack: 'start',
      label: 'No tags.'
    })
  ],
})

TagList.hook(TaskService, (self, tag) => {
  if (tag === undefined) return

  if (self.attribute.hasPlaceholder == true) {
    self.attribute.hasPlaceholder = false
    self.remove(self.children[0])
  }

  self.add(CreateTagEntry(tag))
}, 'tag-added')

// TODO hook tags-removed


/***************************************
 * PROJECTS
/***************************************/

const CreateProjectEntry = (tag, project) => {
  return Widget.Button({
    hpack: 'start',
    hexpand: true,
    attribute: { tag: tag, project: project },
    child: Widget.Box({
      vertical: false,
      spacing: 10,
      children: [
        Widget.Label({
          className: 'active-indicator',
          label: TaskService.bind('activeProject').as(p => `${p === project ? 'ꞏ' : ''}`),
        }),
        Widget.Label(project),
      ]
    }),
    onClicked: function() {
      TaskService.active_project = project
    }
  })
}

const ProjectList = Widget.Box({
  vertical: true,
  vexpand: true,
  attribute: { hasPlaceholder: true },
  children: [ 
    Widget.Label({
      className: 'placeholder-text',
      hpack: 'start',
      label: 'No projects.'
    })
  ],
})

/**
 * Hook to add projects to project list UI when a new project is added.
 * Called once per new project.
 */
// ProjectList.hook(TaskService, (self, tag, project) => {
//   if (tag === undefined || project === undefined) return
//
//   // Should only show projects for the currently active tag
//   if (tag != TaskService.active_tag) return
//
//   if (self.attribute.hasPlaceholder == true) {
//     self.attribute.hasPlaceholder = false
//     self.remove(self.children[0])
//   }
//
//   self.add(CreateProjectEntry(tag, project))
// }, 'project-added')

/**
 * Hook to add projects to project list UI when a new tag is
 * selected.
 * NOTE: Hooks are run at creation, so need to ignore the first
 * invocation.
 */
ProjectList.hook(TaskService, self => {
  if (TaskService.active_tag == undefined) return

  if (self.attribute.hasPlaceholder == true) {
    self.attribute.hasPlaceholder = false
    self.remove(self.children[0])
  }

  const projects = TaskService.projectsInActiveTag

  self.children = projects.map(project => CreateProjectEntry(TaskService.active_tag, project))

}, 'notify::active-tag')

/*************************************************/

const Header = (text) => Widget.Label({
  className: 'sidebar-header',
  hpack: 'start',
  label: text
})

export default () => Widget.Box({
  className: 'task-sidebar',
  vertical: true,
  hexpand: false,
  vexpand: true,
  homogeneous: false,
  spacing: 30,
  children: [
    Widget.Box({
      spacing: 10,
      vertical: true,
      children: [
        Header('Tags'),
        TagList,
      ]
    }),
    Widget.Box({
      spacing: 10,
      vertical: true,
      children: [
        Header('Projects'),
        ProjectList,
      ],
    }),
  ]
})
