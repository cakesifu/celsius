/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react"),

    Login = require("./login"),
    Header = require("./header"),
    PageWrapper = require("./page/wrapper"),
    CurrentZone = require("./zone/current");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxMixin(React),
    fluxxor.StoreWatchMixin("session")
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
    if (!this.state.user) {
      return (
        <Login />
      );
    }

    return (
      <PageWrapper>
        <Header />
        <CurrentZone />
      </PageWrapper>
    );
  }
});

