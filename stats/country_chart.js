import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';
import avgAll from './avgAll';
let gameChart, gameDim, gameGrp;

export default class CountryChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Federation);
        this.group = scoreReducer(this.dimension.group());

        let height = avgAll(this.group.all()).length * 20;
        this.options = {
          renderTo: document.getElementById('countryChart'),
          title: 'Country Averages',
          height: height
        };
    }

}
