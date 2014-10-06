var Fluxxor = require("fluxxor"),
    api = require("../lib/api");

var SessionStore = Fluxxor.createStore({
  initialize: function() {
    this.session = {};

    this.bindActions("load_session", this.setSession);
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
