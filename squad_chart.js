import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';

export default class SquadChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Squad);
        this.group = scoreReducer(this.dimension.group());

        const el = document.getElementById('squadChart');

        this.options = {
          renderTo: el,
          title: 'Squad Averages'
        };

        if (this.group.all().length < 2) el.parentNode.removeChild(el) 
    }

}
