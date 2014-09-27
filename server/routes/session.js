var express = require("express"),
    router;

module.exports = function(app) {
  var router = express.Router();

  router.get("/current", function(req, res) {
    res.json({
      user: req.user
    });
  });

  return router;
}
