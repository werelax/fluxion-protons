var React = require('react');

module.exports = React.createClass({
  render() {
    return (
      <li className="">
          <div className="view">
              <input className="toggle" type="checkbox" />
              <label>asdf</label>
              <button className="destroy" />
          </div>
      </li>
    );
  }
});
