const games = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

export default function gameReducer(group){
  group.reduce(
    (p,v,n)=> {
      let disc = v.Discipline;
      let game = +v.Game;
      let discOrder = +v.Disciplineorder;
      if (v.Block2 === '-1') {
          game += 3;
      }
      let k = disc + ': ' + game;
      if (!p[k]) p[k] = {count: 0, sum: 0, avg: 0};

      ++p[k].count;
      p[k].sum += +v.Score || 0;
      p[k].avg = p[k].sum / p[k].count || 0;

      return p;
    },
    (p,v)=> {
      let disc = v.Discipline;
      let game = +v.Game;
      if (v.Block2 === '-1') {
          game += 3;
      }
      let k = disc + ': ' + game;
      if (+v.Score > 0) {
        --p[k].count;
          p[k].sum -= +v.Score || 0;
          p[k].avg = p[k].sum / p[k].count || 0;
      }
      return p;
    },
    ()=> ({})
  );

  return group;
}
