var EventEmitter = require('eventemitter3').EventEmitter3,
    fn = require('fn.js');

var dispatcher = new EventEmitter({
  wildcards: true,
  delimiter: ':',
  newListener: false,
  maxListeners: 10
});

dispatcher.listen = function(event, fn) {
  dispatcher.on(event, fn);
  return fn;
};

dispatcher.sender = function(event) {
  var args1 = [].slice.call(arguments);
  return function(e) {
    e.preventDefault();
    var args2 = [].slice.call(arguments);
    dispatcher.emit.apply(dispatcher, args1.concat(args2));
  };
};

// dispatcher.emit = dispatcher.emit.bind(dispatcher);

// just for debug. uncomment prev line and remove this for prod.
dispatcher.emit = (function(emit) {
  // WARNING: this logger will swallow events if fired too fast!!
  // var logger = fn.debounce(console.log.bind(console, '[ Dispatcher ]>'), 500);
  var logger = console.log.bind(console, '[ Dispatcher ]>');
  return function() {
    var args = [].slice.call(arguments);
    if (args[0] !== 'newListener')
      logger(...args);
    return emit.apply(dispatcher, args);
  };
})(dispatcher.emit);

module.exports = dispatcher;
