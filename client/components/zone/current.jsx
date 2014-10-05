/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxChildMixin(React),
    fluxxor.StoreWatchMixin("currentZone")
  ],

  getStateFromFlux: function() {
    return {};
  },

  render: function() {
    throw "whatever";
    var zone = this.state.zone || {};
    return (
      <div>current zone is: {zone.name}</div>
    );

  },

});
