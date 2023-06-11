import { Reducer } from 'redugator';
import cf from './cf';
import { format as d3_format } from 'd3-format';
import { select } from 'd3-selection';
import { interpolate } from 'd3-interpolate';

const format = d3_format(',.0f');
const universal_dim = cf.dimension(_ => 'all');

export default class NumberContainer {
  constructor({anchor, description, reducer, accessor}) {
    this.el = select(anchor);
    this.group = Reducer.reduceGroup(reducer, universal_dim.group());

    this.description = description;
    this.accessor = accessor;

    this._value = 0;
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
        const i = interpolate(this._value, d);
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
