var express = require("express"),
    router;

module.exports = function(app) {
  var router = express.Router(),
      logger = app.get("logger");

  function debugController(req, res) {
    res.json({
      currentUser: req.user,
      session: req.session
    });
  };

  router.get("/debug", debugController);

  return router;
}
