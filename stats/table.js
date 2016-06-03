import d3 from 'd3';

import cf from './cf';

import cr from './chart_registry';

const _format = d3.format(',.2f');

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

let _values = ['Name', 'Discipline', 'Gender', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'Average'];

export default class Table {
  constructor() {
    this.dimension = cf.dimension(d => [d.Playername, d.Discipline]);

    this.group = this.dimension.group().reduce(
      reduceAdd,
      reduceRemove,
      reduceInitial
    );

    this.el = d3.select('#table > tbody');

    cr.register(this);
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
      .data(function(row, i){
        return _values.map(k => row[k]);
      })
      .enter()
      .append('td')
      .html((d,i) => _values[i] == 'Average' ? _format(d) : d);

    _sel.sort((a,b)=> {
      let i = d3.ascending(a.order, b.order);

      let sorts = [d3.ascending(a.order, b.order), d3.ascending(a.Gender, b.Gender), d3.descending(a.Average, b.Average)];

      for (let _i = 0; _i < sorts.length; ++_i) {
        if (sorts[_i] !== 0) return sorts[_i];
      }
      return 0;
    });
  }

  redraw() {
    this.render();
  }
}
