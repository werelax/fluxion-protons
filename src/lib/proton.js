var mori = require('mori'),
    r = require('ramda');

// utils

function protonize(struct, path) {
  if (!r.is(Object, struct)) return struct;
  struct._proton = true;
  struct._path = path || mori.vector();
  return struct;
}

function reprotonize(struct, prevProto) {
  return protonize(struct, prevProto._path);
}

function getPath(proton) {
  return proton._path || mori.vector();
}

function subpath(proton, segments) {
  if (!r.is(Object, proton))
    return null;
  else if (r.is(Array, segments) || mori.isSeqable(segments))
    return mori.into(getPath(proton), segments);
  else
    return mori.conj(getPath(proton), segments);
}

function preserveWrap(method) {
  return function(data, ...args) {
    return reprotonize(method(data, ...args), data);
  };
}

function creationWrap(method) {
  return function(data, path, ...args) {
    return protonize(method(data, path, ...args), subpath(data, path));
  };
}

// proton object

var proton = Object.create(mori);

for (let method of ['get', 'getIn'])
  proton[method] = creationWrap(proton[method]);

for (let method of ['assoc', 'assocIn', 'updateIn', 'dissoc', 'conj'])
  proton[method] = preserveWrap(proton[method]);

proton.getPath = getPath;

proton.unwrap = function(proton) {
  delete proton._proton;
  delete proton._path;
  return proton;
};

proton.isProton = function(proton) {
  return !!proton._proton;
};


proton.wrap = protonize;

module.exports = proton;
