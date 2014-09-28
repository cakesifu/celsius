var Fluxxor = require("fluxxor"),
    api = require("../lib/api"),

    ZoneStore;

ZoneStore = Fluxxor.createStore({
  initialize: function() {
    this.zone = {};
    this.bindActions("set_current_zone", this.setZone);
  },

  getState: function() {
    return this.zone;
  },

  setZone: function(zone) {
    this.zone = zone;
    this.emit("change");
  }
});

ZonesStore = Fluxxor.createStore({
  initialize: function() {
    this.zones = [];

    this.bindActions("load_zones", this.loadZones);
  },

  loadZones: function() {
    var self = this;
    api.getZones(function(err, zones) {
      self.setZones(zones);
    });
  },

  setZones: function(zones) {
    this.zones = zones;
    this.emit("change");
  }
});

module.exports.ZoneStore = ZoneStore;
module.exports.ZonesStore = ZonesStore;
