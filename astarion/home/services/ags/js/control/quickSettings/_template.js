
export default (icon, content) => {
  const Button = Widget.Button({
    className: 'quick-settings-button',
    child: Widget.Box({
      vertical: false,
      children: [
        Widget.Icon(icon),
        Widget.Label('Label')
      ]
    })
    // onClicked: 
  })

  return Widget.Box({
    vertical: true,
    children: [
      Button,
    ]
  })
}
