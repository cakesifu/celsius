var event = require("events"),
    _ = require("lodash"),
    util = require("util"),
    fluxxor = require("fluxxor"),
    React = require("react"),
    Application = require("./views/application"),
    stores = require("./stores"),
    actions = require("./actions");

var el = document.getElementById("client");
if (el) {
  init(el);
}

function init(element) {
  var app, appStores, flux;

  appStores = {
    "session": new stores.Session(),
    "currentZone": new stores.Zone(),
    "zones": new stores.Zones(),
    "app": new stores.AppState(),
    "units": new stores.Units()
  };

  flux = new fluxxor.Flux(appStores, actions);
  app = Application({ flux: flux });

  React.renderComponent(app, element);

  flux.actions.initialize();
}

