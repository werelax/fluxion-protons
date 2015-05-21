var _ = require('mori'),
    atom = require('../lib/atom');

module.exports = {
  update() {
    this.setState({state: atom.refresh(this.props.state)});
  },
  getInitialState() {
    return {};
  },
  getState() {
    return this.state.state || this.props.state;
  },
  shouldComponentUpdate(nextProps, nextState) {
    var next = nextState.state || nextProps.state;
    return !_.equals(this.getState(), next);
  },
  componentDidMount() {
    atom.registerProton(this.props.state, this.update);
  },
  componentWillUnmount() {
    atom.unregisterProton(this.props.state, this.update);
  }
};
