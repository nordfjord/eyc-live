import game_component from './game';
import m from 'mithril';
import getLane from './api';

import settings from './settings';

const range10 = [1, 2, 3, 4, 5, 6, 7 ,8, 9, 10];

function createFrames(){
  return range10.map(d => ({
    frame: d,
    state: 'score'
  }));
}

const lane_component = {};

function formatPlayerName(name){
  return name.replace(/[^a-zA-Z0-9 ]/g, '?');
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

const _debounced_redraw = debounce(m.redraw, 300);

lane_component.controller = function (lane_number) {
  const ctrl = {};

  ctrl.players = m.prop([]);
  ctrl.frames = m.prop([]);
  ctrl.lane_number = lane_number;

  ctrl.changed = true;

  ctrl.getTotalScore = function(){
    return range10.map(d => {
      return ctrl.players().reduce((p,v)=>{
        return p + (+v['frameScore' + d]);
      }, 0);
    });
  };

  ctrl.addPlayers = function (players) {
    players.forEach((p, i) => {
      p.name = window.decodeURIComponent(p.name).replace(/\+/g, ' ');
      if (!ctrl.frames()[i]) {
        ctrl.frames()[i] = createFrames();
      }
    });
    ctrl.changed = true;
    return ctrl.players(players);
  };

  getLane(lane_number)
    .then(ctrl.addPlayers)
    .then(m.redraw);


  const interval = window.setInterval(function(){
    getLane(lane_number)
      .then(ctrl.addPlayers)
      .then(_debounced_redraw);
  }, 3e4);

  ctrl.onunload = function () {
    window.clearInterval(interval);
  };

  return ctrl;
};

lane_component.view = function (ctrl) {
  let players = ctrl.players();
  let idx = -1;
  if (settings.playerName()) {
    let name = formatPlayerName(settings.playerName());
    let hasPlayer = players.some((p, i)=> {
      if (p.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
          idx = i;
          return true;
      }
    });

    if (!hasPlayer) {
      ctrl.changed = true;
      return m('');
    }
  }

  if (!ctrl.changed) {
    return {subtree: 'retain'};
  }

  ctrl.changed = false;
  return m('.lane-container', [
    m('.lane-name', ctrl.lane_number),
    players.map((p,i) => game_component.view({player: p, frames: ctrl.frames()[i]}, ()=> ctrl.changed = true)),
    players.length ? [
      // m('.lane-name', 'Total'),
      m('ul.lane-row.clearfix', [
        ctrl.getTotalScore().map((d,i) => m(`li.score${i === 9 ? '.tenth-frame' : ''}`, [
          m('.frame-number-container', d)
        ]))
      ])
    ] : null
  ]);
};

export default lane_component;
