/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react");

module.exports = React.createClass({
  displayName: "zone/Menu",
  mixins: [
    fluxxor.FluxMixin(React),
    fluxxor.StoreWatchMixin("zones")
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      zones: flux.store("zones").getState()
    };
  },

  onZoneClick: function(zone) {
    var flux = this.getFlux();
    flux.actions.setCurrentZone(zone);
  },

  render: function() {
    var zones = this.state.zones || [];
    return (
      <ul className="left">
        <li className="divider"></li>
        {zones.map(this.renderZone)}
      </ul>
    );
  },

  renderZone: function(zone) {
    return (
      <li key={zone._id}>
        <a onClick={this.onZoneClick.bind(this, zone)}>{zone.name}</a>
      </li>
    );
  }
});
