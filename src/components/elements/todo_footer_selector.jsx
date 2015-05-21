var React = require('react');

module.exports = React.createClass({
  render() {
    return (
      <footer id="footer">
	  <span id="todo-count"></span>
	  <ul id="filters">
	      <li>
		  <a href="#/" className="selected">All</a>
	      </li>
	      <li>
		  <a href="#/active">Active</a>
	      </li>
	      <li>
		  <a href="#/completed">Completed</a>
	      </li>
	  </ul>
	  <button id="clear-completed">Clear completed</button>
      </footer>
    );
  }
});
