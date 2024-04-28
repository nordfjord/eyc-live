import cf from 'crossfilter2';

const bisectDescending = cf.bisect.by(x => -x.value.avg).right;

// single pass filter and sort descending by average
export default function avgAll(all) {
  let result = []
  for (let i = 0; i < all.length; ++i) {
    let x = all[i];
    if (x.value.avg !== 0) {
      const idx = bisectDescending(result, -x.value.avg, 0, result.length);
      result.splice(idx, 0, x);
    }
  }
  return result;
}
