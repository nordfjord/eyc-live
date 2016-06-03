export default function scoreReducer(group) {
  group.reduce(
    (p,v)=> {
      if (+v.Score) {
        ++p.count;
        p.sum += +v.Score;
        p.avg = p.sum / p.count || 0;
      }
      return p;
    },
    (p,v)=> {
      if (+v.Score) {
        --p.count;
        p.sum -= +v.Score;
        p.avg = p.sum / p.count || 0;
      }
      return p;
    },
    (p,v)=> ({
      count: 0,
      sum: 0,
      avg: 0
    })
  );
  return {
    all: function(){
      return group.all().filter(d => d.value.sum !== 0);
    }
  };
}
