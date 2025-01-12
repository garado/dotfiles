
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

export default () => {
  const albumArtCover = Widget.Box({
    vexpand: true,
    className: 'album-art',
    setup: self => {
      self.hook(Mpris, (self) => {
        const coverPath = Mpris.players.length == 0 ? DEFAULT_IMG : Mpris.players[0].cover_path
        self.css = `background-image: url('${coverPath}')`
      }, 'player-changed')
    }
  });

  const source = Widget.Box({
    hpack: 'start',
    vertical: false,
    spacing: 8,
    children: [
      Widget.Icon('music'),
      Widget.Label({
        css: 'padding-bottom: 4px',
        setup: self => {
          self.hook(Mpris, (self) => {
            const value = Mpris.players.length == 0 ? 'None' : Mpris.players[0].identity
            self.label = value
          }, 'player-changed')
        }
      })
    ]
  })

  const title = Widget.Label({
    className: 'title',
    hpack: 'start',
    setup: self => {
      self.hook(Mpris, (self) => {
        const value = Mpris.players.length == 0 ? 'Nothing playing' : Mpris.players[0].track_title
        self.label = value
      }, 'player-changed')
    }
  });

  const artist = Widget.Label({
    className: 'artist',
    hpack: 'start',
    setup: self => {
      self.hook(Mpris, (self) => {
        const value = Mpris.players.length == 0 ? "It's quiet in here..." : Mpris.players[0].track_artists.transform(a => a.join(', '))
        self.label = value
      }, 'player-changed')
    }
  });

  return Widget.Overlay({
    className: 'player',
    vexpand: true,
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
