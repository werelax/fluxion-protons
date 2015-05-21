var fn = require('fn.js'),
    mori = require('mori');

// atom state

var state;
var listeners = [];
var atom;

// some utils

var slice = Array.prototype.slice;
var getArgs = function() { return slice.call(arguments); };

function wrap(op, args) {
  // slice.call so I can pass 'arguments' directly
  args = slice.call(args);
  return mori[op].apply(mori, [atom.get()].concat(args));
}

// simple publisher

var notifySwap = function(state) {
  for (var i=listeners.length; i--;) listeners[i](state);
};

// TODO: Think about this: notifySwap being async causes trouble!
// for ex. if you want to separate command from query, so tue
// queries from the view can be free from side effects, the .emit()
// should finish before the query. Maybe this issue can be solve
// with a promise and promise-propagation betweeen debounced calls.
// FOR NOW: it remains sync, non-debounced.

// notifySwap = fn.debounce(notifySwap, 0);

// the atom per se

atom = {
  get() {
    return state;
  },
  silentSwap(newState) {
    state = newState;
    return newState;
  },
  swap(newState) {
    atom.silentSwap(newState);
    notifySwap(state);
    return newState;
  },
  addChangeListener(cb) {
    listeners.push(cb);
  },
  removeChangeListener(cb) {
    listeners = fn.filter(e => x !== cb, listeners);
  }
};

atom = fn.merge(atom, {
  // extend it with some mori ops
  getIn: fn.compose(fn.partial(wrap, 'getIn'), getArgs),
  // getArgs -> pack arguments list as an array
  assocIn: fn.compose(atom.swap, fn.partial(wrap, 'assocIn'), getArgs),
  updateIn: fn.compose(atom.swap, fn.partial(wrap, 'updateIn'), getArgs),
  silentAssocIn: fn.compose(atom.silentSwap,
                            fn.partial(wrap, 'assocIn'),
                            getArgs),
  silentUpdateIn: fn.compose(atom.silentSwap,
                             fn.partial(wrap, 'updateIn'),
                             getArgs)
});

module.exports = atom;
