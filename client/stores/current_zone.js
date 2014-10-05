var fluxxor = require("fluxxor"),
    api = require("../lib/api");

module.exports = fluxxor.createStore({
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


