var atom = require('./lib/atom'),
    React = require('react'),
    initialState = require('./config/initial_state'),
    RootComponent = require('./components/root.jsx'),
    router = require('./routes'),
    m = require('mori');

// Passive stores

require('./stores/todos_list');
require('./stores/todo_item');
require('./stores/generic_form_input');

// Debug

window.atom = atom;
window.m = m;

//

window.onload = function() {
  // init state atom
  atom.swap(m.toClj(initialState));

  // init routing
  router.start();

  // init react
  React.render(React.createElement(RootComponent, null),
               document.body);
};
