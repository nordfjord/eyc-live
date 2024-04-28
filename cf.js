import crossfilter from 'crossfilter2';
import { ascending } from 'd3-array'; 

let cf = crossfilter();

cf.addData = function(data) {
    cf.data = data;
    window.data = data;

    data.sort((a,b) => ascending(a.DisciplineOrder, b.DisciplineOrder));

    cf.add(data);
};
export default cf;
