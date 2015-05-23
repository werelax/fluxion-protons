var m = require('mori'),
    r = require('ramda'),
    proton = require('../lib/proton'),
    atom = require('../lib/atom');

function is(type, thing) {
  return typeof(thing) === type;
}

var sortedKeys = r.compose(r.sort, r.keys);
var derefProp = r.compose(proton.deref, r.prop);
var pathProp = r.compose(proton.path, r.prop);

module.exports = {
  proton() {
    return this.props.s;
  },
  shouldComponentUpdate(nextProps, nextState) {
    var next = nextProps.s,
        actual = this.proton();
    switch(true) {
    case Array.isArray(actual) && Array.isArray(next):
      return !(r.all(r.apply(m.equals), r.zip(r.map(proton.path, actual),
                                              r.map(proton.path, next))) &&
               r.all(r.apply(m.equals), r.zip(r.map(proton.deref, actual),
                                              r.map(proton.deref, next))));
    case proton.isProton(actual) && proton.isProton(next):

      return !(m.equals(proton.path(actual), proton.path(next)) &&
               m.equals(proton.deref(next), proton.deref(actual)));
    case is('object', actual) && is('object', next):
      return !(r.all(r.apply(m.equals),
                     r.zip(r.map(pathProp, sortedKeys(actual)),
                           r.map(pathProp, sortedKeys(next)))) &&
               r.all(r.apply(m.equals),
                    r.zip(r.map(derefProp, sortedKeys(actual)),
                          r.map(derefProp, sortedKeys(next)))));
    default:
      return next !== actual;
    }
  }
};
