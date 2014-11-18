var
    api = require("../lib/api"),
    serverUpdates = require("../services/server_updates");

module.exports = {
  initialize: function() {
    var actions = this.flux.actions,
        dispatch = this.dispatch;
    actions.loadSession();
    actions.loadZones();

    serverUpdates.on("update:currentZone", function(zone) {
      dispatch("SET_CURRENT_ZONE", zone);
    });

    serverUpdates.start();

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
    var dispatch = this.dispatch,
        actions = this.flux.actions;

    api.getZones(function(err, zones) {
      if (err) {
        console.error("error loading zones", err);
        return;
      }
      dispatch("LOAD_ZONES", zones);
      actions.setCurrentZone(zones[0]);
    });
  },

  setCurrentZone: function(zone) {
    this.dispatch("SET_CURRENT_ZONE", zone);
    serverUpdates.setCurrentZone(zone);
  },

  updateZone: function(zone, data) {
    var dispatch = this.dispatch;

    dispatch("UPDATE_ZONE", zone);

    api.updateZone(zone, data, function(err, zone) {
      if (err) {
        dispatch("UPDATE_ZONE_ERROR", err);
        return;
      }
      dispatch("UPDATE_ZONE_SUCCESS", zone);
    });
  }

};
