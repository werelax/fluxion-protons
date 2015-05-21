var React = require('react'),
    atom = require('../lib/atom'),
    _ = require('../lib/proton');

var App = require('./layouts/app.jsx');

module.exports = React.createClass({
  render() {
    var state = _.wrap(atom.get());
    return (<App state={state} />);
  }
});
