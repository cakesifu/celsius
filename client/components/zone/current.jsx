/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxChildMixin(React),
    fluxxor.StoreWatchMixin("currentZone")
  ],

  render: function() {
    return (
      <div>current zone is: {zone.name}</div>
    );

  },

});
