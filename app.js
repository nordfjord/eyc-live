import m from 'mithril';

function timed(fn, name) {
  return function(...args){
    let then = +new Date();

    let ret = fn.apply(this, args);

    console.log(name || '', (+new Date() - then), 'ms');
  };
}

if ((localStorage || {}).dev) {
  let _strat = m.redraw.strategy;
  m.redraw = timed(m.redraw, 'm.redraw');
  m.redraw.strategy = _strat;
}


import lane_component from './lane';
import store from './store';

import settings from './settings';

var main_component = {};

main_component.controller = function(){
  var ctrl = {};
  ctrl.lanes = [];
  for (var i = 0; i <= 10; ++i) {
    ctrl.lanes.push(i);
  }
  return ctrl;
};

main_component.view = function(ctrl){
  return m('.bowling-container.container-fluid', [
    m('h1.page-title', 'EYC 2016 Live Scoring'),
    m('h2.sub-title', 'Scores are refreshed every 30 seconds'),
    m('.settings', m('a[href=#]', {
      onclick: ev => {
        ev.preventDefault();
        settings.show = true;
      }
    }, m('i.fa.fa-cog.fa-3x'))),
    ctrl.lanes.map(function(lane_number){
      return m('.row', [
        m('.col-xs-12.col-sm-12.col-md-6.col-lg-6', m.component(lane_component, (lane_number*2) + 1)),
        m('.col-xs-12.col-sm-12.col-md-6.col-lg-6', m.component(lane_component, (lane_number*2) + 2))
      ]);
    }),
    m('.footer', [
      m('p', [
        m('i.fa.fa-heart'),
        ' from ',
        m('a[href=https://twitter.com/enordfjord]', 'Einar'),
        m('a[href=#].center', {
          onclick: scrollToTop
        }, [
          m('i.fa.fa-arrow-circle-o-up', {
            style: 'font-size: 24px',
            title: 'Scroll to top'
          })
        ]),
        m('span.pull-right', [
          'Uses the ',
          m('a[href=https://xbowling.com]', 'XBowling'),
          ' API'
        ])
      ])
    ]),
    m.component(settings)
  ]);
};

m.mount(document.body, main_component);

function scrollToTop(ev){
  if (ev.preventDefault) ev.preventDefault();
  TweenLite.to(window, 0.75, {scrollTo: {y: 0}, ease: Power2.easeInOut});
  m.redraw.strategy('none');
}
