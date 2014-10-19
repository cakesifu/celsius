var fluxxor = require("fluxxor"),
    _ = require("lodash"),
    api = require("../lib/api");

module.exports = fluxxor.createStore({
  actions: {
    "LOAD_ZONES": "loadZones",
    "UPDATE_ZONE_SUCCESS": "onZoneUpdate"
  },
  initialize: function() {
    this.zones = [];
  },

  loadZones: function(zones) {
    this.zones = zones;
    this.emit("change");
  },

  getState: function() {
    return this.zones;
  },

  onZoneUpdate: function(zone) {
    var existingZone = _.find(this.zones, { id: zone.id });

    if (existingZone) {
      index = this.zones.indexOf(existingZone);
      this.zones[index] = zone;
      this.emit("change");
    }
  }
});
