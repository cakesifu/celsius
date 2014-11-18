/** @jsx React.DOM */

var React = require("react"),
    fluxxor = require("fluxxor");

module.exports = React.createClass({
  displayName: "Login",
  mixins: [
    fluxxor.FluxMixin(React),
  ],

  loginGoogle: function() {
    var url = "/auth/google";

    console.log("login with:", strategy);
    document.location.href = url;
  },

  render: function() {
    return (
      <div className="login-widget">
        <h1>You're not currently logged in</h1>
        <p>Login options: </p>
        <ul>
          <li><a onClick={this.loginGoogle}>Google openid</a></li>
        </ul>
      </div>
    );
  }

});
