var React = require('react'),
    atom = require('../lib/atom'),
    _ = require('../lib/proton');

var App = require('./layouts/app.jsx');

module.exports = React.createClass({
  componentDidMount() {
    atom.registerProton(atom.get(), this.update);
  },
  componentDidUnmount() {
    atom.unregisterProton(atom.get(), this.update);
  },
  update() {
    this.forceUpdate();
  },
  render() {
    console.log('>>> ROOT: Full Tree Update (optimized)');
    var state = _.wrap(atom.get());
    return (<App state={state} />);
  }
});
