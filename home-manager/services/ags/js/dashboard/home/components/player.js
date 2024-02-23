import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Utils from 'resource:///com/github/Aylur/ags/utils.js'

const FALLBACK_ICON = 'audio-x-generic-symbolic';
const PLAY_ICON = 'media-playback-start-symbolic';
const PAUSE_ICON = 'media-playback-pause-symbolic';
const PREV_ICON = 'media-skip-backward-symbolic';
const NEXT_ICON = 'media-skip-forward-symbolic';

/** @param {number} length */
function lengthStr(length) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? '0' : '';
  return `${min}:${sec0}${sec}`;
}

/** @param {import('types/service/mpris').MprisPlayer} player */
const Player = player => {
  const albumArtCover = Widget.Box({
    class_name: 'album-art',
    css: player.bind('cover_path').transform(p => 
      `background-image: url('${p}');`),
  });

  // sadge const albumArtGradient = Widget.Box({
  //   class_name: 'album-art-gradient',
  //   vexpand: true,
  // })

  // const albumArt = Widget.Overlay(
  //   albumArtGradient,
  //   albumArtCover,
  // )

  const title = Widget.Label({
    class_name: 'title',
    hpack: 'start',
    justification: 'left',
    label: player.bind('track_title'),
  });

  const artist= Widget.Label({
    class_name: 'artist',
    hpack: 'start',
    justification: 'left',
    label: player.bind('track_artists').transform(a => a.join(', ')),
  });

  return Widget.Overlay({
    overlays: [
      albumArtCover,
      Widget.Box(
        { 
          vexpand: true,
          vertical: true,
          class_name: 'info',
        },
        title,
        artist,
      ),
    ]
  })
}

export default () => Widget.Box({
  class_name: 'player',
  vexpand: true,
  vertical: true,
  // css: 'padding: 1px', // small hack to make sure it is visible
  children: Mpris.bind('players').transform(p => p.map(Player)),
});
