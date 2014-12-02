var express = require("express"),
    _ = require("lodash"),
    config = require("../../config");


module.exports = function(app) {
  var router = express.Router(),
      zones = app.get("zones");

  router.param("zoneId", retreiveZone, ensureZone);
  router.get("/", getZones);
  router.post("/", createZone);
  router.get("/:zoneId", getZone);
  router.get("/:zoneId/history", getZoneHistory);
  router.put("/:zoneId", updateZone);

  function getZones(req, res) {
    res.json(_.values(zones));
  }

  function getZone(req, res) {
    var zone = req.zone;
    res.json(zone);
  }

  function getZoneHistory(req, res) {
    var zone = req.zone;

    zone.getHistory({}, function(err, records) {
      if (err) {
        return res.send(500);
      }

      res.json(records);
    });
  }

  function createZone(req, res) {
    zones.createZone(req.body, function(err, zone) {
      if (err) {
      }
      res.status(201)
         .location("/zone/" + zone._id)
         .end();
    });
  }

  function updateZone(req, res) {
    req.zone.update(req.body, function(err, zone) {
      if (err) {
        return res.send(500);
      }

      res.send(zone);
    });
  }

  function retreiveZone(req, res, next, id) {
    req.zone = zones[id];
    next();
  }

  function ensureZone(req, res, next) {
    if (!req.zone) {
      return res.send(404);
    }

    next();
  }

  return router;
};
