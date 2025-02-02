
import Bluetooth from './_bluetooth.js'
import Network from './_network.js'
import Audio from './_audio.js'

export default () => {
  return Widget.Box({
    className: 'quick-settings',
    vertical: true,
    spacing: 10,
    children: [
      Bluetooth(),
      Network(),
      Audio(),
    ]
  })
}
