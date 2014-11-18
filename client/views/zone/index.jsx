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

    return (
      <div>{this.state.zone.name}</div>
    );

  },

});

