/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxChildMixin(React),
    fluxxor.StoreWatchMixin("zones")
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      zones: flux.store("zones").getState()
    };
  },

  onZoneClick: function(ev) {
    console.log("Set current zone to:", ev);

  },

  render: function() {
    var zones = this.state.zones || [];
    return (
      <ul className="zone-menu">{zones.map(this.renderZone)}</ul>
    );
  },

  renderZone: function(zone) {
    return (
      <li key={zone._id}>
        <a onClick={this.onZoneClick}>{zone.name}</a>
      </li>
    );
  }
});

