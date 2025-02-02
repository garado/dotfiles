
/* █▄▄ ▄▀█ █▀█ */
/* █▄█ █▀█ █▀▄ */

/* Nice minimal bar. */

import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'

const battery = await Service.import('battery')
const audio = await Service.import('audio')

log('program', 'Entering bar.js')

/*************************************
 * WORKSPACE
 *************************************/

const Workspaces = () => {
  const activeId = Hyprland.active.workspace.bind('id');
  const array = Array.from({length: 9}, (_, i) => i + 1)

  return Widget.Box({
    vertical: true,
    spacing: 8,
    hpack: 'center',
    className: 'workspaces',
    children: array.map(i => Widget.EventBox({
      onClicked: () => Hyprland.messageAsync(`dispatch workspaces ${i}`),
      child: Widget.Label(`${i}`),
      attribute: i,

      /* classNames doesn't seem to play well with reactive elements, 
       * so I have to chain binds */
      setup: self => self
        /* Apply 'not-empty' class if this workspace has clients */
        .bind('prop', Hyprland, 'workspaces', ws => {
          const notEmpty = ws.find(x => x.name == self.attribute)
          self.toggleClassName('not-empty', notEmpty != undefined)
        })

        /* Apply 'focused' class if this is the active workspace */
        .bind('prop', Hyprland.active.workspace, 'id', id => {
          self.toggleClassName('focused', id === self.attribute)
        })
    }))
  });
}

/*************************************
 * CLOCK
 *************************************/

const Time = () => {
  const hour = Variable('', {
    poll: [1000, "date '+%H'"],
  })

  const min = Variable('', {
    poll: [1000, "date '+%M'"],
  })

  return Widget.Box({
    vertical: true,
    className: 'time',
    children: [
      Widget.Label({ label: hour.bind() }),
      Widget.Label({ label: min.bind() }),
    ]
  })
}

/*************************************
 * BATTERY
 *************************************/

const Battery = () => Widget.Label({
  classNames: ['battery'],
  label: battery.bind('percent').as(x => `${x}`),
  setup: self => self
    .bind('prop', battery, 'percent', per => {
      self.toggleClassName('dying', per < 25)
    })
    .bind('prop', battery, 'charging', chg => {
      self.toggleClassName('charging', chg)
    })
})

/*************************************
 * CAPS LOCK
 *************************************/

// @TODO Find a way to do this without polling
const capsLockListen = Variable('1', {
  /* To check caps lock status, this checks the status of the Caps Lock key backlight */
  poll: [300, 'bash -c "brightnessctl -d input0::capslock g"'],
})

const CapsLock = () => Widget.Icon({
  visible: capsLockListen.bind().as(value => (value.trim() == '1') ? true : false),
  icon: 'chevrons-up',
  halign: 'center',
  valign: 'center',
})

/*************************************
 * MUTE
 *************************************/

const MuteIcon = () => Widget.Icon({
  icon: 'volume-x',
  setup: self => self.hook(audio.speaker, self => {
    self.visible = audio.speaker?.stream?.is_muted
  })
})

/*************************************
 * FINAL ASSEMBLY
 *************************************/

const Top = Widget.Box({
  vpack: 'start',
  hpack: 'center',
  className: 'top',
  children: [
    Widget.Icon({icon: 'nix'})
  ]
})

const Center = Widget.Box({
  vpack: 'center',
  hpack: 'center',
  className: 'center',
  children: [Workspaces()]
})

const Bottom = Widget.Box({
  vpack: 'end',
  hpack: 'center',
  spacing: 10,
  className: 'right',
  vertical: true,
  children: [
    MuteIcon(),
    CapsLock(),
    Battery(),
    Time(),
  ]
})

export default (monitor = 0) => Widget.Window({
  name: `bar-${monitor}`,
  monitor,
  anchor: ['left', 'top', 'bottom'],
  hexpand: true,
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    vertical: true,
    hpack: 'center',
    className: 'bar',
    startWidget: Top,
    centerWidget: Center,
    endWidget: Bottom,
  }),
});
