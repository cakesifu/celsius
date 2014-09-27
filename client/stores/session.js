var Fluxxor = require("fluxxor"),
    api = require("../lib/api");

var SessionStore = Fluxxor.createStore({
  initialize: function() {
    this.session = {};

    this.bindActions("load_session", this.onLoadSession);
  },

  getState: function() {
    return this.session;
  },

  onLoadSession: function() {
    api.getSession(this.setSession.bind(this));
  },

  setSession: function(data) {
    this.session = data;
    this.emit("change");
  }
});

module.exports = SessionStore;
