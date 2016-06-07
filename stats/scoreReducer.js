export default function scoreReducer(group) {
  group.reduce(
    reducers.add,
    reducers.remove,
    reducers.initial
  );
  return {
    all: function(){
      return group.all().filter(d => d.value.sum !== 0);
    }
  };
}

export const reducers = {
  add: (p, v)=> {
    if (+v.Score) {
      ++p.count;
      p.sum += +v.Score;
      p.avg = p.sum / p.count || 0;
    }
    return p;
  },
  remove: (p, v)=> {
    if (+v.Score) {
      --p.count;
      p.sum -= +v.Score;
      p.avg = p.sum / p.count || 0;
    }
    return p;
  },
  initial: (p)=> {
    if (p) {
      p.count = 0;
      p.sum = 0;
      p.avg = 0;
      return p;
    } else {
      return {
        count: 0,
        sum: 0,
        avg: 0
      };
    }
  }
};
