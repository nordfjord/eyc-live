import { Frame as FrameType } from "./api"
import { ReducerComponent } from "./util"
import m from "mithril"
import { merge, range } from "ramda"

interface FrameAttrs {
  key: number
  frame: FrameType
}
interface FrameScoreState {
  view: "score"
  frame: FrameType
}
interface FramePinState {
  view: "pins"
  squareNumber: number
  frame: FrameType
}

type FrameState = FrameScoreState | FramePinState

interface CycleAction {
  type: "cycle"
}
type FrameAction = CycleAction

const frameReducer = (state: FrameState, action: FrameAction): FrameState => {
  if (action.type === "cycle") {
    if (state.view === "score") {
      return merge(state, {
        view: "pins",
        squareNumber: 1,
      })
    } else {
      const nextSquare = state.squareNumber + 1
      if (nextSquare > state.frame.squares.length) {
        return merge(state, { view: "score" })
      }
      return merge(state, {
        view: "pins",
        squareNumber: nextSquare,
      })
    }
  }
  return state
}

export const Frame = ReducerComponent<FrameState, FrameAction, FrameAttrs>({
  reducer: frameReducer,
  initialState: ({ frame }) => ({
    frame,
    view: "score",
  }),
  view(state, dispatch) {
    if (state.view === "score") {
      return score(state, dispatch)
    }
    return pins(state, dispatch)
  },
})

function score(
  { frame }: FrameScoreState,
  dispatch: (action: FrameAction) => void,
) {
  const frameOptions = {
    onclick() {
      dispatch({ type: "cycle" })
    },
    key: frame.id,
    style: "cursor: pointer;",
    className: frame.id === 10 ? "tenth-frame" : "",
  }
  return m("li.score", frameOptions, [
    m(".frame-number-container", frame.id),
    m(".score-container", [
      frame.squares.map(square =>
        m(`.throw-score${square.isSplit ? ".split" : ""}`, square.score),
      ),
      m(".frame-score", frame.score),
    ]),
  ])
}

function pins(
  { frame, squareNumber }: FramePinState,
  dispatch: (action: FrameAction) => void,
) {
  const frameOptions = {
    key: frame.id,
    onclick() {
      dispatch({ type: "cycle" })
    },
    style: "cursor: pointer;",
    className: frame.id === 10 ? "tenth-frame" : "",
  }

  const standingPins = frame.squares[squareNumber - 1].standingPins
  return m("li", frameOptions, [
    m(".frame-number-container", frame.id),
    m(".score-container", [
      m(".shot-number", squareNumber),
      m(
        ".pins",
        range(0, 10).map(n => {
          const isStanding = standingPins & (1 << n) ? ".isStanding" : ""
          return m(`.pin.pin-${n + 1}${isStanding}`)
        }),
      ),
    ]),
  ])
}
