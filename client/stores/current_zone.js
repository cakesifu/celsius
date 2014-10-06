var fluxxor = require("fluxxor"),
    api = require("../lib/api");

module.exports = fluxxor.createStore({
  actions: {
    "set_current_zone": "onSetZone",
    "load_zones": "onLoadZones",
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
  }
});


