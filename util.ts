import m from "mithril"
import { stream, scan } from "flyd"

interface ReducerComponentOptions<TState, TAction, Attrs> {
  reducer(state: TState, action: TAction): TState
  initialState(attrs: Attrs): TState
  view(state: TState, dispatch: flyd.Stream<TAction>): m.Vnode
  didMount?: (
    state: TState,
    dispatch: flyd.Stream<TAction>,
    attrs: Attrs,
  ) => void
}

interface ReducerComponentState<TState, TAction> {
  action$: flyd.Stream<TAction>
  state$: flyd.Stream<TState>
}

export const ReducerComponent = <TState, TAction, Attrs = any>({
  reducer,
  initialState,
  view,
  didMount,
}: ReducerComponentOptions<TState, TAction, Attrs>): m.Component<
  Attrs,
  ReducerComponentState<TState, TAction>
> => ({
  oninit(vnode) {
    const action$ = stream<TAction>()
    const state$ = action$.pipe(scan(reducer, initialState(vnode.attrs)))

    state$.map(() => {
      m.redraw()
    })

    if (didMount) didMount(state$(), action$, vnode.attrs)

    Object.assign(vnode.state, { action$, state$ })
  },
  onremove(vnode) {
    vnode.state.action$.end(true)
  },
  view(vnode) {
    return view(vnode.state.state$.val, vnode.state.action$)
  },
})

export const intervalStream = (ms: number, value = true) => {
  const s = stream(value)
  let interval = setInterval(() => s(value), ms)
  s.end.map(() => clearInterval(interval))
  return s
}
