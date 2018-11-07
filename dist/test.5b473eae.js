// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"test.json":[function(require,module,exports) {
module.exports = [{
  "partitionKey": "2016032110",
  "rowKey": "001_Uk9CRVJUK0xJTkRCRVJH0_2006",
  "id": "",
  "name": "Robert+Lindberg",
  "bowlingGameId": 0,
  "lane": 1,
  "position": 1,
  "squareScore1": "6",
  "squareScore2": "/",
  "frameScore1": "20",
  "squareScore3": "X",
  "squareScore4": "",
  "frameScore2": "50",
  "squareScore5": "X",
  "squareScore6": "",
  "frameScore3": "80",
  "squareScore7": "X",
  "squareScore8": "",
  "frameScore4": "110",
  "squareScore9": "X",
  "squareScore10": "",
  "frameScore5": "140",
  "squareScore11": "X",
  "squareScore12": "",
  "frameScore6": "168",
  "squareScore13": "X",
  "squareScore14": "",
  "frameScore7": "187",
  "squareScore15": "8",
  "squareScore16": "1",
  "frameScore8": "196",
  "squareScore17": "X",
  "squareScore18": "",
  "frameScore9": "226",
  "squareScore19": "X",
  "squareScore20": "X",
  "squareScore21": "X",
  "frameScore10": "256",
  "standingPins01": 804,
  "standingPins02": 0,
  "standingPins03": 0,
  "standingPins04": 0,
  "standingPins05": 0,
  "standingPins06": 0,
  "standingPins07": 0,
  "standingPins08": 0,
  "standingPins09": 0,
  "standingPins10": 0,
  "standingPins11": 0,
  "standingPins12": 0,
  "standingPins13": 0,
  "standingPins14": 0,
  "standingPins15": 264,
  "standingPins16": 256,
  "standingPins17": 0,
  "standingPins18": 0,
  "standingPins19": 0,
  "standingPins20": 0,
  "standingPins21": 0,
  "finalScore": 256,
  "handicapScore": 0,
  "latestSquareNumber": 21,
  "isComplete": true,
  "splitsOrderedBySquareNumber": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
}, {
  "partitionKey": "2016032110",
  "rowKey": "001_V0lMTElBTStTVkVOU1NPTg2_2220",
  "id": "",
  "name": "William+Svensson",
  "bowlingGameId": 0,
  "lane": 1,
  "position": 2,
  "squareScore1": "0",
  "squareScore2": "/",
  "frameScore1": "19",
  "squareScore3": "9",
  "squareScore4": "/",
  "frameScore2": "38",
  "squareScore5": "9",
  "squareScore6": "/",
  "frameScore3": "56",
  "squareScore7": "8",
  "squareScore8": "/",
  "frameScore4": "74",
  "squareScore9": "8",
  "squareScore10": "0",
  "frameScore5": "82",
  "squareScore11": "7",
  "squareScore12": "2",
  "frameScore6": "91",
  "squareScore13": "X",
  "squareScore14": "",
  "frameScore7": "111",
  "squareScore15": "9",
  "squareScore16": "/",
  "frameScore8": "130",
  "squareScore17": "9",
  "squareScore18": "/",
  "frameScore9": "150",
  "squareScore19": "X",
  "squareScore20": "X",
  "squareScore21": "",
  "frameScore10": "",
  "standingPins01": 1023,
  "standingPins02": 0,
  "standingPins03": 2,
  "standingPins04": 0,
  "standingPins05": 64,
  "standingPins06": 0,
  "standingPins07": 10,
  "standingPins08": 0,
  "standingPins09": 514,
  "standingPins10": 514,
  "standingPins11": 642,
  "standingPins12": 512,
  "standingPins13": 0,
  "standingPins14": 0,
  "standingPins15": 64,
  "standingPins16": 0,
  "standingPins17": 2,
  "standingPins18": 0,
  "standingPins19": 0,
  "standingPins20": 0,
  "standingPins21": 514,
  "finalScore": 178,
  "handicapScore": 0,
  "latestSquareNumber": 21,
  "isComplete": true,
  "splitsOrderedBySquareNumber": [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, true]
}];
},{}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52933" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","test.json"], null)