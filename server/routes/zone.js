var express = require("express"),
    _ = require("lodash"),
    config = require("../../config"),

    Zone = require("../models/zone");

module.exports = function(app) {
  var router = express.Router();

  router.param("zoneId", retreiveZone, ensureZone);
  router.get("/", getZones);
  router.get("/:zoneId", getZone);
  router.get("/:zoneId/sensor", getSensor);

  function getZones(req, res) {
    Zone.all(function(err, zones) {
      res.json(_.invoke(zones, "asJson"));
    });
  }

  function getZone(req, res) {
    res.json(req.zone.asJson());
  }

  function getSensor(req, res) {
    var sensor = req.zone.sensor;
    sensor.read(function(err) {
      if (err) {
        console.log("error reading sensor");
        return res.send(500);
      }
      res.json(sensor.asJson());
    });
  }

  function setSensor(req, res) {
    var sensor = new Sensor(req.body);
    sensor.read(function(err, sensor) {
      if (err) {
        // send error
      }
      zone.update({ sensor: sensorData }, function(err, zone) {
        if (err) {
          // 500
        }

        res.send(200);
      });
    });
  }

  function setTarget(req, res) {
    req.zone.updateFields({

    }, function(err, zone) {

    });
  }

  function getHeater(req, res) {
    req.zone.getHeater(function(err, heater) {
      res.json(heater);
    });
  }

  function retreiveZone(req, res, next, id) {
    Zone.find(id, function(err, zone) {
      if (err) {
        res.send(500);
        return;
      }

      req.zone = zone;
      next();
    });
  }

  function ensureZone(req, res, next) {
    if (!req.zone) {
      return res.send(404);
    }

    next();
  }

  return router;
};
