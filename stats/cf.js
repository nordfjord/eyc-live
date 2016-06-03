import crossfilter from 'crossfilter2';
import d3 from 'd3';

let cf = crossfilter();

cf.addData = function(data) {
    cf.data = data;
    window.data = data;

    data.sort((a,b) => {
      return d3.ascending(a.DisciplineOrder, b.DisciplineOrder);
    });

    cf.add(data);
};
export default cf;
