
// █▀█ █░░ ▄▀█ █▄█ █▀▀ █▀█
// █▀▀ █▄▄ █▀█ ░█░ ██▄ █▀▄

// import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js'

const Mpris = await Service.import('mpris')

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
    vexpand: true,
    className: 'album-art',
    css: player.bind('cover_path').transform(p => 
      `background-image: url('${p}');`),
  });

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
  css: 'padding: 1px', // small hack to make sure it is visible
  children: Mpris.bind('players').transform(p => p.map(Player)),
});
