
// █░█░█ █▀▀ █▀▀ █▄▀   █░█ █ █▀▀ █░█░█
// ▀▄▀▄▀ ██▄ ██▄ █░█   ▀▄▀ █ ██▄ ▀▄▀▄▀

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

// Day/Date labels
function CreateDateLabels() {
  return Widget.Label("Date Labels")
}

// Underlying grid
// different file?
function CreateGrid() {

}

// Create a single Event Box
function CreateEventBox() {

}

// Using data from gcalci, get all event boxes
function CreateAllEventBoxes() {

}

export default () => Widget.Box({
  class_name: 'ledger',
  hpack: 'center',
  vpack: 'center',
  vertical: true,
  spacing: 12,
  children: [
    CreateDateLabels()
  ]
})
