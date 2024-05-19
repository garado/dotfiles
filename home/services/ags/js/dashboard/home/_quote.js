
// █▀█ █░█ █▀█ ▀█▀ █▀▀
// ▀▀█ █▄█ █▄█ ░█░ ██▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const quote = Widget.Label({
  className: 'quote-text',
  wrap: true,
  justification: 'center',
  label: "Nothing happens to anyone that they can't endure.",
  maxWidthChars: 24,
})

const author = Widget.Label({
  className: 'author',
  justification: 'center',
  label: 'Marcus Aurelius',
})

export default () => Widget.Box({
  className: 'quote',
  spacing: 6,
  vertical: true,
  children: [
    quote,
    author,
  ]
})
