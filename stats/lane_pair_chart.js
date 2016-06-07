import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';
import avgAll from './avgAll';
import crossfilter from 'crossfilter2';

export default class LanePairChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.GameLanePair);
        this.group = scoreReducer(this.dimension.group());

        this.sorter = crossfilter.quicksort.by(d => window.parseInt(d.key, 10));

        this.options = {
          type: 'column',
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

}
