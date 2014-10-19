var fluxxor = require("fluxxor"),
    api = require("../lib/api");

module.exports = fluxxor.createStore({
  actions: {
    "SET_CURRENT_ZONE": "onSetZone",
    "LOAD_ZONES": "onLoadZones",
    "UPDATE_ZONE": "onZoneUpdate",
    "UPDATE_ZONE_SUCCESS": "onZoneUpdateComplete",
    "UPDATE_ZONE_ERROR": "onZoneUpdateError",
  },
  initialize: function() {
    this.zone = null;
  },

  getState: function() {
    return this.zone;
  },

  setZone: function(zone) {
    this.zone = zone;
    this.emit("change");
  },

  onLoadZones: function(zones) {
    if (!this.zone && zones.length) {
      this.setZone(zones[0]);
    }
  },

  onSetZone: function(zone) {
    this.setZone(zone);
  },

  onZoneUpdate: function(zone) {
    if (this.zone && this.zone.id == zone.id) {
      this.loading = true;
      this.emit("change");
    }
  },

  onZoneUpdateComplete: function(zone) {
    if (zone.id == this.zone.id) {
      this.setZone(zone);
    }
  },

  onZoneUpdateError: function(zone) {
    if (zone.id == this.zone.id) {
      this.loading = false;
      this.emit("change");
    }
  }
});

