var _ = require('mori'),
    r = require('ramda'),
    atom = require('../lib/atom');

module.exports = {
  update() {
    this.setState({state: atom.refresh(this.props.state)});
  },
  getInitialState() {
    return {};
  },
  proton() {
    return (this.getProton || this.defaultGetProton)();
  },
  defaultGetProton() {
    return this.state.state || this.props.state;
  },
  _wrap(state) {
    if (_.isCollection(state))
      return _.vector(state);
    else if (r.is(Object, state))
      return _.into(_.vector(), _.vals(_.toClj(state)));
    else
      return _.vector(state);
  },
  shouldComponentUpdate(nextProps, nextState) {
    var next = nextState.state || nextProps.state;
    return !_.equals(this._wrap(this.proton()), this._wrap(next));
   },
  componentDidMount() {
    _.each(this._wrap(this.props.state),
           (p) => atom.registerProton(this.props.state, this.update));

  },
  componentWillUnmount() {
    _.each(this._wrap(this.props.state),
           (p) => atom.unregisterProton(this.props.state, this.update));
  }
};
