import cf from './cf';
import reductio from 'reductio';
import d3 from 'd3';

import cr from './chart_registry';

function unique(arr, accessor = d => d) {
  return arr.reduce((p,v) => (!~p.indexOf(accessor(v)) ? p.push(v) : null, p), []);
}

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
        this.group = reductio().avg('Score')(this.dimension.group());

        this.dimension2 = cf.dimension(d => {
          let game = +d.Game;
          let discOrder = +d.Disciplineorder * 10;

          if (d.Block2 === '-1') {
            game += 3;
          }

          return discOrder + game;
        });

        this.group2 = reductio().avg('Score')(this.dimension2.group());

        this.initialTotal = this.group2.all().reduce((p,v)=> p + v.value.sum, 0);

        cr.register(this);
    }

    render() {
        let _all = this.group.all().sort((a,b)=> {
          return d3.ascending(a.key[1], b.key[1]);
        });

        let genders = unique(_all.map(d => d.key[2]));
        if (!_all.length) return;
        let _categories = unique(_all.map(d => d.key[0]));
        this.chart = new Highcharts.Chart({
          chart: {
            renderTo: document.getElementById('playerGameChart'),
            type: 'line'
          },
          title: {
            text: 'Game Averages'
          },
          xAxis: {
            categories: _categories,
            title: {
              text: null
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Average'
            },
            labels: {
              overflow: 'justify'
            }
          },
          series: genders.map((g,i) => ({
            name: g + ' Average',
            data: _all.filter(d => d.key[2] === g).map(d => d.value.avg),
            color: Highcharts.theme.colors[i+1]
          }))
        });
    }

    redraw() {
        if (!this.chart) return this.render();

        let _all = this.group2.all();

        let data = _all.map(d => d.value.avg);

        let total = _all.reduce((p,v)=> p + v.value.sum, 0);


        if (total === this.initialTotal) {
          if (this.chart.series[2]) this.chart.series[2].remove(true);
          return;
        }

        if (this.chart.series[2]) {
          this.chart.series[2].setData(data);
        } else {
          this.chart.addSeries({
            name: 'Filter Average',
            data: data,
            color: Highcharts.theme.colors[0]
          });
        }

    }

    update() {
        if (!gameChart) return initGameChart();
        let scaleRange = [];
        disciplineGrp.all().forEach(d => {
          scaleRange = scaleRange.concat(games.map(g => d.key + ': ' + g));
        });
        let _all = gameGrp.all();
        gameChart.xAxis[0].setCategories(scaleRange, false);
        let data = _all.map(d => d.value.avg);
        if (data.join('') === allAvg.map(d => d.value.avg).join('')) {
          gameChart.series[2].remove(true);
          return;
        }
        if (gameChart.series[2]) {
          gameChart.series[2].setData(data);
        } else {
          gameChart.addSeries({
            name: 'Filter Average',
            data: data,
            color: Highcharts.theme.colors[0]
          });
        }
    }
}
