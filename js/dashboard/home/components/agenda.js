import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const DayEvent = () => {
  return Widget.CenterBox(
    { 
      class_name: 'day-event',
      hexpand: true,
      start_widget: Widget.Label({
        hpack: 'start',
        class_name: 'event-title',
        label: 'Work'
      }),
      end_widget: Widget.Label({
        hpack: 'end',
        class_name: 'event-time',
        label: '9:00 - 6:00'
      }),
    },
  )
}

const DayTask = () => {
  return Widget.Box(
    { 
      class_name: 'day-task',
      hexpand: true,
    },
    Widget.Label({
      class_name: 'task-title',
      label: 'Rewrite Cozy in ags'
    }),
  )
}

const Day = () => {
  const day_header = Widget.Box(
    { 
      class_name: 'day-header',
      hexpand: true,
    },
    Widget.Label({
      class_name: 'date',
      label: 'Thursday August 31'
    }),
  )

  return Widget.Box(
    {
      vertical: true,
    },
    day_header,
    DayEvent(),
    DayEvent(),
    DayEvent(),
    // DayTask(),
  )
}

const Agenda = () => {
  return Day() 
}

export default() => Widget.Box({
  class_name: 'agenda',
  vexpand: true,
  vertical: true,
  children: [ Agenda() ],
});
