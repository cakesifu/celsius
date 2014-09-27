var express = require("express"),
    router;

module.exports = function(app) {
  var router = express.Router(),
      logger = app.get("logger");

  function homeController(request, response, next) {
    response.render("home");
  };

  router.get("/", homeController);

  return router;
}
