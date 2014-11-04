var _ = require("lodash"),
    routes;

routes = {
  "home": "/",
  "auth": "/auth",
  "session": "/session",
  "zone": "/zones",
  "units": "/units",
  "debug": "/debug" // TODO disable this in production
};

module.exports = function(app) {
  _.forEach(routes, function(path, moduleName) {
    var Route = require("./" + moduleName),
        route = Route(app);

    if (!route) {
      return;
    }

    if (path) {
      app.use(path, route);
    } else {
      app.use(route);
    }
  });
};
