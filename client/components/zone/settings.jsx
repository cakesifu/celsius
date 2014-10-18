/** @jsx React.DOM */

var
  fluxxor = require("fluxxor"),
  React = require("react");

module.exports = React.createClass({
  displayName: "zone/Settings",

  render: function() {
    var zone = this.props.zone;
    return (
      <form className="zone-settings">
        <div className="row">
          <div className="medium-4 columns">
            <label>
              Zone name
              <input type="text" value={zone.name} />
            </label>
          </div>

          <div className="medium-4 columns">
            heater/sensor
          </div>

          <div className="medium-4 columns">
            <p>
              <button className="small expand radius">Save</button>
            </p>
            <p>
              <button className="small expand radius">Cancel</button>
            </p>
          </div>
        </div>
      </form>
    );
  }
});
