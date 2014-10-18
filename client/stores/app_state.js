var fluxxor = require("fluxxor");

module.exports = fluxxor.createStore({
  actions: {
    "toggle_zone_settings": "onToggleZoneSettings",
  },
  initialize: function() {
    this.zoneSettingsVisible = false;
  },

  onToggleZoneSettings: function() {
    this.zoneSettingsVisible = !this.zoneSettingsVisible;
    this.emit("change");
  },

  getState: function() {
    return {
      zoneSettingsVisible: this.zoneSettingsVisible
    }
  }
});
