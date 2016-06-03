import d3 from 'd3';

import crossfilter from 'crossfilter2';

import './highcharts_theme';

import reductio from 'reductio';

import cf from './cf';

import GameAverageChart from './game_averages';
import PlayerChart from './player_chart';
import CountryChart from './country_chart';
import DisciplineChart from './discipline_chart';
import GenderChart from './gender_chart';
import HandChart from './hand_chart';
import NumberContainer from './number';

import Table from './table';

import cr from './chart_registry';

const dsv = d3.dsv(';', 'text/csv');

function init(data){

    cf.addData(data);
    let gameChart = new GameAverageChart();
    let playerChart = new PlayerChart();
    let countryChart = new CountryChart();
    let disciplineChart = new DisciplineChart();
    let genderChart = new GenderChart();
    let handChart = new HandChart();
    let table = new Table();

    new NumberContainer({
      anchor: '#lowGame',
      description: 'Low',
      reducer: reductio().min('Score'),
      accessor: d => d ? d.value.min : 0
    });

    new NumberContainer({
      anchor: '#highGame',
      description: 'High',
      reducer: reductio().max('Score'),
      accessor: d => d ? d.value.max : 0
    });

    new NumberContainer({
      anchor: '#avgGame',
      description: 'Average',
      reducer: reductio().avg('Score'),
      accessor: d => d ? d.value.avg : 0
    });

    new NumberContainer({
      anchor: '#totalScore',
      description: 'Total',
      reducer: reductio().sum('Score'),
      accessor: d => d ? d.value.sum : 0
    });

    cr.renderAll();
}

dsv('playerstats.csv', init);

window.onload = function(){
  console.log('onload');
  document.getElementById('scrollTop')
    .addEventListener('click', (ev)=>{
      ev.preventDefault();
      TweenLite.to(window, 0.75, {scrollTo: {y: 0}, ease: Power2.easeInOut});
    });
};
