var
    api = require("../lib/api");

module.exports = {
  initialize: function() {
    this.flux.actions.loadSession();
    this.flux.actions.loadZones();
  },

  loadSession: function() {
    var dispatch = this.dispatch;

    api.getSession(function(err, session) {
      if (err) {
        console.error("error loading session", err);
        return;
      }

      dispatch("LOAD_SESSION", session);
    });
  },

  loadZones: function() {
    var dispatch = this.dispatch;

    api.getZones(function(err, zones) {
      if (err) {
        console.error("error loading zones", err);
        return;
      }
      dispatch("LOAD_ZONES", zones);
    });
  },

  setCurrentZone: function(zone) {
    this.dispatch("SET_CURRENT_ZONE", zone);
  },

  updateZone: function(zone, data) {
    var dispatch = this.dispatch;

    dispatch("UPDATE_ZONE", zone);

    api.updateZone(zone, data, function(err, zone) {
      if (err) {
        dispatch("UPDATE_ZONE_ERROR", zone);
        return;
      }
      dispatch("UPDATE_ZONE_SUCCESS", zone);
    });
  }
};
