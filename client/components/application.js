/** @jsx React.DOM */

var
    Fluxxor = require("fluxxor"),
    React = require("react");

var Application = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin("session")
  ],

  getInitialState: function() {
    var flux = this.getFlux();
    flux.actions.readSession();
    return {};
  },

  getStateFromFlux: function() {
    var flux = this.getFlux(),
        session = flux.store("session").getState();

    return {
      user: session.user
    };
  },

  render: function() {
    var user = this.state.user,
        content;
    if (user) {
      content = <div>Current user: {user}</div>;
    } else {
      content = <div>Not logged in</div>;
    }

    return (
      <div>{content}</div>
    );
  }
});


module.exports = Application;
