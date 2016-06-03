import cf from './cf';
import scoreReducer from './scoreReducer';

import AverageChart from './average_chart';

export default class DisciplineChart extends AverageChart {

    constructor() {
        super();
        this.dimension = cf.dimension(d => d.Discipline);
        this.group = scoreReducer(this.dimension.group());

        this.options = {
          renderTo: document.getElementById('disciplineChart'),
          title: 'Discipline Averages'
        };
    }

}
