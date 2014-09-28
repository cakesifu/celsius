var request = require("superagent");

module.exports = {
  getSession: function(callback) {
    request.get("/session/current").end(function(res) {
      callback(res.body);
    });
  },

  getZones: function(callback) {
    request.get("/zones").end(function(err, res) {
      callback(err, res.body);
    });
  }
};
