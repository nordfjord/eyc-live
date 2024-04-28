import { Reducer } from "redugator";
import { averageScoreReducer } from "./reducers";

export default function scoreReducer(group) {
  const g = Reducer.reduceGroup(averageScoreReducer, group);
  return {
    all: () => g.all().filter(d => d.value.sum !== 0)
  };
}

