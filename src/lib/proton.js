var mori = require('mori'),
    r = require('ramda');

// utils

function protonize(struct, path) {
  if (!r.is(Object, struct)) return struct;
  struct._proton = true;
  struct._path = path || [];
  return struct;
}

function reprotonize(struct, prevProto) {
  return protonize(struct, prevProto._path);
}

function subpath(proton, segments) {
  if (!r.is(Object, proton)) return null;
  return proton._path.concat(segments);
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

proton.getPath = function(proton) {
  return proton._path;
};

proton.isProton = function(proton) {
  return !!proton._proton;
};

proton.unwrap = function(proton) {
  delete proton._proton;
  delete proton._path;
  return proton;
};

proton.wrap = protonize;

module.exports = proton;
