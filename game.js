import m from 'mithril';

const range10 = [1, 2, 3, 4, 5, 6, 7 ,8, 9, 10];

const game_component = {};

game_component.controller = function (player) {
  return {
    player,
    frames: range10.map(d => ({
      frame: d,
      state: 'score'
    }))
  };
};

game_component.view = function({player, frames}, onchange){
  return m('', [
    m('.lane-name', player.name),
    m('ul.lane-row.clearfix', [
      frames.map(frame => {
        if (frame.state === 'pins-1') {
          return pins1(frame, player, onchange);
        }
        if (frame.state === 'pins-2') {
          return pins2(frame, player, onchange);
        }
        if (frame.state === 'pins-3') {
          return pins3(frame, player, onchange);
        }
        return score(frame, player, onchange);
      })
    ])
  ]);
};

function score(frame, player, onchange){
  let number = frame.frame;
  const frameOptions = {
    onclick: ev => {
      onchange();
      frame.state = 'pins-1';
    },
    style: 'cursor: pointer;',
    key: 100 + number
  };
  if (number === 10) {
    frameOptions.className = 'tenth-frame';
  }

  const idx = number - 1;

  return m('li.score', frameOptions, [
    m('.frame-number-container', number),
    m('.score-container', frameOptions, [
      m('.throw-score', player['squareScore' + ((idx*2) + 1)]),
      m('.throw-score', player['squareScore' + ((idx*2) + 2)]),
      number === 10 ? m('.throw-score', player.squareScore21) : null,
      m('.frame-score', player['frameScore' + number])
    ])
  ]);
}

function getFramePins(add, number, player) {
  number = ((number - 1) * 2) + add;
  if (number < 10) {
    number = '0' + number;
  }
  let framePins = player[`standingPins${number}`];
  let pins = [];

  pins[0] = !!(framePins & 0x1);
  pins[1] = !!(framePins & 0x2);
  pins[2] = !!(framePins & 0x4);
  pins[3] = !!(framePins & 0x8);
  pins[4] = !!(framePins & 0x10);
  pins[5] = !!(framePins & 0x20);
  pins[6] = !!(framePins & 0x40);
  pins[7] = !!(framePins & 0x80);
  pins[8] = !!(framePins & 0x100);
  pins[9] = !!(framePins & 0x200);

  return pins;
}

function pins1(frame, player, onchange) {
  let number = frame.frame;

  let p = getFramePins(1, number, player);
  const frameOptions = {
    onclick: ev => {
      frame.state = 'pins-2';
      onchange();
    },
    style: 'cursor: pointer;',
    key: 200 + number
  };
  if (number === 10) {
    frameOptions.className = 'tenth-frame';
  }

  return pins(p, frame, frameOptions, '1');
}

function pins(p, frame, frameOptions, shotNumber) {
  return m('li', frameOptions, [
    m('.frame-number-container', frame.frame),
    m('.score-container', frameOptions, [
      m('.shot-number', shotNumber),
      m('.pins', p.map((pin, idx)=>
        m(`.pin.pin-${idx+1}${pin ? '.isStanding' : ''}`)
      ))
    ])
  ]);
}

function pins2(frame, player, onchange){
  let number = frame.frame;
  const frameOptions = {
    onclick: ev => {
      if (frame.frame === 10) {
        frame.state = 'pins-3';
      } else {
        frame.state = 'score';
      }
      onchange();
    },
    style: 'cursor: pointer;',
    key: 300 + number
  };
  if (number === 10) {
    frameOptions.className = 'tenth-frame';
  }

  let p = getFramePins(2, number, player);

  return pins(p, frame, frameOptions, '2');
}

function pins3(frame, player, onchange){
  let number = frame.frame;
  const frameOptions = {
    onclick: ev => {
      frame.state = 'score';
      onchange();
    },
    style: 'cursor: pointer;',
    key: 400 + number,
    className: 'tenth-frame'
  };

  let p = getFramePins(3, number, player);
  return pins(p, frame, frameOptions, '3');
}

export default game_component;
