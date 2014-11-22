/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react"),

    Settings = require("../pagelets/settings");

module.exports = React.createClass({
  displayName: "pages/CurrentZone",
  mixins: [
    fluxxor.FluxMixin(React),
    fluxxor.StoreWatchMixin("currentZone", "units"),
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();

    return {
      zone: flux.store("currentZone").getState(),
      units: flux.store("units").units
    };
  },

  getInitialState: function() {
    return {
      showSettings: false
    };
  },

  toggleSettingsPanel: function() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  },

  render: function() {
    var zone = this.state.zone || {};
    return (
      <section className="current-zone">
        {this.renderTitle()}
        {this.renderSettings()}
        {this.renderStatus()}
      </section>
    );
  },

  renderSettings: function() {
    if (this.state.showSettings) {
      return (
        <Settings zone={this.state.zone}
                  units={this.state.units}
                  onSave={this.onSaveSettings}
                  onCancel={this.toggleSettingsPanel} />
      );
    }
  },

  renderTitle: function() {
    var zone = this.state.zone || {};
    return(
      <div className="zone-title">
        <h1>
          {zone.name}
          <button className="tiny radius " onClick={this.toggleSettingsPanel}>Settings</button>
        </h1>
      </div>
    );
  },

  renderStatus: function() {
    var zone = this.state.zone,
        sensor = zone && zone.sensor,
        targetTemp = zone && zone.targetTemperature || 0;

    return(
      <div className="row zone-status">
        <div className="panel current-temperature small-12 medium-4 columns">
          <h2>current temperature</h2>
          <p>{sensor && sensor.status.value}</p>
        </div>
        <div className="panel target-temperature small-12 medium-4 columns">
          <h2>Target temperature</h2>
          <p>{targetTemp}</p>
          <button onClick={this.setTargetTemp.bind(this, targetTemp + 1)}>+</button>
          <button onClick={this.setTargetTemp.bind(this, targetTemp - 1)}>-</button>
        </div>
        <div className="panel heater small-12 medium-4 columns">
          <h2>heater</h2>
        </div>
      </div>
    );
  },

  setTargetTemp: function(temp) {
    this.getFlux().actions.setTargetTemperature(this.state.zone, temp);
  },

  onSaveSettings: function(data) {
    this.getFlux().actions.updateZone(this.state.zone, data);
  }
});
