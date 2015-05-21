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
    var anchor = atom.getIn(['navigation', 'anchor'], false);
    if (anchor) {
      window.location.hash = anchor;
    } else {
      $(document.body).removeClass('menu-is-shown');
      setTimeout(_.partial(emit, 'ROUTING:SETPAGE', componentName), 0);
    }
  };
}

function resetForm() {
  emit('APPLICATION:RESET:FORM');
  emit('FUNNEL:CANCEL');
}

var routes = {
  home: {path: '/', fn: setPage('Home')},
  help: {path: '/help', fn: setPage('Help')},
  policy: {path: '/policy', fn: setPage('Policy')},
  exemptions: {path: '/exemptions', fn: setPage('Exemptions')},
  contact: {path: '/contact', fn: setPage('Contact')},
  checkStatus: {path: '/check', fn: setPage('CheckStatus')},
  applySuccess: {path: '/apply/ok', fn: setPage('ApplySuccess')},
  applyFunnel: {path: '/apply', fn: serial(resetForm, setPage('ApplyFunnel'))}
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
