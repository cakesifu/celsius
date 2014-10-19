/** @jsx React.DOM */

var
  fluxxor = require("fluxxor"),
  React = require("react");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxMixin(React),
    fluxxor.StoreWatchMixin("currentZone")
  ],
  displayName: "zone/Settings",

  getStateFromFlux: function() {
    var flux = this.getFlux(),
        store = flux.store("currentZone");

    return {
      zone: store.zone,
      loading: store.loading
    };
  },


  render: function() {
    var zone = this.state.zone;
    if (!zone) {
      return null;
    }
    return (
      <form className="zone-settings">
        <div className="row">
          <div className="medium-4 columns">
            <label>
              Zone name
              <input type="text" defaultValue={zone.name} ref="name" />
            </label>
          </div>

          <div className="medium-4 columns">
            heater/sensor
          </div>

          <div className="medium-4 columns">
            <p>
              <button onClick={this.saveSettings} className="small expand radius">Save</button>
            </p>
            <p>
              <button className="small expand radius">Cancel</button>
            </p>
          </div>
        </div>
      </form>
    );
  },

  saveSettings: function(ev) {
    var data = this.getZoneData();
    this.getFlux().actions.updateZone(this.state.zone, data);
    ev.preventDefault();
  },

  getZoneData: function() {
    return {
      name: this.refs.name.getDOMNode().value
    }
  },


});
