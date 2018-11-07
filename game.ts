import m from "mithril"
import { Game as GameType } from "./api"
import { Frame } from "./Frame"

export const Game = ({ attrs: { player } }: m.Vnode<{ player: GameType }>) => ({
  view() {
    return m("", { key: player.name }, [
      m(".lane-name", player.name),
      m(
        "ul.lane-row.clearfix",
        player.frames.map(frame => m(Frame, { frame, key: frame.id })),
      ),
    ])
  },
})
