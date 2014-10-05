/** @jsx React.DOM */

var React = require("react"),
    fluxxor = require("fluxxor");

module.exports = React.createClass({
  render: function() {
    return (
      <div className="page-wrapper">
        {this.props.children}
      </div>
    );
  },

});
