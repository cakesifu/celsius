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
    var flux = this.getFlux();

    return {
      zone: flux.store("currentZone").getState()
    };
  },

  render: function() {
    var zone = this.state.zone || {};
    return (
      <div>current zone is: {zone.name}</div>
    );
  }
});
