var _ = require('mori'),
    r = require('ramda'),
    atom = require('../lib/atom');

module.exports = {
  update() {
    var s = {},
        p = this.proton();
    if (this._isComposed(p))
      for (let k in p) s[k] = atom.refresh(p[k]);
    else
      s = atom.refresh(p);
    this.setState({state: s});
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
  _isComposed(s) {
    return !_.isCollection(s) && r.is(Object, s);
  },
  _do: function(s, fn) {
    if (this._isComposed(s))
      Object.keys(s).forEach(k => fn(s[k]));
    else
      fn(s);
  },
  shouldComponentUpdate(nextProps, nextState) {
    var next = nextState.state || nextProps.state,
        actual = this.proton();
    if (this._isComposed(actual)) {
      for (let k in actual)
        if (!_.equals(actual[k], next[k])) return true;
      return false;
    } else
      return !_.equals(actual, next);

   },
  componentDidMount() {
    this._do(this.props.state,
             (p) => atom.registerProton(p, this.update));

  },
  componentWillUnmount() {
    this._do(this.props.state,
             (p) => atom.unregisterProton(p, this.update));
  }
};
