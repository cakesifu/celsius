// TODO: move this to bunyan
var
    _ = require("lodash"),
    config = require("../config"),
    bunyan = require("bunyan");

function createLogger(config) {
  var options = {
    name: config.get("logger.name"),
    src: config.get("logger.src"),
    streams: []
  };

  if (config.get("logger.console")) {
    options.streams.push({
      level: config.get("logger.console.level"),
      stream: process.stdout
    });
  }

  var logger = bunyan.createLogger(options);
  return logger;
}

module.exports = createLogger(config);
