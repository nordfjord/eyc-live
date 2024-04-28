import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';

export class AgeChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => 'Age' in d ? +d.Age : 0);
        this.group = scoreReducer(this.dimension.group());

        this.options = {
          renderTo: document.getElementById('ageChart'),
          title: 'Age Averages'
        };
    }

    data() {
      return this.group.all()
    }

}
