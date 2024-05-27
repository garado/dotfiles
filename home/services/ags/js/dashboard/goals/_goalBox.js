
// █▀▀ █▀█ ▄▀█ █░░   █▄▄ █▀█ ▀▄▀
// █▄█ █▄█ █▀█ █▄▄   █▄█ █▄█ █░█

import GoalService from '../../services/goals.js'

function CreateGoal(data, isBigPicture) {
  const title = Widget.Label({
    className: isBigPicture ? 'big-picture-title' : 'title',
    vpack: 'start',
    xalign: 0,
    wrap: true,
    label: data.status == 'completed' ? `<s>${data.description}</s>`: data.description,
    useMarkup: true,
  })

  const targetDate = Widget.Box({
    className: 'due',
    spacing: 4,
    setup: self => {
      if (!data.due) return
      self.children = [
        Widget.Icon({
          vpack: 'end',
          icon: 'clock',
        }),
        Widget.Label({
          vpack: 'end',
          label: GoalService.tasktimeToYYYYMMDD(data.due)
        }),
      ]
    }
  })

  const progress = Widget.Box({
    className: 'progress',
    hpack: 'end',
    spacing: 4,
    setup: self => {
      const total = data.children.length
      if (total == 0) return

      // Count completed subgoals
      const completed = data.children.filter(x => x.status == 'completed').length

      self.children = [
        Widget.Icon({
          vpack: 'end',
          icon: 'check-circle',
        }),
        Widget.Label({
          vpack: 'end',
          label: `${completed}/${total}`,
        }),
      ]
    }
  })

  const goal = Widget.CenterBox({
    className: 'interior',
    vertical: true,
    startWidget: title,
    endWidget: Widget.CenterBox({
      startWidget: targetDate,
      endWidget: progress,
    }),
  })
  
  const stack = Widget.Overlay({
    child: Widget.Box({
      heightRequest: isBigPicture ? 350 : 200,
      widthRequest: isBigPicture ? 520 : 320,
      className: 'imagebox',
      css: `background-image: url('${data.imgpath}')`,
    }),
    overlays: [
      goal,
    ]
  })

  return Widget.EventBox({
    classNames: data.status == 'completed' ? ['goalbox', 'completed'] : ['goalbox'],
    child: stack,
    onPrimaryClick: () => {
      if (data.uuid != GoalService.sidebar_data.uuid) {
        GoalService.sidebar_breadcrumbs = []
        GoalService.sidebar_data = data
        GoalService.requestSidebar(true)
      }
    }
  })
}

export default CreateGoal

