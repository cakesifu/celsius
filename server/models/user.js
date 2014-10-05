var Nedb = require("nedb"),
    _ = require("lodash"),
    path = require("path"),
    config = require("../../config"),

    datastore = new Nedb({
      filename: path.join(config.get("db.dataDir"), "users.db"),
      autoload: true
    });

datastore.ensureIndex({ email: "email", unique: true });

function User(data) {
  _.extend(this, data);
}

User.find = function(id, callback) {
  datastore.findOne({ _id: id }, DataStoreCallback(callback));
};

User.findOrCreate = function(query, extraData, callback) {
  datastore.findOne(query, function(err, user) {
    var data;
    if (err) return callback(err);
    if (user) return callback(null, new User(user));

    data = _.extend({}, query, extraData);
    return User.create(data, DataStoreCallback(callback));
  });
};

User.create = function(data, callback) {
  datastore.insert(data, DataStoreCallback(callback));
};

function DataStoreCallback(callback) {
  return function(err, data) {
    if (err) return callback(err);
    if (!data) return callback(null, data);
    callback(null, _.isArray(data) ? data.map(build) : build(data));
    function build(d) { return new User(d); }
  }
}

module.exports = User;
