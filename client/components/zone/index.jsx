var Fluxxor = require("fluxxor"),
    React = require("react"),

    ZoneManager;

ZoneManager = React.createClass({
  mixins: [
    Fluxxor.FluxChildMixin(React),
    Fluxxor.StoreWatchMixin("currentZone")
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      zone: flix.store("currentZone").getState()
    };
  },

  render: function() {

    return (
      <div>{this.state.zone.name}</div>
    );

  },

});


