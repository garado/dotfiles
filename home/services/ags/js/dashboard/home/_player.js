
// █▀█ █░░ ▄▀█ █▄█ █▀▀ █▀█
// █▀▀ █▄▄ █▀█ ░█░ ██▄ █▀▄

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const Mpris = await Service.import('mpris')

const Player = () => Widget.Box({
  children: [
    Widget.Label('Hi')
  ],
}).hook(Mpris, self => {
    // print(JSON.stringify(Mpris))
  })

const PlayerThingy = player => {
}

Mpris.bind('players').transform(p => print(p))

const Player3 = player => {
  const albumArtCover = Widget.Box({
    vexpand: true,
    className: 'album-art',
    css: player.bind('cover_path').transform(p => 
      `background-image: url('${p}');`),
  })

  player.bind('cover_path').transform(p => {
    return p
  })

  return Widget.Overlay({
    overlays: [
      albumArtCover,
      // Widget.Box( {
      //   vexpand: true,
      //   vertical: true,
      //   className: 'info',
      //   children: [
      //     title,
      //     artist,
      //   ],
      // }),
    ]
  })
}

/** @param {import('types/service/mpris').MprisPlayer} player */
const Player2 = player => Widget.Button({
    onClicked: () => player.playPause(),
    child: Widget.Label().hook(player, label => {
      const { track_artists, track_title } = player;
      print(JSON.stringify(player))
      label.label = `${track_artists.join(', ')} - ${track_title}`;
    }),
})

export default () => Widget.Box({
  className: 'player',
  vexpand: false,
  vertical: true,
  css: 'padding: 1px', // small hack to make sure it is visible
  children: [ Player() ]
});
