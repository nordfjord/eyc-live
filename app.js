var venue_id = 5395;

var getLane = (function(){

  var xbowlingApiRoot = 'http://api.xbowling.com';
  var scoreTimoutMinutes = 90;

  function formatDate(d) {
    var year = d.getUTCFullYear(),
        month = d.getUTCMonth() + 1,
        date = d.getUTCDate(),
        hours = d.getUTCHours(),
        minutes = d.getUTCMinutes(),
        seconds = d.getUTCSeconds();

    return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  function xBowlingApi(lane_number) {
    var to = new Date(),
        from = new Date(+to - scoreTimoutMinutes * 6e4);
    return m.request({
      url: xbowlingApiRoot + '/venue/' + venue_id + '/lane/' + lane_number,
      data: {
        from: formatDate(from),
        to: formatDate(to)
      },
      background: true,
      method: 'GET'
    });
  }

  return xBowlingApi;
}());


var lane_component = {};

lane_component.controller = function(lane_number) {
  var ctrl = {};

  ctrl.players = m.prop([]);
  ctrl.lane_number = lane_number;

  getLane(lane_number)
    .then(ctrl.players)
    .then(m.redraw);

  var interval = window.setInterval(function(){
    getLane(lane_number)
      .then(ctrl.players)
      .then(m.redraw);
  }, 7000);

  ctrl.onunload = function(){
    window.clearInterval(interval);
  };

  return ctrl;
};

var range10 = [1, 2, 3, 4, 5, 6, 7 ,8, 9, 10];

lane_component.view = function(ctrl){
  return m('.lane-container', [
    m('.lane-name', ctrl.lane_number),
    ctrl.players().map(function(player){
      return m('', [
        m('.lane-name', player.name),
        m('ul.lane-row.clearfix', [
          range10.map(function(idx, index){
            var frameOptions = {};
            if (idx === 10) {
              frameOptions = {
                className: 'tenth-frame'
              };
            }
            return m('li', frameOptions, [
              m('.frame-number-container', idx),
              m('.score-container', frameOptions, [
                m('.throw-score', player['squareScore' + ((index*2) + 1)]),
                m('.throw-score', player['squareScore' + ((index*2) + 2)]),
                idx === 10 ? m('.throw-score', player.squareScore21) : null,
                m('.frame-score', player['frameScore' + idx])
              ])
            ]);
          })
        ])
      ]);
    })
  ]);
};

var main_component = {};

main_component.controller = function(){
  var ctrl = {};
  ctrl.lanes = [];
  for (var i = 1; i <= 22; ++i) {
    ctrl.lanes.push(i);
  }
  return ctrl;
};

main_component.view = function(ctrl){
  return m('.bowling-container.container-fluid', [
    m('h1.page-title', 'EYC 2016 Live Scoring'),
    m('.row', [
      ctrl.lanes.map(function(lane_number){
        return m('.col-xs-12.col-sm-12.col-md-6.col-lg-6', m.component(lane_component, lane_number));
      })
    ]),
    m('.footer', [
      m('p', [
        m('i.fa.fa-heart'),
        ' from ',
        m('a[href=https://twitter.com/enordfjord]', 'Einar')
      ])
    ])
  ]);
};

m.mount(document.body, main_component);
