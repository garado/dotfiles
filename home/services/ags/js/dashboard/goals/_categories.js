
// █▀▀ █▀█ ▄▀█ █░░   █▀▀ ▄▀█ ▀█▀ █▀▀ █▀▀ █▀█ █▀█ █▄█
// █▄█ █▄█ █▀█ █▄▄   █▄▄ █▀█ ░█░ ██▄ █▄█ █▄█ █▀▄ ░█░

import GoalService from '../../services/goals.js'
import GoalBox from './_goalBox.js'

function CategoryContainer (category, isBigPicture = false) {
  /**
   * The category header.
   */
  const Label = Widget.Label({
    className: isBigPicture ? 'big-picture-header' : 'category-header',
    label: isBigPicture ? 'The big picture' : category,
    xalign: 0,
    wrap: true,
    maxWidthChars: 20,
  })

  /**
   * Container for the goals within this category.
   */
  const GoalboxList = Widget.Box({
    vertical: false,
    spacing: 12,
    setup: self => {
      const root = GoalService.data[category].children

      // Apply filters.
      if (isBigPicture) {
        self.children = root.map(goal => GoalBox(goal, isBigPicture))
      } else {
        self.children = root.reduce(function(filteredArray, goal) {
          const statusMatch = (GoalService.ui_settings.completed && goal.status == 'completed') ||
                              (GoalService.ui_settings.pending && goal.status == 'pending') ||
                              (!GoalService.ui_settings.completed && !GoalService.ui_settings.pending)

          const stateMatch = (GoalService.ui_settings.developed && goal.due && goal.imgpath && goal.why) ||
                             (GoalService.ui_settings.undeveloped && (!goal.due || !goal.imgpath || !goal.why)) ||
                             (!GoalService.ui_settings.developed && !GoalService.ui_settings.undeveloped) ||
                             (GoalService.ui_settings.developed && GoalService.ui_settings.undeveloped)

          if (statusMatch && stateMatch) {
            filteredArray.push(GoalBox(goal, isBigPicture))
          }

          return filteredArray
        }, [])
      }
    }
  })

  const Container = Widget.Scrollable({
    className: 'scroll',
    hscroll: 'always',
    vscroll: 'never',
    hexpand: true,
    vexpand: false,
    overlayScrolling: false,
    child: GoalboxList,
  })

  return Widget.Box({
    spacing: 4,
    vertical: true,
    children: [
      Label,
      Container,
    ]
  })
}

export default () => Widget.Box({
  vertical: true,
  spacing: 30,
  setup: self => self.hook(GoalService, (self, data) => {
    if (data == undefined) return

    self.children.forEach(x => x.destroy())

    self.add(CategoryContainer('_bigpicture', true))

    const categories = Object.keys(data)
    categories.forEach(category => {
      if (category != '_bigpicture') {
        self.add(CategoryContainer(category))
      }
    })
  }, 'render-goals')
})

