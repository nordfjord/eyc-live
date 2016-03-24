import d3 from 'd3';

import crossfilter from 'crossfilter2';

import './highcharts_theme';

import reductio from 'reductio';

const dsv = d3.dsv(';', 'text/csv');

const games = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

const avgDescending = (a,b)=> d3.descending(a.value.avg, b.value.avg);

function avgAll(all) {
  return all.filter(d => d.value.avg !== 0).sort(avgDescending);
}


let cf,
    allAvg,
    allGames,
    playerDim,
    countryDim,
    disciplineDim,
    genderDim,
    allDim,
    playerGrp,
    countryGrp,
    disciplineGrp,
    genderGrp,
    allGrp,
    gameGrp,
    minGrp,
    maxGrp,
    avgGrp,
    playerChart,
    countryChart,
    disciplineChart,
    genderChart,
    gameChart
;

function scoreReducer(group) {
  group.reduce(
    (p,v)=> {
      games.forEach(g => {
        let gScore = +v[g];
        if (gScore > 0) {
          ++p.count;
          p.sum += gScore;
          p.avg = p.sum/p.count || 0;
        }
      });
      return p;
    },
    (p,v)=> {
      games.forEach(g => {
        let gScore = +v[g];
        if (gScore > 0) {
          --p.count;
          p.sum -= gScore;
          p.avg = p.sum/p.count || 0;
        }
      });
      return p;
    },
    (p,v)=> ({
      count: 0,
      sum: 0,
      avg: 0
    })
  );
  return {
    all: function(){
      return group.all().filter(d => d.value.sum !== 0);
    }
  };
}

function initFilters(chart, dim) {
  let _filters = chart.filters = [];
  chart.hasFilter = function(key){
    if (!arguments.length) {
      return !!_filters.length;
    }
    return !!~_filters.indexOf(key);
  };
  chart.filter = function(key){
    if (chart.hasFilter(key)) {
      _filters.splice(_filters.indexOf(key), 1);
    } else {
      _filters.push(key);
    }
    if (_filters.length === 1) {
      dim.filterExact(key);
    } else if (_filters.length) {
      dim.filterFunction(function(d){
        return ~_filters.indexOf(d);
      });
    } else {
      dim.filter(null);
    }
  };
}

function initAverageChart(dimension, group, options) {
  let _all = avgAll(group.all());
  let chart = new Highcharts.chart({
    chart: {
      type: options.type || 'bar',
      renderTo: options.renderTo,
      height: options.height
    },
    plotOptions: {
      bar: {
        cursor: 'pointer',
        point: {
          events: {
            click: function(e){
              chart.filter(this.category);
              updateAll();
            }
          }
        }
      }
    },
    title: {
      text: options.title
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

  initFilters(chart, dimension);

  return chart;
}

function initPlayerChart() {
  let _playerAll = avgAll(playerGrp.all());
  playerChart = initAverageChart(playerDim, playerGrp, {
    renderTo: document.getElementById('playerChart'),
    title: 'Player Averages',
    height: 19 * _playerAll.length + 182
  });
}

function getColor(chart, d) {
  return !chart.hasFilter() ? undefined : (chart.hasFilter(d.key) ? undefined : '#333');
}

function updatePlayerChart() {
  if (!playerChart) return initPlayerChart();
  let _playerAll = avgAll(playerGrp.all());
  playerChart.xAxis[0].setCategories(_playerAll.map(d => d.key), false);
  playerChart.series[0].setData(_playerAll.map(d => ({y: d.value.avg, color: getColor(playerChart, d)})), false);
  playerChart.setSize(playerChart.chartWidth, 19 * _playerAll.length + (playerChart.marginBottom * 2));
}

function initGameChart() {
  let _all = gameGrp.all();
  gameChart = new Highcharts.Chart({
    chart: {
      renderTo: document.getElementById('playerGameChart'),
      type: 'line'
    },
    title: {
      text: 'Game Averages'
    },
    legend: {
      enabled: false
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
    series: [{
      name: 'Average',
      data: allAvg.map(d => d.value.avg),
      color: Highcharts.theme.colors[1]
    }]
  });
}

function updateGameChart() {
  if (!gameChart) return initGameChart();
  let scaleRange = [];
  disciplineGrp.all().forEach(d => {
    scaleRange = scaleRange.concat(games.map(g => d.key + ': ' + g));
  });
  let _all = gameGrp.all();
  gameChart.xAxis[0].setCategories(scaleRange, false);
  let data = _all.map(d => d.value.avg);
  if (data.join('') === allAvg.map(d => d.value.avg).join('')) {
    gameChart.series[1].remove(true);
    return;
  }
  if (gameChart.series[1]) {
    gameChart.series[1].setData(data);
  } else {
    gameChart.addSeries({
      name: 'Player',
      data: data,
      color: Highcharts.theme.colors[0]
    });
  }
}

function initCountryChart() {
  let _all = avgAll(countryGrp.all());
  countryChart = initAverageChart(countryDim, countryGrp, {
    renderTo: document.getElementById('countryChart'),
    height: 20 * _all.length,
    title: 'Country Averages'
  });
}

function updateCountryChart(){
  if (!countryChart) return initCountryChart();
  let _all = avgAll(countryGrp.all());
  countryChart.xAxis[0].setCategories(_all.map(d => d.key), false);
  countryChart.series[0].setData(_all.map(d => ({y: d.value.avg, color: getColor(countryChart, d)})));
}

function initGenderChart() {
  genderChart = initAverageChart(genderDim, genderGrp, {
    renderTo: document.getElementById('genderChart'),
    title: 'Gender Averages'
  });
}

function updateGenderChart() {
  if(!genderChart) return initGenderChart();
  let _all = avgAll(genderGrp.all());
  genderChart.xAxis[0].setCategories(_all.map(d => d.key), false);
  genderChart.series[0].setData(_all.map(d => ({y: d.value.avg, color: getColor(genderChart, d)})));
}

function initDisciplineChart() {
  disciplineChart = initAverageChart(disciplineDim, disciplineGrp, {
    renderTo: document.getElementById('disciplineChart'),
    title: 'Discipline Averages'
  });
}

function updateDisciplineChart() {
  if (!disciplineChart) return initDisciplineChart();
  let _all = avgAll(disciplineGrp.all());
  disciplineChart.xAxis[0].setCategories(_all.map(d => d.key), false);
  disciplineChart.series[0].setData(_all.map(d => ({y: d.value.avg, color: getColor(disciplineChart, d)})));
}

const format = d3.format(',.0f');

function numberContainer(accessor, selection, description) {
  let _value = accessor();
  let _el = d3.select(selection);

  let _sel = _el.selectAll('.number').data([_value]);

  _sel.enter()
    .append('span')
    .attr('class', 'number')
    .text(0);

  _sel.enter()
    .append('span')
    .attr('class', 'description')
    .text(description);

  _sel.exit().remove();

  _el.selectAll('.number').transition().duration(375)
    .tween('text', function(d){
      const i = d3.interpolate(this.textContent, d);
      return function(t) {
        this.textContent = format(i(t));
      };
    });

}

function updateNumbers() {
  numberContainer(()=> minGrp.all()[0].value.min, '#lowGame', 'Low');
  numberContainer(()=> maxGrp.all()[0].value.max, '#highGame', 'High');
  numberContainer(()=> avgGrp.all()[0].value.avg, '#avgGame', 'Average');
}

function updateAll() {
  updatePlayerChart();
  updateGameChart();
  updateCountryChart();
  updateGenderChart();
  updateDisciplineChart();
  updateNumbers();
}


function init(data){
  cf = crossfilter(data);
  cf.data = data;

  playerDim = cf.dimension(d => d.Playername);
  countryDim = cf.dimension(d => d.Federation);
  genderDim = cf.dimension(d => d.Gender);
  disciplineDim = cf.dimension(d => d.Discipline);
  allDim = cf.dimension(d => 'all');

  maxGrp = reductio().max(d => d3.max(games.map(g => +d[g] || 0).filter(d => d !== 0)))(allDim.group());
  minGrp = reductio().min(d => d3.min(games.map(g => +d[g] || 0).filter(d => d !== 0)))(allDim.group());
  avgGrp = reductio().avg(d => d3.mean(games.map(g => +d[g] || 0).filter(d => d !== 0)))(allDim.group());


  allGrp = allDim.group().reduce(
    (p,v,n)=> {
      let disc = v.Discipline;
      games.forEach(g => {
        let k = disc + ': ' + g;
        if (!p[k]) p[k] = {
          count: 0,
          sum: 0,
          avg:0
        };
        if (+v[g] > 0) {
          ++p[k].count;
          p[k].sum += +v[g] || 0;
          p[k].avg = p[k].sum / p[k].count || 0;
        }
      });
      return p;
    },
    (p,v)=> {
      let disc = v.Discipline;
      games.forEach(g => {
        let k = disc + ': ' + g;
        if (+v[g] > 0) {
          --p[k].count;
          p[k].sum -= +v[g] || 0;
          p[k].avg = p[k].sum / p[k].count || 0;
        }
      });
      return p;
    },
    ()=> ({})
  );

  gameGrp = {
    all: function(){
      let _all = allGrp.all()[0].value;

      return Object.keys(_all).map(k => {
        return {
          key: k,
          value: _all[k]
        };
      });
    }
  };

  allAvg = gameGrp.all().map(d => ({key: d.key, value: {avg: d.value.avg}}));

  playerGrp = scoreReducer(playerDim.group());
  genderGrp = scoreReducer(genderDim.group());
  countryGrp = scoreReducer(countryDim.group());
  disciplineGrp = scoreReducer(disciplineDim.group());

  updateAll();


}

dsv('/playerstats.csv', init);

window.onload = function(){
  console.log('onload');
  document.getElementById('scrollTop').addEventListener('click', (ev)=>{
    ev.preventDefault();
    TweenLite.to(window, 0.75, {scrollTo: {y: 0}, ease: Power2.easeInOut});
  });
};
