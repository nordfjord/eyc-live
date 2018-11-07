import m from "mithril2";
import { stream } from "flyd";

const settings = {};

settings.playerName = stream("");
settings.show = false;

function closeSettings() {
  settings.show = false;
}

window.addEventListener("keydown", function closeSettingsKeydown(ev) {
  if (ev.keyCode === 27 && settings.show === true) {
    closeSettings();
    m.redraw();
  }
});

settings.view = function() {
  if (!settings.show) return m("");
  return m("", [
    m(".modal-backdrop.fade", {
      config: delayedClass("in"),
      onclick: closeSettings
    }),
    m(
      ".modal.fade",
      {
        config: delayedClass("in"),
        onclick: function(ev) {
          if (ev.target === this) {
            closeSettings();
          }
        },
        style: "display: block;"
      },
      [
        m(
          ".modal-dialog",
          m(".modal-content", [
            m(".modal-header", [
              m(
                "button[type=button].close",
                {
                  onclick: closeSettings
                },
                m.trust("&times;")
              ),
              m(".modal-title", "Settings")
            ]),
            m(".modal-body", [
              m(".form", [
                m(".form-group", [
                  m("label[for=playerName]", "Player name"),
                  m("input[type=text].form-control#playerName", {
                    oninput: m.withAttr("value", settings.playerName),
                    value: settings.playerName()
                  })
                ])
              ])
            ]),
            m(".modal-footer", [
              m(
                "button[type=button].btn.btn-default",
                {
                  onclick: closeSettings
                },
                "Close"
              )
            ])
          ])
        )
      ]
    )
  ]);
};

function delayedClass(className) {
  return function delayedClassConfig(el, init) {
    if (!init) {
      el.className += " " + className;
    }
  };
}

export default settings;
