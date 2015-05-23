var React = require('react'),
    withProton = require('../mixins/with_proton');

module.exports = function(fn, ...mixins) {
  var updateFn = fn;
  return React.createClass({
    mixins: [withProton, ...mixins],
    render: function() {
      var res = updateFn(this.proton(), this.props, this);
      if (typeof(res) === 'function') {
        updateFn = res;
        res = updateFn(this.proton(), this.props, this);
      }
      this.render = () => updateFn(this.proton(), this.props, this);
      return res;
    }
  });
};
