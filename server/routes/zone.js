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
  router.put("/:zoneId", updateZone);
  router.get("/:zoneId/sensor", getSensor);

  function getZones(req, res) {
    res.json(_.values(zones));
  }

  function getZone(req, res) {
    var zone = req.zone;
    zone.sensor.read(app.get("broker"));
    res.json(zone.asJson());
  }

  function createZone(req, res) {
    zones.createZone(req.body, function(err, zone) {
      if (err) {
        console.err(err);
        return err;
      }
      res.status(201)
         .location("/zone/" + zone._id)
         .end();
    });
  }

  function getSensor(req, res) {
    var sensor = req.zone.sensor,
        broker = app.get("broker");
    sensor.read(broker);
    res.json(sensor.asJson());
  }

  function updateZone(req, res) {
    req.zone.update(req.body, function(err, zone) {
      if (err) {
        return res.send(500);
      }
      res.send(zone.asJson());
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
