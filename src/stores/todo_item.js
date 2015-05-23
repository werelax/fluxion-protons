/* DOMAIN: operations and queries on individual todo items */

var atom = require('../lib/atom'),
    m = require('mori'),
    _ = require('../lib/proton'),
    listen = require('../lib/dispatcher').listen;

module.exports = {

  // commands

  create(text, id) {
    return m.hashMap('text', text, 'id', id, 'checked', false);
  },
  check(proton) {
    return m.assoc(_.deref(proton), 'checked', true);
  },
  uncheck(proton) {
    return m.assoc(_.deref(proton), 'checked', false);
  },
  toggleCheck: listen('TODO:ITEM:TOGGLE', function(proton) {
    if (module.exports.isChecked(proton))
      atom.assimilate(proton, module.exports.uncheck(proton));
    else
      atom.assimilate(proton, module.exports.check(proton));
  }),

  // queries

  isChecked(proton) {
    return _.deref(proton, 'checked');
  },
  getText(proton) {
    return _.deref(proton, 'text');
  },
  getId(proton) {
    return _.deref(proton, 'id');
  }
};
