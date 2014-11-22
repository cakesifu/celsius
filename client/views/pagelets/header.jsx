/** @jsx React.DOM */

var React = require("react"),
    fluxxor = require("fluxxor"),
    ZoneMenu = require("../components/zone_menu");


module.exports = React.createClass({
  displayName: "Header",
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
    return(
      <div className="header-widget">
        <nav className="top-bar">
          <ul className="title-area">
            <li className="name">
              <h1><a>Celsius</a></h1>
            </li>
            <li className="divider"></li>
          </ul>
          <section className="top-bar-section">
            <ZoneMenu />
            <ul className="right">
              <li className="divider"></li>
              <li className="has-dropdown not-click">
                <a>{this.state.user.name}</a>
                <ul className="dropdown">
                  <li><a>Profile</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </li>
            </ul>
          </section>
        </nav>
      </div>
    );

  }
});
