var React = require('react'),
    atom = require('../lib/atom'),
    _ = require('../lib/proton');

var App = require('./layouts/app.jsx');

module.exports = React.createClass({
  componentDidMount() {
    atom.registerObserver(this.update);
  },
  componentDidUnmount() {
    atom.unregisterObserver(this.update);
  },
  update() {
    this.forceUpdate();
  },
  render() {
    console.log('~> render root');
    var state = _.protonize(atom.get());
    return (<App s={state} />);
  }
});
