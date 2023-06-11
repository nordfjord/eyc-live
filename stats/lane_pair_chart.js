import cf from './cf';

import AverageChart from './average_chart';
import { Reducer } from 'redugator';
import { valueList } from 'redugator/reducers';
import { averageScoreReducer, quartiles } from './reducers';

export default class LanePairChart extends AverageChart {

  constructor() {
    super();
    this.dimension = cf.dimension(d => d.GameLanePair);
    const reducer = Reducer.concatAll(
      averageScoreReducer, 
      valueList(x => +x.Score),
      quartiles()
    )

    this.group = Reducer.reduceGroup(reducer, this.dimension.group());

    this.sorter = arr => arr.sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));

    this.options = {
      type: 'boxplot',
      renderTo: document.getElementById('lanePairChart'),
      title: 'Lane Pair Averages',
      height: 300
    };
  }

  data() {
    let _all = this.group.all();

    this.sorter(_all);

    return _all;
  }

  postRender() {
    let _all = this.data();

    this.chart.series[0].remove();

    this.chart.addSeries({
      name: 'Lane Quartiles',
      color: Highcharts.theme.colors[0],
      data: _all.map(d => {
        return {
          category: d.key,
          low: d.value.min,
          q1: d.value.q1,
          median: d.value.median,
          q3: d.value.q3,
          high: d.value.max,
          color: this.getColor(d) || Highcharts.theme.colors[0]
        };
      }),
      colorByPoint: true
    });
  }

  postRedraw() {
    let _all = this.data();
    this.chart.series[0].setData(_all.map(d => {
      let q = this.getQuartiles(d);

      return {
        category: d.key,
        low: q[0],
        q1: q[1],
        median: q[2],
        q3: q[3],
        high: q[4],
        color: this.getColor(d) || Highcharts.theme.colors[0]
      };
    }), false);

    this.chart.render();
  }

}
