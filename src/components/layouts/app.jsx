var React = require('react'),
    N = require('../../lib/neutron'),
    _ = require('../../lib/proton'),
    m = require('mori'),
    TodoForm = require('../elements/todo_form.jsx'),
    TodoList = require('../elements/todo_list.jsx'),
    TodoFooterSelector = require('../elements/todo_footer_selector.jsx');

module.exports = N(function(proton) {
  var todos = _.derive(proton, ['data', 'todos']),
      form = _.derive(proton, ['session', 'ui', 'form'], m.hashMap());
  console.log('~~> render app')
  return (
    <div>
	<section id="todoapp">
            <TodoForm s={form} todos={todos}/>
	    <TodoList s={todos} />
            <TodoFooterSelector s={todos} />
	</section>
        <footer id="info">
	    <p>Redflow + Protons = ToDo</p>
	    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
	</footer>
    </div>
  );
});
