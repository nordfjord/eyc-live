import { select } from 'd3-selection';
import {ascending} from 'd3-array';
import {format as d3_format} from 'd3-format';

import cf from './cf';

const formatNumber = d3_format(',.2f');

function reduceAdd(p,v) {
  let game = +v.Game;
  if (v.Block2 === '-1') {
    game += 3;
  }

  p['G' + game] = +v.Score;

  p.order = +v.Disciplineorder;

  p.Name = v.Playername;
  p.Discipline = v.Discipline;
  p.Gender = v.Gender;
  ++p.count;

  p.sum += +v.Score;
  p.Average = p.count ? p.sum / p.count : 0;

  return p;
}

function reduceRemove(p, v) {
  --p.count;

  p.sum -= +v.Score;
  p.Average = p.count ? p.sum / p.count : 0;

  return p;
}

function reduceInitial() {
  return {
    Name: '',
    Discipline: '',
    Gender: '',
    order: 0,
    G1: 0,
    G2: 0,
    G3: 0,
    G4: 0,
    G5: 0,
    G6: 0,
    count: 0,
    sum: 0,
    Average: 0
  };
}

const headings = ['Name', 'Discipline', 'Gender', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'Average'];

export default class Table {
  constructor() {
    this.dimension = cf.dimension(d => [d.Playername, d.Discipline]);

    this.group = this.dimension.group().reduce(
      reduceAdd,
      reduceRemove,
      reduceInitial
    );

    this.el = select('#table > tbody');
  }

  render() {
    let data = this.group.all()
      .filter(d => d.value.sum !== 0)
      .map(d => d.value);

    let _sel = this.el
      .selectAll('tr').data(data, d => d.Name + d.Discipline);

    _sel.exit().remove();

    _sel.enter()
      .append('tr')
      .selectAll('td')
      .data(row => headings.map(k => row[k]))
      .enter()
      .append('td')
      .html((d,i) => headings[i] == 'Average' ? formatNumber(d) : d);

    _sel.sort((a,b)=> {
      const sorts = [ascending(a.order, b.order), ascending(a.Gender, b.Gender), descending(a.Average, b.Average)];
      for (let i = 0; i < sorts.length; ++i) {
        if (sorts[i] !== 0) return sorts[i];
      }
      return 0;
    });
  }

  redraw() {
    this.render();
  }
}
