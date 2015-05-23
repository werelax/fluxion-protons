var r = require('ramda'),
    mori = require('mori'),
    proton = require('./proton');

// atom state

var state;
var listeners = mori.hashMap();
var observers = [];
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
  registerObserver(fn) {
    observers = r.append(fn, observers);
  },
  unregisterObserver(fn) {
    observers = r.reject(r.eq(fn), observers);
  },
  notifyObservers() {
    r.forEach(r.partialRight(r.call, atom.get()),
              observers);
  },
  assimilate(p, subtree) {
    var path = proton.path(p);
    if (mori.count(path) > 0)
      atom.assocIn(mori.intoArray(path), subtree);
    else
      atom.swap(subtree);
    // notifyUpdate(path, p);
    atom.notifyObservers();
  },
  refresh(p) {
    return proton.getIn(proton.wrap(atom.get()),
                        mori.intoArray(proton.getPath(p)));
  },
  update(fn) {
    atom.swap(fn(atom.get()));
    atom.notifyObservers();
  },
  reload() {
    // just notify a root refresh
    atom.update(mori.identity);
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
