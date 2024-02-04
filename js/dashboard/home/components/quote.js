import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const quote = Widget.Label({
  class_name: 'quote-text',
  wrap: true,
  justification: 'center',
  label: "Nothing happens to anyone that they can't endure.",
})

const author = Widget.Label({
  class_name: 'author',
  justification: 'center',
  label: 'Marcus Aurelius',
})

export default () => Widget.Box({
  class_name: 'quote',
  spacing: 6,
  vertical: true,
  children: [
    quote,
    author,
  ]
})
