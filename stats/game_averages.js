import cf from './cf';
import { ascending } from 'd3-array';

import { Reducer } from 'redugator';
import { averageScoreReducer } from './reducers';

export default class PlayerGameChart {

    constructor() {
        this.dimension = cf.dimension(d => {
          let game = +d.Game;
          let disc = d.Discipline;
          let discOrder = +d.Disciplineorder * 10;

          if (d.Block2 === '-1') {
            game += 3;
          }

          return [disc + ': ' + game, discOrder + game, d.Gender];
        });
        this.group = Reducer.reduceGroup(averageScoreReducer, this.dimension.group());

        this.dimension2 = cf.dimension(d => {
          let game = +d.Game;
          let discOrder = +d.Disciplineorder * 10;

          if (d.Block2 === '-1') {
            game += 3;
          }

          return discOrder + game;
        });

        this.group2 = Reducer.reduceGroup(averageScoreReducer, this.dimension2.group());

        this.initialTotal = this.group2.all().reduce((p,v)=> p + v.value.sum, 0);
    }

    render() {
        let _all = this.group.all().sort((a,b)=> ascending(a.key[1], b.key[1]));
        let genders = new Map()
        let categories = new Set()

        for (let i = 0; i < _all.length; ++i) {
          let d = _all[i];
          let gender = d.key[2]
          if (!genders.has(gender)) genders.set(gender, []);
          genders.get(gender).push(d.value.avg);
          categories.add(d.key[0]);
        }

        this.genderCount = genders.size;
        if (!_all.length) return;
        this.chart = new Highcharts.Chart({
          chart: {
            renderTo: document.getElementById('playerGameChart'),
            type: 'line'
          },
          title: { text: 'Game Averages' },
          xAxis: {
            categories: Array.from(categories),
            title: { text: null },
          },
          yAxis: {
            min: 0,
            title: { text: 'Average' },
            labels: { overflow: 'justify' }
          },
          series: Array.from(genders.keys()).map((gender, i) => ({
            name: gender + ' Average',
            data: genders.get(gender),
            color: Highcharts.theme.colors[i+1]
          }))
        });
    }

    redraw() {
        if (!this.chart) return this.render();

        let _all = this.group2.all();

        let data = []; 
        let total = 0;

        for (let i = 0; i < _all.length; ++i) {
          let d = _all[i];
          data.push(d.value.avg);
          total += d.value.sum;
        }

        const lastIdx = this.chart.series.length - 1;
        const lastSeries = this.chart.series[lastIdx];


        if (total === this.initialTotal && lastSeries.name === 'Filter Average') {
          lastSeries.remove(true);
          return;
        }

        if (lastSeries.name === 'Filter Average') {
          lastSeries.setData(data);
        } else {
          this.chart.addSeries({
            name: 'Filter Average',
            data: data,
            color: Highcharts.theme.colors[0]
          });
        }
    }
}
