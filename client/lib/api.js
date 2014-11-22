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

  getZone: function(id, callback) {
    request.get("/zones/" + id).end(function(err, res) {
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
  },

  updateZone: function(zone, data, callback) {
    request.put("/zones/" + zone._id)
           .send(data)
           .end(done);

    function done(err, res) {
      if (err) {
        return defer(callback, err);
      }

      defer(callback, err, res.body);
    }
  },

  getUnits: function(callback) {
    request.get("/units").end(done);

    function done(err, res) {
      if (err) {
        return defer(callback, err);
      }

      defer(callback, err, res.body);
    }
  }
};

