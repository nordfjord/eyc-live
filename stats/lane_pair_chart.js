import cf from './cf';
import d3 from 'd3';
import {reducers} from './scoreReducer';

import AverageChart from './average_chart';
import avgAll from './avgAll';
import crossfilter from 'crossfilter2';

const bisect = crossfilter.bisect.by(d => d).left;

export default class LanePairChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.GameLanePair);
        this.group = this.dimension.group().reduce(
          (p,v)=> {
            // reducers.add(p, v);
            let value = +v.Score;
            if (value) {
              let idx = bisect(p.valueList, value, 0, p.valueList.length);
              p.valueList.splice(idx, 0, value);
              ++p.count;
              p.sum += value;
              p.avg = p.sum / p.count;
            }
            return p;
          },
          (p,v)=> {
            let value = +v.Score;
            if (value) {
              let idx = bisect(p.valueList, value, 0, p.valueList.length);
              p.valueList.splice(idx, 1);
              ++p.count;
              p.sum += value;
              p.avg = p.count ? p.sum / p.count : 0;
            }

            return p;
          },
          ()=> {
            let p = {};
            p.valueList = [];
            p.avg = 0;
            p.count = 0;
            p.sum = 0;
            return p;
          }
        );

        this.sorter = crossfilter.quicksort.by(d => window.parseInt(d.key, 10));

        this.options = {
          type: 'boxplot',
          renderTo: document.getElementById('lanePairChart'),
          title: 'Lane Pair Averages',
          height: 300
        };
    }

    data() {
      let _all = this.group.all();

      this.sorter(_all, 0, _all.length);

      return _all;
    }

    getPercentile(a, p) {
      let idx = p * a.length;

      if (Math.floor(idx) === idx) {
        return (a[idx - 1] + a[idx]) / 2;
      }
      return a[Math.floor(idx)];
    }

    getQuartiles(d) {
      let l = d.value.valueList;
      let n = l.length;

      let min = l[0];
      let q1 = this.getPercentile(l, 0.25);
      let median = d3.median(l);
      let q3 = this.getPercentile(l, 0.75);
      let max = l[n - 1];

      return [min, q1, median, q3, max];
    }

    postRender() {
      let _all = this.data();

      this.chart.series[0].remove();

      this.chart.addSeries({
        name: 'Lane Quartiles',
        color: Highcharts.theme.colors[0],
        data: _all.map(d => {
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
