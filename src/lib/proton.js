var m = require('mori');

function is(type, thing) {
  return typeof(thing) === type;
}

function getPath(proton) {
  return proton.path;
}

var protonPrototype = {
  toString: function() {
    return `#proton<${getPath(this).toString()}>`;
  }
};

function isProton(p) {
  return protonPrototype.isPrototypeOf(p);
}

function protonize(state, path, defaultValue) {
  return Object.create(protonPrototype, {
    state: { value: state },
    path: { get: () => (path || m.vector()) },
    defaultValue: { value: defaultValue }
  });
}

function deref(proton, path) {
  if (!isProton(proton))
    return proton;
  else if (path !== undefined)
    // the second undefined? Because babel tail-call optimization is leaky!
    return deref(derive(proton, path), undefined);
  else
    return fetch(proton, proton.state);
}

function fetch(proton, state) {
  return m.getIn(state, m.intoArray(getPath(proton)), m.defaultValue);
}

function derivePath(proton, path) {
  if (Array.isArray(path))
    return m.into(getPath(proton), path);
  else
    return m.conj(getPath(proton), path);
}

function derive(proton, subpath, defValue) {
  var path = derivePath(proton, subpath);
  return protonize(proton.state, path, defValue);
}

function seq(proton) {
  return m.map((el, i) => derive(proton, i), deref(proton), m.range());
}

function hash(proton) {
  return m.hash(getPath(proton));
}

var deriveSeq = m.comp(seq, derive);

var proton = {protonize, isProton, deref, fetch, derive, seq, hash, deriveSeq};
proton.path = getPath;

module.exports = proton.deref;
for (let k in proton)
  module.exports[k] = proton[k];
