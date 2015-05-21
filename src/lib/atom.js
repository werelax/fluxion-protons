var r = require('ramda'),
    mori = require('mori'),
    proton = require('./proton');

// atom state

var state;
var listeners = mori.hashMap();
var atom;

// some utils

var slice = Array.prototype.slice;
var getArgs = function() { return slice.call(arguments); };

function wrap(op, args) {
  // slice.call so I can pass 'arguments' directly
  args = slice.call(args);
  return mori[op].apply(mori, [atom.get()].concat(args));
}

function notifyUpdate(path, p) {
  mori.each(mori.get(listeners, path, []), cb => cb(p));
}

// the atom per se

atom = {
  get() {
    return state;
  },
  swap(newState) {
    state = newState;
    return newState;
  },
  registerProton(p, cb) {
    var path = proton.getPath(p);
    listeners = mori.updateIn(listeners, [path],
                              (l) => mori.conj(l || mori.set(), cb));
  },
  unregisterProton(p, cb) {
    var path = proton.getPath(p);
    listeners = mori.updateIn(listeners, [path],
                              (l) => mori.disj(l, cb));
  },
  assimilate(p) {
    if (!proton.isProton(p))
      throw new Error('Not a proton!');
    var path = proton.getPath(p);
    atom.assocIn(path, proton.unwrap(p));
    notifyUpdate(path, p);
  },
  refresh(p) {
    return proton.getIn(proton.wrap(atom.get()),
                        proton.getPath(p));
  }
};

atom = r.merge(atom, {
  // extend it with some mori ops
  getIn: r.compose(r.partial(wrap, 'getIn'), getArgs),
  // getArgs -> pack arguments list as an array
  assocIn: r.compose(atom.swap, r.partial(wrap, 'assocIn'), getArgs),
  updateIn: r.compose(atom.swap, r.partial(wrap, 'updateIn'), getArgs)
});

module.exports = atom;
