import m from "mithril"
import Lane from "./lane"

import { ReducerComponent } from "./util"

interface MainComponentState {
  lanes: number[]
}

const MainComponent = ReducerComponent<
  MainComponentState,
  (t: MainComponentState) => MainComponentState
>({
  reducer: (state, action) => action(state),
  initialState: () => ({
    lanes: Array.from({ length: 10 }).map((_, i) => i),
  }),
  view({ lanes }) {
    return m(".bowling-container.container-fluid", [
      m("a[href=/stats].stats-link", [
        m("i.fa.fa-bar-chart-o"),
        "\u00a0",
        "See Statistics from EYC",
      ]),
      m("h1.page-title", "EYC 2016 Live Scoring"),
      m("h2.sub-title", "Scores are refreshed every 30 seconds"),
      m(
        ".row",
        lanes.map(function(lane_number) {
          const l1 = lane_number * 2 + 1
          const l2 = lane_number * 2 + 2
          return [
            m(
              ".col-xs-12.col-sm-12.col-md-6.col-lg-6",
              m(Lane, { laneNumber: l1 }),
            ),
            m(
              ".col-xs-12.col-sm-12.col-md-6.col-lg-6",
              m(Lane, { laneNumber: l2 }),
            ),
          ]
        }),
      ),
      m(".footer", [
        m("p", [
          m("i.fa.fa-heart"),
          " from ",
          m("a[href=https://twitter.com/enordfjord]", "Einar"),
          m(
            "a[href=#].center",
            {
              onclick: scrollToTop,
            },
            [
              m("i.fa.fa-arrow-circle-o-up", {
                style: "font-size: 24px",
                title: "Scroll to top",
              }),
            ],
          ),
          m("span.pull-right", [
            "Powered by ",
            m("a[href=https://xbowling.com]", "MSCN XBowling"),
            " API",
          ]),
        ]),
      ]),
    ])
  },
})
m.mount(document.body, MainComponent)

// @ts-ignore
function scrollToTop(ev) {
  if (ev.preventDefault) ev.preventDefault()
  // @ts-ignore
  TweenLite.to(window, 0.75, { scrollTo: { y: 0 }, ease: Power2.easeInOut })
}
