import d3 from 'd3';
import './highcharts_theme';
import cf from './cf';
import reductio from 'reductio';

import GameAverageChart from './game_averages';
import PlayerChart from './player_chart';
import CountryChart from './country_chart';
import DisciplineChart from './discipline_chart';
import GenderChart from './gender_chart';
import HandChart from './hand_chart';
import NumberContainer from './number';
import LanePairChart from './lane_pair_chart';
import Table from './table';
import cr from './chart_registry';


const dsv = d3.dsv(';', 'text/csv');

function init(data){

    cf.addData(data);
    new GameAverageChart();
    new PlayerChart();
    new CountryChart();
    new DisciplineChart();
    new GenderChart();
    new HandChart();
    new LanePairChart();
    new Table();

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

