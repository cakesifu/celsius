var Fluxxor = require("fluxxor"),
    api = require("../lib/api");

var SessionStore = Fluxxor.createStore({
  actions: {
    "LOAD_SESSION", "setSession"
  },
  initialize: function() {
    this.session = {};
  },

  getState: function() {
    return this.session;
  },

  setSession: function(data) {
    this.session = data;
    this.emit("change");
  }
});

module.exports = SessionStore;
