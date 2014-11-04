var fluxxor = require("fluxxor");

module.exports = fluxxor.createStore({
  actions: {
    "UNITS_LOAD": "onUnitsLoad",
    "UNITS_LOAD_SUCCESS": "onUnitsLoadSuccess",
    "UNITS_LOAD_ERROR": "onUnitsLoadError",
  },

  initialize: function() {
    this.units = [];
    this.loading = true;
    this.error = false;
    this.emit("change");
  },

  onUnitsLoad: function() {
    this.load = true;
    this.error = false;
    this.emit("change");
  },

  onUnitsLoadSuccess: function(units) {
    this.units = units;
    this.loading = false;
    this.error = false;
    this.emit("change");
  },

  onUnitsLoadError: function(err) {
    this.loading = false;
    this.error = true;
    this.emit("change");
  }
});
