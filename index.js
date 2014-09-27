var config = require("./config"),
    logger = require("./lib/logger"),
    App = require("./server"),
    app;

app = new App(config);
app.start(config.get("port"), function(err) {
  logger.info("App started on port %s",  app.port);
});

