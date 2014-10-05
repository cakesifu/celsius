/** @jsx React.DOM */

var React = require("react"),
    fluxxor = require("fluxxor");


module.exports = React.createClass({
  mixins: [
    fluxxor.FluxChildMixin(React),
    fluxxor.StoreWatchMixin("session")
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux(),
        session = flux.store("session").getState();

    return {
      user: session.user
    };
  },

  render: function() {
    return(
      <div className="header-widget">
        <p>Hello <strong>{this.state.user.name}</strong></p>
      </div>
    );

  }
});
