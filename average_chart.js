import avgAll from './avgAll';
import cr from './chart_registry.js';

export default class AverageChart {
  constructor() {
    this.filters = [];
  }

  hasFilter(key){
    if (!arguments.length) {
      return !!this.filters.length;
    }
    return !!~this.filters.indexOf(key);
  }

  filter(key) {
    if (this.hasFilter(key)) {
      this.filters.splice(this.filters.indexOf(key), 1);
    } else {
      this.filters.push(key);
    }
    if (this.filters.length === 0) {
      this.dimension.filter(null);
    } else if (this.filters.length === 1) {
      this.dimension.filterExact(this.filters[0]);
    } else {
      this.dimension.filterFunction(d => {
        for (let i = 0; i < this.filters.length; ++i) {
          let filter = this.filters[i];
          if (filter <= d && filter >= d) {
            return true;
          }
        }
        return false;
      });
    }
  }

  data() {
    return avgAll(this.group.all());
  }

  render() {
    let _all = this.data();
    if (!_all.length) return;

    let _this = this;
    this.chart = new Highcharts.chart({
      chart: {
        type: this.options.type || 'bar',
        renderTo: this.options.renderTo,
        height: this.options.height
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click() {
                _this.filter(this.category);
                cr.redrawAll();
              }
            }
          }
        }
      },
      title: {
        text: this.options.title
      },
      xAxis: {
        categories: _all.map(d => d.key),
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
      legend: {
        enabled: false
      },
      series: [{
        name: 'Average',
        data: _all.map(d => d.value.avg)
      }]
    });

    if (this.postRender) {
      this.postRender();
    }
  }

  redraw() {
    let shouldRedraw = !this._redraw;
    if (!this.chart) return this.render();
    let _all = this.data();
    let keys = []
    let values = []
    for (let i = 0; i < _all.length; ++i) {
      let d = _all[i];
      keys.push(d.key);
      values.push({
        y: d.value.avg,
        color: this.getColor(d)
      });
    }
    this.chart.xAxis[0].setCategories(keys, false);
    this.chart.series[0].setData(values, shouldRedraw);
    if (this._redraw) this._redraw(_all);
    if (this.postRedraw) this.postRedraw();
  }

  getColor(d) {
    return !this.hasFilter() ? undefined : (this.hasFilter(d.key) ? undefined : '#333333');
  }
}
