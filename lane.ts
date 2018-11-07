import { Game as GameComponent } from "./game"
import m from "mithril"
import { merge, curry } from "ramda"
import getLane, { Game } from "./api"

import { endsOn, fromPromise } from "flyd"
import { ReducerComponent, intervalStream } from "./util"

interface LaneState {
  laneNumber: number
  loading: boolean
  players: Game[]
  totalScore: number[]
}

interface LaneAttrs {
  laneNumber: number
}

type Id<T> = (val: T) => T

const Lane = ReducerComponent<LaneState, Id<LaneState>, LaneAttrs>({
  reducer: (state, action) => action(state),
  initialState: ({ laneNumber }) => ({
    laneNumber,
    loading: true,
    players: [],
    totalScore: [],
  }),
  didMount({ laneNumber }, dispatch) {
    intervalStream(6e4)
      .pipe(curry(endsOn)(dispatch))
      .chain(() => fromPromise(getLane(laneNumber)))
      .map(players => {
        const totalScore = getTotalScore(players)
        dispatch(state => merge(state, { players, totalScore, loading: false }))
      })
  },
  view({ laneNumber, players, totalScore, loading }) {
    return m(".lane-container", [
      m(".lane-name", laneNumber),
      loading
        ? "Loading..."
        : [
            players.map(game => m(GameComponent, { player: game })),
            players.length
              ? m("ul.lane-row.clearfix", [
                  totalScore.map((d, i) =>
                    m(`li.score${i === 9 ? ".tenth-frame" : ""}`, [
                      m(".frame-number-container", d),
                    ]),
                  ),
                ])
              : null,
          ],
    ])
  },
})

function getTotalScore(players: Game[]) {
  const frames = players.map(p => {
    let lastFrameScore = 0
    return p.frames.map(frame => {
      const score = +frame.score
      if (score) lastFrameScore = score
      return score || lastFrameScore
    })
  })

  return frames.reduce((totals, ns) => {
    for (let i = 0; i < ns.length; ++i) {
      totals[i] = (totals[i] || 0) + ns[i]
    }
    return totals
  }, [])
}

export default Lane
