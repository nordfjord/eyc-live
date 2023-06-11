import 'd3-transition';
import { dsvFormat } from 'd3-dsv';
import './highcharts_theme';
import cf from './cf';

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
import * as R from 'redugator/reducers';
import { averageScoreReducer } from './reducers';

const ssv = dsvFormat(';')

function init(data){

    cf.addData(data);
    cr.register(new GameAverageChart());
    cr.register(new PlayerChart());
    cr.register(new CountryChart());
    cr.register(new DisciplineChart());
    cr.register(new GenderChart());
    cr.register(new HandChart());
    cr.register(new LanePairChart());
    cr.register(new Table());

    cr.register(new NumberContainer({
      anchor: '#lowGame',
      description: 'Low',
      reducer: R.min(x => +x.Score),
      accessor: d => d ? d.value.min : 0
    }));

    cr.register(new NumberContainer({
      anchor: '#highGame',
      description: 'High',
      reducer: R.max(x => +x.Score),
      accessor: d => d ? d.value.max : 0
    }));

    cr.register(new NumberContainer({
      anchor: '#avgGame',
      description: 'Average',
      reducer: averageScoreReducer,
      accessor: d => d ? d.value.avg : 0
    }));

    cr.register(new NumberContainer({
      anchor: '#totalScore',
      description: 'Total',
      reducer: R.sum(x => +x.Score),
      accessor: d => d ? d.value.sum : 0
    }));

    cr.renderAll();
}

fetch('playerstats.csv')
  .then(response => response.text())
  .then(ssv.parse)
  .then(init);

