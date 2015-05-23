var N = require('../../lib/neutron'),
    React = require('react'),
    _ = require('../../lib/proton'),
    m = require('mori'),
    r = require('ramda'),
    dispatcher = require('../../lib/dispatcher'),
    todosListStore = require('../../stores/todos_list');

var filter = r.curryN(3, (filter, p) => {
  dispatcher.emit('TODO:LIST:FILTER', p, filter);
});

function clearCompleted(proton) {
  dispatcher.emit('TODO:LIST:CLEAR:COMPLETED', proton);
}

module.exports = N(function(proton) {
  console.log('~~~> render footer!');
  var activeFilter = todosListStore.getActiveFilter(proton),
      klass = {
        all: (activeFilter === 'all' || !activeFilter) && 'selected',
        active: (activeFilter === 'active') && 'selected',
        completed: (activeFilter === 'completed') && 'selected'
      }
  return (
    <footer id="footer">
	<span id="todo-count"></span>
	<ul id="filters">
	    <li>
		<a href="#/" className={klass.all}
                   onClick={filter('all', proton)}>All</a>
	    </li>
	    <li>
		<a href="#/active" className={klass.active}
                   onClick={filter('active', proton)}>Active</a>
	    </li>
	    <li>
		<a href="#/completed" className={klass.completed}
                   onClick={filter('completed', proton)}>Completed</a>
	    </li>
	</ul>
	<button id="clear-completed" onClick={r.partial(clearCompleted, proton)}>
            Clear completed
        </button>
    </footer>
  );
});
