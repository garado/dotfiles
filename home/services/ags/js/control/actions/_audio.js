
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const audio = await Service.import('audio')

/** @param {'speaker' | 'microphone'} type */
const VolumeSlider = (type = 'speaker') => Widget.Slider({
  hexpand: false,
  drawValue: false,
  onChange: ({ value }) => audio[type].volume = value,
  value: audio[type].bind('volume'),
})

const sinkSelect = Widget.Box({
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

export default () => Widget.Box({
  className: 'audio',
  attribute: 'volume-2',
  vexpand: true,
  hexpand: false,
  vertical: true,
  children: [
    sinkSelect,
    VolumeSlider(),
    // speakerSlider,
    // Status,
  ]
})
