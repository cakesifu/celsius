/** @jsx React.DOM */

var
    fluxxor = require("fluxxor"),
    React = require("react"),

    Login = require("./login"),
    Header = require("./pagelets/header"),
    PageWrapper = require("./components/page_wrapper"),
    CurrentZone = require("./pages/current_zone");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxMixin(React),
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

