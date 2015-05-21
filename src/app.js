var atom = require('./lib/atom'),
    React = require('react'),
    initialState = require('./config/initial_state'),
    RootComponent = require('./components/root.jsx'),
    router = require('./routes'),
    lang = require('./stores/language'),
    _ = require('mori');

// Passive stores

require('./stores/cross_frame_daemon');
require('./stores/iframe_file_upload');

// Debug

window.atom = atom;
window._ = _;
window.router = router;
window.director = require('director');

// Init

window.onload = function() {
  // init state atom
  atom.silentSwap(_.toClj(initialState));
  lang.initialize();
  // init routing
  router.start();
  // init react
  React.render(React.createElement(RootComponent, null),
               document.getElementById('app'));
};
