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
})({"node_modules/gsap/ScrollToPlugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ScrollToPlugin = void 0;

var _TweenLite = require("./TweenLite.js");

/*!
 * VERSION: 1.9.1
 * DATE: 2018-05-30
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2018, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _doc = (_TweenLite._gsScope.document || {}).documentElement,
    _window = _TweenLite._gsScope,
    _max = function (element, axis) {
  var dim = axis === "x" ? "Width" : "Height",
      scroll = "scroll" + dim,
      client = "client" + dim,
      body = document.body;
  return element === _window || element === _doc || element === body ? Math.max(_doc[scroll], body[scroll]) - (_window["inner" + dim] || _doc[client] || body[client]) : element[scroll] - element["offset" + dim];
},
    _unwrapElement = function (value) {
  if (typeof value === "string") {
    value = TweenLite.selector(value);
  }

  if (value.length && value !== _window && value[0] && value[0].style && !value.nodeType) {
    value = value[0];
  }

  return value === _window || value.nodeType && value.style ? value : null;
},
    _buildGetter = function (e, axis) {
  //pass in an element and an axis ("x" or "y") and it'll return a getter function for the scroll position of that element (like scrollTop or scrollLeft, although if the element is the window, it'll use the pageXOffset/pageYOffset or the documentElement's scrollTop/scrollLeft or document.body's. Basically this streamlines things and makes a very fast getter across browsers.
  var p = "scroll" + (axis === "x" ? "Left" : "Top");

  if (e === _window) {
    if (e.pageXOffset != null) {
      p = "page" + axis.toUpperCase() + "Offset";
    } else if (_doc[p] != null) {
      e = _doc;
    } else {
      e = document.body;
    }
  }

  return function () {
    return e[p];
  };
},
    _getOffset = function (element, container) {
  var rect = _unwrapElement(element).getBoundingClientRect(),
      b = document.body,
      isRoot = !container || container === _window || container === b,
      cRect = isRoot ? {
    top: _doc.clientTop - (window.pageYOffset || _doc.scrollTop || b.scrollTop || 0),
    left: _doc.clientLeft - (window.pageXOffset || _doc.scrollLeft || b.scrollLeft || 0)
  } : container.getBoundingClientRect(),
      offsets = {
    x: rect.left - cRect.left,
    y: rect.top - cRect.top
  };

  if (!isRoot && container) {
    //only add the current scroll position if it's not the window/body.
    offsets.x += _buildGetter(container, "x")();
    offsets.y += _buildGetter(container, "y")();
  }

  return offsets;
  /*	PREVIOUS
  var rect = _unwrapElement(element).getBoundingClientRect(),
  	isRoot = (!container || container === _window || container === document.body),
  	cRect = (isRoot ? _doc : container).getBoundingClientRect(),
  	offsets = {x: rect.left - cRect.left, y: rect.top - cRect.top};
  if (!isRoot && container) { //only add the current scroll position if it's not the window/body.
  	offsets.x += _buildGetter(container, "x")();
  	offsets.y += _buildGetter(container, "y")();
  }
  return offsets;
  */
},
    _parseVal = function (value, target, axis) {
  var type = typeof value;
  return !isNaN(value) ? parseFloat(value) : type === "number" || type === "string" && value.charAt(1) === "=" ? value : value === "max" ? _max(target, axis) : Math.min(_max(target, axis), _getOffset(value, target)[axis]);
},
    ScrollToPlugin = _TweenLite._gsScope._gsDefine.plugin({
  propName: "scrollTo",
  API: 2,
  global: true,
  version: "1.9.1",
  //called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
  init: function (target, value, tween) {
    this._wdw = target === _window;
    this._target = target;
    this._tween = tween;

    if (typeof value !== "object") {
      value = {
        y: value
      }; //if we don't receive an object as the parameter, assume the user intends "y".

      if (typeof value.y === "string" && value.y !== "max" && value.y.charAt(1) !== "=") {
        value.x = value.y;
      }
    } else if (value.nodeType) {
      value = {
        y: value,
        x: value
      };
    }

    this.vars = value;
    this._autoKill = value.autoKill !== false;
    this.getX = _buildGetter(target, "x");
    this.getY = _buildGetter(target, "y");
    this.x = this.xPrev = this.getX();
    this.y = this.yPrev = this.getY();

    if (value.x != null) {
      this._addTween(this, "x", this.x, _parseVal(value.x, target, "x") - (value.offsetX || 0), "scrollTo_x", true);

      this._overwriteProps.push("scrollTo_x");
    } else {
      this.skipX = true;
    }

    if (value.y != null) {
      this._addTween(this, "y", this.y, _parseVal(value.y, target, "y") - (value.offsetY || 0), "scrollTo_y", true);

      this._overwriteProps.push("scrollTo_y");
    } else {
      this.skipY = true;
    }

    return true;
  },
  //called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
  set: function (v) {
    this._super.setRatio.call(this, v);

    var x = this._wdw || !this.skipX ? this.getX() : this.xPrev,
        y = this._wdw || !this.skipY ? this.getY() : this.yPrev,
        yDif = y - this.yPrev,
        xDif = x - this.xPrev,
        threshold = ScrollToPlugin.autoKillThreshold;

    if (this.x < 0) {
      //can't scroll to a position less than 0! Might happen if someone uses a Back.easeOut or Elastic.easeOut when scrolling back to the top of the page (for example)
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = 0;
    }

    if (this._autoKill) {
      //note: iOS has a bug that throws off the scroll by several pixels, so we need to check if it's within 7 pixels of the previous one that we set instead of just looking for an exact match.
      if (!this.skipX && (xDif > threshold || xDif < -threshold) && x < _max(this._target, "x")) {
        this.skipX = true; //if the user scrolls separately, we should stop tweening!
      }

      if (!this.skipY && (yDif > threshold || yDif < -threshold) && y < _max(this._target, "y")) {
        this.skipY = true; //if the user scrolls separately, we should stop tweening!
      }

      if (this.skipX && this.skipY) {
        this._tween.kill();

        if (this.vars.onAutoKill) {
          this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []);
        }
      }
    }

    if (this._wdw) {
      _window.scrollTo(!this.skipX ? this.x : x, !this.skipY ? this.y : y);
    } else {
      if (!this.skipY) {
        this._target.scrollTop = this.y;
      }

      if (!this.skipX) {
        this._target.scrollLeft = this.x;
      }
    }

    this.xPrev = this.x;
    this.yPrev = this.y;
  }
}),
    p = ScrollToPlugin.prototype;

exports.default = exports.ScrollToPlugin = ScrollToPlugin;
ScrollToPlugin.max = _max;
ScrollToPlugin.getOffset = _getOffset;
ScrollToPlugin.buildGetter = _buildGetter;
ScrollToPlugin.autoKillThreshold = 7;

p._kill = function (lookup) {
  if (lookup.scrollTo_x) {
    this.skipX = true;
  }

  if (lookup.scrollTo_y) {
    this.skipY = true;
  }

  return this._super._kill.call(this, lookup);
};
},{"./TweenLite.js":"node_modules/gsap/TweenLite.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60345" + '/');

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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/ScrollToPlugin.6b9e925e.map