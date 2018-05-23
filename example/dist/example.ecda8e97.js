// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
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

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({14:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (el, oldAttr, newAttr) {
    Object.keys(oldAttr).forEach(function (name) {
        if (newAttr[name] == null) setAttr(el, name, el);
    });
    Object.keys(newAttr).forEach(function (name) {
        setAttr(el, name, oldAttr[name], newAttr[name]);
    });
    return el;
};

function setAttr(el, name, oldval, val) {
    if (name === 'value' || name === 'selected' || name === 'checked' || name.substr(0, 2) === 'on') {
        el[name] = val;
    } else if (val == null) {
        el.removeAttribute(name);
    } else if (oldval !== val) {
        el.setAttribute(name, val);
    }
}
//need a test: seems not to matter what we pass as third arg in first loop below
//also need a test for checked
},{}],7:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = make;

var _attr = require('./attr');

var _attr2 = _interopRequireDefault(_attr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeHTMLElement(_ref) {
    var tag = _ref.tag,
        attr = _ref.attr,
        chld = _ref.chld;

    var el = document.createElement(tag);
    (0, _attr2.default)(el, {}, attr);
    chld.forEach(function (c) {
        return el.appendChild(make(c));
    });
    return el;
}

function makeTextNode(text) {
    return document.createTextNode(text);
}

function makeComponentInstance(inst) {
    inst.el = make(inst.vnode);
    inst.component.instances.push(inst);
    return inst.el;
}

function make(vnode) {
    return (vnode.component ? makeComponentInstance : vnode.tag ? makeHTMLElement : makeTextNode)(vnode);
}
},{"./attr":14}],6:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = patch;

var _attr = require('./attr');

var _attr2 = _interopRequireDefault(_attr);

var _make = require('./make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replace(el, vnode) {
    var newel = (0, _make2.default)(vnode);
    var parent = el.parentNode;
    if (parent) {
        parent.replaceChild(newel, el);
    }
    return newel;
}

function remove(el) {
    el.parentNode.removeChild(el);
}

function updateChildren(parentEl) {
    var oldChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var newChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var chel = parentEl.childNodes;
    var newLength = newChildren.length;
    var oldLength = oldChildren.length;
    for (var i = 0; i < oldLength && i < newLength; i++) {
        patch(parentEl.childNodes[i], oldChildren[i], newChildren[i]);
    }
    while (chel.length > newLength) {
        parentEl.removeChild(chel[chel.length - 1]);
    }
    while (chel.length < newLength) {
        parentEl.appendChild((0, _make2.default)(newChildren[i++]));
    }
}

function setComponentInstance(oldnode, newnode) {
    var instances = oldnode.component.instances;
    var index = instances.indexOf(oldnode);
    if (newnode) instances.splice(index, 1, newnode);else instances.splice(index, 1);
}

function patch(el, oldnode, newnode) {
    if (oldnode.component) {
        if (oldnode.component === newnode.component) {
            setComponentInstance(oldnode, newnode);
            el = patch(el, oldnode.vnode, newnode.vnode);
            newnode.el = el;
        } else {
            setComponentInstance(oldnode);
            el = replace(el, newnode);
        }
    } else if (oldnode.tag) {
        if (oldnode.tag === newnode.tag) {
            (0, _attr2.default)(el, oldnode.attr, newnode.attr);
            updateChildren(el, oldnode.chld, newnode.chld);
        } else {
            el = replace(el, newnode);
        }
    } else if (oldnode !== newnode) {
        el = replace(el, newnode);
    }
    return el;
}
},{"./attr":14,"./make":7}],8:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = h;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function h(type, attr) {
    for (var _len = arguments.length, chld = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        chld[_key - 2] = arguments[_key];
    }

    var _ref, _ref2;

    attr = attr || {};
    chld = (_ref = []).concat.apply(_ref, _toConsumableArray((_ref2 = []).concat.apply(_ref2, _toConsumableArray(chld)))); //flatten children into a single array
    if (!!type.func) return {
        component: type,
        vnode: type.func(Object.assign({}, attr, type.state), chld),
        attr: attr,
        chld: chld
    };
    if (typeof type === 'function') return type(attr, chld);
    return { tag: type, attr: attr, chld: chld };
}
},{}],9:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.define = define;
exports.update = update;

var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

var _h = require('./h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function define(func) {
    var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
        func: func,
        state: initial,
        instances: []
    };
}

function update(component) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    component.state = state;
    component.instances.forEach(function (inst) {
        (0, _patch2.default)(inst.el, inst, (0, _h2.default)(component, Object.assign({}, inst.attr), inst.chld));
    });
}
},{"./patch":6,"./h":8}],4:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = exports.define = exports.h = exports.make = exports.patch = undefined;
exports.mount = mount;

var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

var _make = require('./make');

var _make2 = _interopRequireDefault(_make);

var _h = require('./h');

var _h2 = _interopRequireDefault(_h);

var _component = require('./component');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.patch = _patch2.default;
exports.make = _make2.default;
exports.h = _h2.default;
exports.define = _component.define;
exports.update = _component.update;
function mount(vnode, parent) {
    if (vnode.func) vnode = (0, _h2.default)(vnode);
    parent.appendChild((0, _make2.default)(vnode));
}
},{"./patch":6,"./make":7,"./h":8,"./component":9}],2:[function(require,module,exports) {
'use strict';

var _index = require('../src/index.js');

var Mach2 = function Mach2(_ref) {
    var state = _ref.state,
        callback = _ref.callback,
        defs = _ref.defs;

    var __callback = function __callback(_) {};
    var _callback = function _callback(_) {
        return __callback();
    };
    var wirer = function wirer(f) {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var ret = f.apply(undefined, [state].concat(args));
            if (typeof ret !== 'undefined') state = ret;
            _callback();
        };
    };
    var d = defs(wirer);
    if (callback) __callback = function __callback(_) {
        return callback(state, d);
    };
    __callback();
    return d;
};

var Deleter = function Deleter(_ref2) {
    var ondelete = _ref2.ondelete;
    return Mach2({
        state: { on: false },
        callback: function callback(state, _ref3) {
            var button = _ref3.button;
            return (0, _index.update)(button, state);
        },
        defs: function defs($) {
            return {
                on: $(function (state) {
                    state.on = true;
                }),
                off: $(function (state) {
                    state.on = false;
                }),
                button: (0, _index.define)(function (state) {
                    return state.on ? (0, _index.h)(
                        'button',
                        { onclick: ondelete },
                        'X'
                    ) : '';
                })
            };
        }
    });
};

var Editor = function Editor(_ref4) {
    var setText = _ref4.setText;
    return Mach2({
        state: { on: false },
        callback: function callback(state, _ref5) {
            var show = _ref5.show;
            return (0, _index.update)(show, state);
        },
        defs: function defs($) {
            var start = $(function (_) {
                return { on: true };
            });
            var set = $(function (s, text) {
                setText(text);
                s.on = false;
            });
            var show = (0, _index.define)(function (props) {
                return props.on ? (0, _index.h)('input', { type: 'text', value: props.text, autofocus: true, onchange: function onchange(ev) {
                        return set(ev.target.value);
                    } }) : (0, _index.h)(props.or);
            });
            return { start: start, show: show };
        }
    });
};

var TodoItem = function TodoItem(_ref6) {
    var text = _ref6.text,
        ondelete = _ref6.ondelete,
        ontoggle = _ref6.ontoggle;
    return Mach2({
        state: { text: text, done: false },
        callback: function callback(state, defs) {
            return (0, _index.update)(defs.view, state);
        },
        defs: function defs($) {
            var deleter = Deleter({ ondelete: ondelete });
            var editor = Editor({ setText: $(function (s, text) {
                    s.text = text;
                }) });
            var toggleDone = $(function (state) {
                state.done = !state.done;
                ontoggle(state.done);
            });
            var setDone = $(function (state, x) {
                state.done = x;
            });
            var view = (0, _index.define)(function (state) {
                return (0, _index.h)(
                    'li',
                    { onmouseover: deleter.on, onmouseleave: deleter.off },
                    (0, _index.h)(editor.show, { text: state.text, or: function or(_) {
                            return (0, _index.h)(
                                'x-',
                                null,
                                (0, _index.h)('input', { type: 'checkbox', onclick: toggleDone, checked: state.done }),
                                (0, _index.h)(
                                    'span',
                                    { onclick: function onclick(_) {
                                            return editor.start();
                                        }, style: state.done ? ' text-decoration: line-through; opacity: 0.5;' : '' },
                                    state.text
                                ),
                                (0, _index.h)(deleter.button, null)
                            );
                        } })
                );
            });

            return { setDone: setDone, view: view };
        }
    });
};

var _Mach = Mach2({
    state: {
        todos: [],
        filter: 'all'
    },
    defs: defs
}),
    view = _Mach.view;

var todos = [];
var filter = 'all';

var addTodo = function addTodo(text) {

    var newTodo = TodoItem({
        text: text,
        ondelete: function ondelete(_) {
            todos.splice(todos.indexOf(newTodo), 1);
            (0, _index.update)(View);
        },
        ontoggle: function ontoggle(x) {
            console.log('ontoglg', x);
            newTodo.done = x;
            resetAllToggle();
        }
    });
    newTodo.done = false;

    todos.push(newTodo);
    resetAllToggle();
};

var submitNewTodo = function submitNewTodo(value) {
    (0, _index.update)(NewTodoInput, { value: '' });
    addTodo(value);
};

var ItemsLeft = function ItemsLeft(_) {
    var n = todos.filter(function (todo) {
        return !todo.done;
    }).length;
    return n ? 'Items left: ' + n : '';
};

var setFilter = function setFilter(val) {
    filter = val;
    (0, _index.update)(View);
};

var FilterSelector = function FilterSelector(_) {
    return ['Filter:', (0, _index.h)(
        'select',
        { onchange: function onchange(ev) {
                return setFilter(ev.target.value);
            } },
        (0, _index.h)(
            'option',
            { value: 'all', selected: filter === "all" },
            'All'
        ),
        (0, _index.h)(
            'option',
            { value: 'complete', selected: filter === "complete" },
            'Complete'
        ),
        (0, _index.h)(
            'option',
            { value: 'active', selected: filter === "active" },
            'Active'
        )
    )];
};

var clearCompleted = function clearCompleted(_) {
    todos = todos.filter(function (t) {
        return !t.done;
    });
    (0, _index.update)(View);
};

var ClearCompletedButton = function ClearCompletedButton(_) {
    return todos.filter(function (t) {
        return t.done;
    }).length > 0 ? (0, _index.h)(
        'button',
        { onclick: clearCompleted },
        'Clear Completed'
    ) : '';
};

var NewTodoInput = (0, _index.define)(function (_ref7) {
    var value = _ref7.value;
    return (0, _index.h)('input', {
        placeholder: 'What needs to get done',
        value: value,
        onchange: function onchange(ev) {
            return submitNewTodo(ev.target.value);
        }
    });
}, { value: '' });

var TodoList = function TodoList(_) {
    return (0, _index.h)(
        'ul',
        null,
        todos.filter({
            all: function all(t) {
                return true;
            },
            complete: function complete(t) {
                return t.done;
            },
            active: function active(t) {
                return !t.done;
            }
        }[filter]).map(function (t) {
            return (0, _index.h)(t.view, null);
        })
    );
};

var allToggle = false;
var resetAllToggle = function resetAllToggle(_) {
    allToggle = false;
    (0, _index.update)(View);
};
var toggleAll = function toggleAll(val) {
    allToggle = val;
    todos.forEach(function (t) {
        t.done = val;
        t.setDone(val);
    });
    (0, _index.update)(View);
};
var ToggleAll = function ToggleAll(_) {
    return (0, _index.h)('input', { title: 'toggle all', type: 'checkbox', onclick: function onclick(_) {
            return toggleAll(!allToggle);
        }, checked: allToggle });
};
var View = (0, _index.define)(function (_) {
    return (0, _index.h)(
        'main',
        null,
        (0, _index.h)(ToggleAll, null),
        ' ',
        (0, _index.h)(NewTodoInput, null),
        (0, _index.h)(TodoList, null),
        (0, _index.h)(ItemsLeft, null),
        ' ',
        (0, _index.h)(FilterSelector, null),
        ' ',
        (0, _index.h)(ClearCompletedButton, null)
    );
});

document.body.innerHTML = '';
(0, _index.mount)(View, document.body);
},{"../src/index.js":4}],16:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
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
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '65503' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
        parents.push(+k);
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
},{}]},{},[16,2])
//# sourceMappingURL=/example.ecda8e97.map