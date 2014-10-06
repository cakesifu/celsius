var request = require("superagent"),
    _ = require("lodash"),

    defer = _.defer;

module.exports = {
  getSession: function(callback) {

    request.get("/session/current").end(function(err, res) {
      if (err) {
        return defer(callback, err);
      }

      defer(callback, err, res.body);
    });
  },

  getZones: function(callback) {
    request.get("/zones").end(function(err, res) {
      if (err) {
        return defer(callback, err);
      }

      defer(callback, err, res.body);
    });
  }
};

