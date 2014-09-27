var config = require("../config"),
    _ = require("lodash"),
    Sequelize = require("sequelize"),
    dbRegistry = {};


function initDatabase(dbId) {
  var sequelize, dbConfig, dbName, options;

  dbConfig = config.get("db." + dbId);
  dbName = dbConfig.dbname || dbId;
  options = _.omit(dbConfig, ["user", "pass", "dbname"]);
  sequelize = new Sequelize(dbName, dbConfig.user, dbConfig.pass, options);

  return sequelize;
}

function getDatabase(dbName) {
  if (!dbRegistry[dbName]) {
    dbRegistry[dbName] = initDatabase(dbName);
  }

  return dbRegistry[dbName];
}


module.exports.getDatabase = function(dbName) {
  if (dbName === undefined) {
    dbName = "default";
  }

  if (dbName != "default") {
    throw "Unknown database default";
  }

  return getDatabase(dbName);
};


module.exports.JsonField = function(opts) {
  _.extend(opts, {
    get: function(attr) {
      console.log(attr);
      return JSON.parse(this.getDataValue(attr));
    },
    set: function(attr, val) {
      console.log("setting", arguments);
      this.setDataValue(attr, JSON.stringify(val));
    }
  });
  return opts;
}
