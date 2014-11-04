var express = require("express");

module.exports = function(app) {
  var router = express.Router(),
      broker = app.get("broker");

  router.get("/", function(req, res) {
    res.json(broker.activeUnits.map(renderUnit));
  });

  function renderUnit(unit) {
    return {
      info: unit.info,
      status: unit.status,
      identity: unit.identity
    };
  }

  return router;
};
