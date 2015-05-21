var atom = require('./lib/atom'),
    React = require('react'),
    initialState = require('./config/initial_state'),
    RootComponent = require('./components/root.jsx'),
    router = require('./routes'),
    _ = require('mori');

// Passive stores

require('./stores/fake_insert');

// Debug

window.atom = atom;
window._ = _;

//

window.onload = function() {
  // init state atom
  atom.swap(_.toClj(initialState));

  // init routing
  router.start();

  // init react
  React.render(React.createElement(RootComponent, null),
               document.body);
};
