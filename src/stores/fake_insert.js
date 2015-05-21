var atom = require('../lib/atom'),
    _ = require('../lib/proton'),
    listen = require('../lib/dispatcher').listen;

module.exports = {
  jarl: listen('FAKE:INSERT', (proton) => {
    proton = _.conj(proton, 'yeah!');
    atom.assimilate(proton);
  }),
  change: listen('TODO:FORM:CHANGE', (proton, value) => {
    proton = _.assoc(proton, 'value', value);
    atom.assimilate(proton);
  })
};
