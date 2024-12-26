
// █▀█ █░░ ▄▀█ █▄█ █▀▀ █▀█
// █▀▀ █▄▄ █▀█ ░█░ ██▄ █▀▄

const Mpris = await Service.import('mpris')

import Variable from 'resource:///com/github/Aylur/ags/variable.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const DEFAULT_IMG = '/home/alexis/Github/dotfiles/home/services/ags/assets/no-music.jpg'

/** @param {number} length */
function lengthStr(length) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? '0' : '';
  return `${min}:${sec0}${sec}`;
}

const Player = (player) => {
  const albumArtCover = Widget.Box({
    vexpand: true,
    className: 'album-art',
    css: player.bind('cover_path').transform(p => 
      `background-image: url('${p || DEFAULT_IMG}');`),
  });

  const source = Widget.Box({
    hpack: 'start',
    vertical: false,
    spacing: 8,
    children: [
      Widget.Icon('music'),
      Widget.Label({
        css: 'padding-bottom: 4px',
        label: player.bind('identity')
      })
    ]
  })

  const title = Widget.Label({
    className: 'title',
    hpack: 'start',
    label: player.bind('track_title'),
  });

  const artist = Widget.Label({
    className: 'artist',
    hpack: 'start',
    label: player.bind('track_artists').transform(a => a.join(', ')),
  });

  return Widget.Overlay({
    overlays: [
      albumArtCover,
      Widget.Box( {
        vexpand: true,
        vertical: true,
        className: 'info',
        children: [
          source,
          title,
          artist,
        ],
      }),
    ]
  })
}

export default () => Widget.Box({
  className: 'player',
  vexpand: true,
  vertical: true,
  children: Mpris.bind('players').as(p => p.map(Player)),
})
