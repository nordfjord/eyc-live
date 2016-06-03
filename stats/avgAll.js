import d3 from 'd3';
const avgDescending = (a,b)=> d3.descending(a.value.avg, b.value.avg);

export default function avgAll(all) {
  return all.filter(d => d.value.avg !== 0).sort(avgDescending);
}
