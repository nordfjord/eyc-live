import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';

export default class GenderChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Gender);
        this.group = scoreReducer(this.dimension.group());

        const el = document.getElementById('genderChart');

        this.options = {
          renderTo: el,
          title: 'Gender Averages'
        };

        if (this.group.all().length < 2) el.parentNode.removeChild(el) 
    }

}
