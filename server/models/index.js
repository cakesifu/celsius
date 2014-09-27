var _ = require("lodash"),
    models;


models = {
  User: require("./user")
};

function modelsInit(app) {
  if (app) {
    app.set("models", models);
  }
}

_.extend(modelsInit, models);

module.exports = modelsInit;
