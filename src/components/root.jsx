var React = require('react'),
    atom = require('../lib/atom'),
    dispatcher = require('../lib/dispatcher'),
    rootStore = require('../stores/root'),
    fn = require('fn.js'),
    _ = require('mori');

var Pages = {
  Home: require('./layouts/home.jsx'),
  Help: require('./layouts/help.jsx'),
  Policy: require('./layouts/policy.jsx'),
  Contact: require('./layouts/contact.jsx'),
  Exemptions: require('./layouts/exemptions.jsx'),
  CheckStatus: require('./layouts/check_status/check_status.jsx'),
  ApplyFunnel: require('./layouts/apply_funnel.jsx'),
  ApplySuccess: require('./layouts/apply_success.jsx')
};

module.exports = React.createClass({
  componentDidMount() {
    atom.addChangeListener(fn.debounce(this._onChange, 0));
    /* atom.addChangeListener(this._onChange); */
  },
  componentDidUnmount() {
    atom.removeChangeListener(this._onChange);
  },
  _onChange() {
    this.setState({state: atom.get()});
  },
  render() {
    var state = atom.get(),
        activePage = rootStore.getActivePage(state),
        Component = Pages[activePage];
    return (<Component state={state} />);
  }
});
