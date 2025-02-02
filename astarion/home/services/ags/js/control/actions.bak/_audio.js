
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const audio = await Service.import('audio')

// Volume slider widget ---------------------------

/** @param {'speaker' | 'microphone'} type */
const volumeSliderContents = (type = 'speaker') => Widget.Slider({
  hexpand: false,
  drawValue: false,
  onChange: ({ value }) => audio[type].volume = value,
  value: audio[type].bind('volume'),
})

const volumeSlider = Widget.Box({
  spacing: 10,
  vertical: true,
  children: [
    Widget.Label({
      label: 'Volume',
      hpack: 'start',
      className: 'ctrl-header',
    }),
    volumeSliderContents(),
  ],
})

// Sink selection widget ---------------------------

const sinkSelectContents = Widget.Box({
  spacing: 10,
  vertical: true,
  children: audio.bind('speakers').as(s => s.map(s => {

    const sinkLabel = Widget.Label({
      label: s.description,
      wrap: true,
      maxWidthChars: 20
    })

    const selectBtn = Widget.Button({
      hexpand: false,
      vexpand: false,
      attribute: s,
      onClicked: (self) => {
        audio.control.set_default_sink(audio.getStream(self.attribute.id).stream)
      }
    })

    return Widget.Box({
      vertical: false,
      spacing: 10,
      children: [
        selectBtn,
        sinkLabel,
      ]
    })
  }))
})

const sinkSelect = Widget.Box({
  spacing: 10,
  vertical: true,
  children: [
    Widget.Label({
      label: 'Sink select',
      hpack: 'start',
      className: 'ctrl-header',
    }),
    sinkSelectContents
  ]
})

// Jack control ---------------------------

const jackToggle = Widget.Box({
  vertical: false,
  homogeneous: true,
  spacing: 20,
  children: [
    Widget.Label({
      label: 'Jack enable',
      hpack: 'start',
    }),
    Widget.Switch({
      // state: bt.enabled,
      // onActivate: (self) => {
      //   bt.enabled = !self.state
      // }
    })
  ],
})

const jackControl = Widget.Box({
  spacing: 10,
  vertical: true,
  children: [
    Widget.Label({
      label: 'Jack control',
      hpack: 'start',
      className: 'ctrl-header',
    }),
    jackToggle,
  ]
})

// --------------------

export default () => Widget.Box({
  className: 'audio',
  attribute: 'volume-2',
  vexpand: true,
  hexpand: false,
  vertical: true,
  spacing: 20,
  children: [
    volumeSlider,
    sinkSelect,
    jackControl,
  ]
})
