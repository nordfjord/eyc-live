import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';
import avgAll from './avgAll';
let gameChart, gameDim, gameGrp;

export default class PlayerGameChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Playername);
        this.group = scoreReducer(this.dimension.group());

        let height = avgAll(this.group.all()).length * 19 + 182;
        this.options = {
          renderTo: document.getElementById('playerChart'),
          title: 'Athlete Averages',
          height: height
        };
    }

    _redraw(_all) {
      this.chart.setSize(this.chart.chartWidth, 19 * _all.length + (this.chart.marginBottom * 2));
    }
}
