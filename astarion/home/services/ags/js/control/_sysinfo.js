
/* █▀ █▄█ █▀ █ █▄░█ █▀▀ █▀█ */
/* ▄█ ░█░ ▄█ █ █░▀█ █▀░ █▄█ */

/* Small widget for showing basic system info -
 * user, host, and uptime */

/**
 * @function calcUptime 
 * @brief Get uptime in "<x>d <y>h <z>m" format
 */
const calcUptime = () => {
  /* uptime in seconds */
  const raw = Utils.exec('cut -d. -f1 /proc/uptime')

  const d = Math.floor(raw / 86400)
  const h = Math.floor((raw % 86400) / 3600)
  const m = Math.floor((raw % 3600) / 60)

  return `up ${d}d ${h}h ${m}m`
}

export default () => Widget.Box({
  name: 'sysinfo',
  className: 'sysinfo',
  vertical: true,
  children: [
    Widget.Label({
      halign: 'center',
      label: `${Utils.exec('whoami')}@${Utils.exec('cat /etc/hostname')}`
    }),
    Widget.Label({
      halign: 'center',
      label: calcUptime(),
      setup: self => {
        /* @TODO Recalculate uptime each time control panel is opened */
      }
    }),
  ],
})
