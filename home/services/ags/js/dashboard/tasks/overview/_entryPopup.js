
// ▀█▀ ▄▀█ █▀ █▄▀   █▀▄▀█ █▀█ █▀▄   █▀█ █▀█ █▀█ █░█ █▀█
// ░█░ █▀█ ▄█ █░█   █░▀░█ █▄█ █▄▀   █▀▀ █▄█ █▀▀ █▄█ █▀▀

// Popup for modifying existing tasks and adding new tasks.
// this code is god awful right now

import TaskService from '../../../services/task.js'
import App from 'resource:///com/github/Aylur/ags/app.js'
import Gdk from "gi://Gdk";

/**
 * Fancy little text entry box.
 */
const EntryBox = ({ header = 'Header', ...rest}) => {
  const Header = Widget.Label({
    className: 'header',
    label: header,
    useMarkup: true,
  })

  const Entry = Widget.Entry({
    className: 'entry',
    ...rest,
  })

  return Widget.Fixed({
    className: 'entry-box',
    vexpand: true,
    attribute: Entry,
    setup(self) {
      self.put(Entry, 0, 0)
      self.put(Header, 10, -8)
    }
  })
}

const PopupHeader = Widget.Box({
  className: 'header',
  vertical: false,
  valign: 'start',
  spacing: 4,
  children: [
    Widget.Icon({
      icon: 'check-square'
    }),
    Widget.Label({
      label: TaskService.bind('popup-state').as(value => {
        if (value == 'add') {
          return 'Add task'
        } else if (value == 'modify') {
          return 'Modify task'
        }
      })
    })
  ]
})

const DescBind = Utils.merge([TaskService.bind('active-task'), TaskService.bind('popup-state')], (t, state) => {
  return state == 'add' ? '' : t.description || ''
})

const DueBind = Utils.merge([TaskService.bind('active-task'), TaskService.bind('popup-state')], (t, state) => {
  return state == 'add' ? '' : t.due || ''
})

const TagBind = Utils.merge([TaskService.bind('active-task'), TaskService.bind('popup-state')], (t, state) => {
  if (state == 'add') {
    return ''
  } else if (state == 'modify') {
    if (t.tags) {
      return t.tags[0] || ''
    } else {
      return ''
    }
  }
})

const ProjBind = Utils.merge([TaskService.bind('active-task'), TaskService.bind('popup-state')], (t, state) => {
  return state == 'add' ? '' : t.project || ''
})

const Description = EntryBox({
  header: 'Description',
  text: DescBind,
})

const Due = EntryBox({
  header: 'Due',
  text: DueBind,
})

const Tag = EntryBox({
  header: 'Tag',
  text: TagBind,
})

const Project = EntryBox({
  header: 'Project',
  text: ProjBind,
})

const ConfirmButton = Widget.Button({
  className: 'confirm',
  child: Widget.Label('Confirm'),
  onClicked: () => {
    const newTaskData = TaskService.active_task
    newTaskData.description = Description.attribute.get_text()
    newTaskData.due = Due.attribute.get_text()
    newTaskData.tags = [Tag.attribute.get_text()]
    newTaskData.project = Project.attribute.get_text()
    TaskService.execute(newTaskData)
  }
})

export default () => Widget.Window({
  name: 'dash-taskmod',
  keymode: 'on-demand',
  visible: false,
  child: Widget.Box({
    className: 'dash-task-mod',
    hexpand: true,
    vexpand: true,
    hpack: 'center',
    vpack: 'center',
    spacing: 20,
    vertical: true,
    visible: false,
    children: [
      PopupHeader,
      Description,
      Due,
      Tag,
      Project,
      ConfirmButton,
    ]
  })
})
  .on("key-press-event", (self, event) => {
    const key = (event.get_keyval()[1])
    switch (key) {
      case Gdk.KEY_Escape:
        App.closeWindow('dash-taskmod')
        return true
        break
    
      default:
        break
    }
  })
