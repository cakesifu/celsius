var logger = require("../lib/logger"),
    _ = require("lodash"),
    async = require("async"),
    express = require("express"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    cookieSession = require("cookie-session"),
    loggerMiddleware = require("morgan"),

    routesInit = require("./routes"),
    modelsInit = require("./models");

module.exports = function(app, config) {

  app.set('config', config);
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");

  // logging
  app.use(loggerMiddleware('dev'));
  app.set("logger", logger);

  // static assets
  app.use("/static", express.static(config.get("static.path")));

  // session management
  app.use(cookieSession({
    name: "session",
    keys: ["foo", "bar"], // TODO move these to config
  }));

  // body parsing middleware
  app.use(bodyParser.json({
  }));

  // plug in passport (auth middleware)
  app.use(passport.initialize());
  app.use(passport.session());

  // initialize all the routes in the app
  routesInit(app);

  // initialize all the models
  modelsInit(app);
};
