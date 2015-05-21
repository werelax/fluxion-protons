var director = require('director'),
    atom = require('./lib/atom'),
    _ = require('mori'),
    emit = require('./lib/dispatcher').emit;

var routerInstance;

// Utils

function fork(pred, f, g) {
  return function() {
    if (pred.apply(null, arguments))
      return f.apply(null, arguments);
    else
      return g.apply(null, arguments);
  };
}

function serial(f, g) {
  return function() {
    f.apply(null, arguments);
    g.apply(null, arguments);
  };
}

function fixUrlHash(h) {
  return h.replace(/#?\!?\/*(.*)/, '#/$1');
}

function navigateTo(route) {
  if (route && route.path)
    window.location.hash = fixUrlHash(route.path);
}

function setPage(componentName) {
  return () => {
    setTimeout(_.partial(emit, 'ROUTING:SETPAGE', componentName), 0);
  };
}

var routes = {
  home: {path: '/', fn: setPage('Home')}
};

function start() {
  var routeTable = {};
  for (var k in routes) if (routes.hasOwnProperty(k)) {
    routeTable[routes[k].path] = routes[k].fn;
  }
  routerInstance = director.Router(routeTable);
  routerInstance.configure({html5history: false});
  routerInstance.init();
  // sometimes the url get messed up (NGINX!)
  navigateTo(window.location.hash);
}

module.exports = {routes, start, navigateTo};
