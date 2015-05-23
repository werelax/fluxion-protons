var N = require('../../lib/neutron'),
    sender = require('../../lib/dispatcher').sender,
    React = require('react'),
    TodoItem = require('./todo_item.jsx'),
    _ = require('../../lib/proton'),
    m = require('mori'),
    todoItem = require('../../stores/todo_item'),
    todosList = require('../../stores/todos_list');

function todoItems(p) {
  var todos = todosList.getTodosP(p);
  return m.map((p) => (<TodoItem key={todoItem.getId(p)} s={p} />), todos);
}

module.exports = N(function(proton) {
  var allComplete = todosList.areAllChecked(proton);
  console.log('~~~> render list');
  return (
    <section id="main">
        <input id="toggle-all" type="checkbox" checked={allComplete}
               onChange={sender('TODO:LIST:SELECT:ALL', proton)}/>
	<label htmlFor="toggle-all" >Mark all as complete</label>
        <ul id="todo-list">
            {m.intoArray(todoItems(proton))}
        </ul>
    </section>
  );
});
