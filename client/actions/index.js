var
    api = require("../lib/api");

module.exports = {
  initialize: function() {
    this.flux.actions.loadSession();
    this.flux.actions.loadZones();
  },

  loadSession: function() {
    var self = this;

    api.getSession(function(err, session) {
      if (err) {
        console.error("error loading session", err);
        return;
      }

      self.dispatch("load_session", session);
    });
  },

  loadZones: function() {
    var self = this;

    api.getZones(function(err, zones) {
      if (err) {
        console.error("error loading zones", err);
        return;
      }
      self.dispatch("load_zones", zones);
    });
  }


};
