import cf from './cf';
import cr from './chart_registry';
import d3 from 'd3';

const format = d3.format(',.0f');
const universal_dim = cf.dimension(d => 'all');

export default class NumberContainer {
  constructor({anchor, description, reducer, accessor}) {
    this.el = d3.select(anchor);
    this.group = reducer(universal_dim.group());

    this.description = description;
    this.accessor = accessor;

    this._value = 0;

    cr.register(this);

  }

  render() {
    if (!this.group.all()[0]) return;
    let _value = this.accessor(this.group.all()[0]);
    let _sel = this.el.selectAll('.number').data([_value]);

    _sel.enter()
      .append('span')
      .attr('class', 'number')
      .text(this._value);

    _sel.enter()
      .append('span')
      .attr('class', 'description')
      .text(this.description);

    _sel.exit().remove();

    this.el.selectAll('.number').transition().duration(375)
      .tween('text', d => {
        const i = d3.interpolate(this._value, d);
        this._value = d;
        return function(t) {
          this.textContent = format(i(t));
        };
      });
  }

  redraw() {
    this.render();
  }
}
