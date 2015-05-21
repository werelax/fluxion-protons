var React = require('react'),
    _ = require('../../lib/proton'),
    emit = require('../../lib/dispatcher').emit;

module.exports = React.createClass({
  mixins: [require('../../mixins/with_proton')],
  onChange(e) {
    emit('TODO:FORM:CHANGE', this.props.state, e.target.value);
  },
  render() {
    console.log('render form!');
    var state = this.getState(),
        value = _.get(state, 'value', '');
    return (
      <header id="header">
	  <h1>todos</h1>
	  <input id="new-todo" placeholder="What needs to be done?" autofocus
                 value={value} onChange={this.onChange}/>
      </header>
    );
  }
});
