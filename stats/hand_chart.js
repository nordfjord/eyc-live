import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';

export default class HandChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Hand);
        this.group = scoreReducer(this.dimension.group());

        this.options = {
          renderTo: document.getElementById('handChart'),
          title: 'Hand Averages'
        };
    }

}
