import d3 from 'd3';

import crossfilter from 'crossfilter2';

import './highcharts_theme';

const dsv = d3.dsv(';', 'text/csv');

const games = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

const avgDescending = (a,b)=> d3.descending(a.value.avg, b.value.avg);

function avgAll(all) {
  return all.filter(d => d.value.avg !== 0).sort(avgDescending);
}

let cf,
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
      name: 'All',
      data: _all.map(d => d.value.avg)
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
  gameChart.series[0].setData(_all.map(d => d.value.avg));
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

function updateAll() {
  updatePlayerChart();
  updateGameChart();
  updateCountryChart();
  updateGenderChart();
  updateDisciplineChart();
}


function init(data){
  cf = crossfilter(data);

  playerDim = cf.dimension(d => d.Playername);
  countryDim = cf.dimension(d => d.Federation);
  genderDim = cf.dimension(d => d.Gender);
  disciplineDim = cf.dimension(d => d.Discipline);
  allDim = cf.dimension(d => 'all');


  allGrp = allDim.group().reduce(
    (p,v)=> {
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

  window.gameGrp = gameGrp = {
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
