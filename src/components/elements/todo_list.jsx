var React = require('react'),
    TodoItem = require('./todo_item.jsx'),
    dispatcher = require('../../lib/dispatcher');

module.exports = React.createClass({
  mixins: [require('../../mixins/with_proton')],
  fakeInsert() {
    dispatcher.emit('FAKE:INSERT', this.props.state);
  },
  render() {
    console.log('render list!');
    return (
      <section id="main">
          <input id="toggle-all" type="checkbox" />
	  <label htmlFor="toggle-all">Mark all as complete</label>
          <ul id="todo-list" onClick={this.fakeInsert}>
              <TodoItem />
          </ul>
      </section>
    );
  }
});
