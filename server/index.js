var
    express = require("express"),
    init = require("./init"),
    http = require('http');

function App(config) {
  var app, instance;

  app = express();
  init(app, config);

  function startApp(done) {
    instance.server = app.listen(instance.port, done);
  }

  function stopApp(done) {
    var server = instance.server;
    instance.server = undefined;
    instance.port = undefined;
    server.close(done);
  }

  instance = {
    app: app,
    server: null,
    port: null,

    start: function(port, callback) {
      instance.port = port;
      startApp(callback);
    },

    stop: function(callback) {
      stopApp(callback);
    }
  };

  return instance;
}

module.exports = App;
