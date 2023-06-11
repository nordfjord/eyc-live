import { Reducer } from "redugator";
import { sum, average } from "redugator/reducers";

export const averageScoreReducer = Reducer.concatAll(sum(x => +x.Score), sum(_ => 1, 'count'), average())

function getPercentile(a, p) {
  let idx = p * a.length;
  return a[Math.floor(idx)] ?? 0;
}

export const quartiles = (valueList = 'valueList') => {
  function setQuartiles(p) {
    let l = p[valueList];
    p.min = l[0];
    p.q1 = getPercentile(l, 0.25);
    p.median = getPercentile(l, 0.50);
    p.q3 = getPercentile(l, 0.75);
    p.max = l[l.length - 1];
  }

  return {
    reduceAdd(p) {
      setQuartiles(p)
      return p
    },
    reduceRemove(p) {
      setQuartiles(p)
      return p
    },
    reduceInitial(p = {}) {
      p.min = 0;
      p.q1 = 0;
      p.median = 0;
      p.q3 = 0;
      p.max = 0;
      return p
    },
  }
}
