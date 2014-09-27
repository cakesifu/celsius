var event = require("events"),
    _ = require("lodash"),
    util = require("util"),
    Fluxxor = require("fluxxor"),
    React = require("react"),
    Application = require("./components/application"),
    stores = require("./stores"),
    actions = require("./actions"),
    dom = React.DOM;

function App() {
}

App.createApp = function(element) {
  var app, appStores, flux;

  appStores = {
    "session": new stores.SessionStore()
  };

  flux = new Fluxxor.Flux(appStores, actions);
  app = new Application({ flux: flux });

  React.renderComponent(app, element);
};

var el = document.getElementById("client");
console.log(el);
if (el) {
  App.createApp(el);
}
