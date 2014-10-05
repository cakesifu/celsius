var fluxxor = require("fluxxor"),
    api = require("../lib/api");

module.exports = fluxxor.createStore({
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
