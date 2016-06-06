import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';

export default class GenderChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Gender);
        this.group = scoreReducer(this.dimension.group());

        this.options = {
          renderTo: document.getElementById('genderChart'),
          title: 'Gender Averages'
        };
    }

}
