var _ = require("lodash"),
    models;


models = {
  User: require("./user"),
  Zone: require("./zone")
};

function modelsInit(app) {
  if (app) {
    app.set("models", models);
  }
}

_.extend(modelsInit, models);

module.exports = modelsInit;
