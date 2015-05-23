var React = require('react'),
    withProton = require('../mixins/with_proton');

module.exports = function(fn, ...mixins) {
  return React.createClass({
    mixins: [withProton, ...mixins],
    render: function() {
      return fn(this.proton(), this.props);
    }
  });
};
