/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react"),

    Settings = require("./settings");

module.exports = React.createClass({
  displayName: "zone/Current",
  mixins: [
    fluxxor.FluxMixin(React),
    fluxxor.StoreWatchMixin("currentZone"),
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();

    return {
      zone: flux.store("currentZone").getState()
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
    return(
      <div className="row zone-status">
        <div className="panel temperature small-6 medium-4 columns">
          temperature
        </div>
        <div className="panel heater small-6 medium-4 columns">
          heater
        </div>
      </div>
    );
  },

  onSaveSettings: function(data) {
    this.getFlux().actions.updateZone(this.state.zone, data);
  },

});
