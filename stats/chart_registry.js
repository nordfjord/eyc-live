let _charts = [];

export default {
  register(c) {
    _charts.push(c);
  },

  deregister(c) {
    let idx = _charts.indexOf(c);
    if (~idx) _charts.splice(idx, 1);
  },

  redrawAll() {
    _charts.forEach(c => c.redraw());
  },

  renderAll() {
    _charts.forEach(c => c.render());
  },

  list() {
    return _charts.slice();
  }
};
