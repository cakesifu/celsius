/** @jsx React.DOM */

var React = require("react"),
    fluxxor = require("fluxxor");

module.exports = React.createClass({
  mixins: [
    fluxxor.FluxChildMixin(React),
  ],

  loginInit: function(strategy) {
    var self = this;

    return function() {
      console.log("login with:", strategy);
    }
  },


  render: function() {
    return (
      <div className="login-widget">
        <h1>You're not currently logged in</h1>
        <p>Login options: </p>
        <ul>
          <li><a onClick={this.loginInit("google")}>Google openid</a></li>
        </ul>
      </div>
    );
  }

});
