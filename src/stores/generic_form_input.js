var atom = require('../lib/atom'),
    _ = require('../lib/proton'),
    m = require('mori'),
    listen = require('../lib/dispatcher').listen;

module.exports = {
  change: listen('INPUT:CHANGE', (proton, value) => {
    atom.assimilate(proton,
                    m.assoc(_.deref(proton), 'value', value));
  }),
  clear: listen('INPUT:CLEAR', (proton, value) => {
    atom.assimilate(proton,
                    m.assoc(_.deref(proton), 'value', ''));
  })
};
