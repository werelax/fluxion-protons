var React = require('react'),
    _ = require('../../lib/proton'),
    TodoForm = require('../elements/todo_form.jsx'),
    TodoList = require('../elements/todo_list.jsx'),
    TodoFooterSelector = require('../elements/todo_footer_selector.jsx');

module.exports = React.createClass({
  render() {
    var state = this.props.state,
        data = _.get(state, 'data'),
        todos = _.get(data, 'todos'),
        form = _.get(data, 'form', _.hashMap()),
        ui = _.get(data, 'ui', _.hashMap());

    return (
      <div>
	<section id="todoapp">

            <TodoForm state={{f: form, t: todos}} />
	    <TodoList state={todos} />

            <TodoFooterSelector state={ui} />

	</section>
        <footer id="info">
	    <p>Redflow + Protons = ToDo</p>
	    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
	</footer>
      </div>
    );
  }
});
