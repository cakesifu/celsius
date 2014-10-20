var Nedb = require("nedb"),
    _ = require("lodash"),
    path = require("path"),
    config = require("../../config"),
    Sensor = require("./sensor"),
    Heater = require("./heater"),

    datastore = new Nedb({
      filename: path.join(config.get("db.dataDir"), "zone.db"),
      autoload: true
    });

function Zone(data) {
  _.extend(this, data);
  this.sensor = new Sensor(data.sensor);
  this.heater = new Heater(data.heater);
}

Zone.find = function(id, callback) {
  datastore.findOne({ _id: id }, DataStoreCallback(callback));
};

Zone.all = function(callback) {
  datastore.find({}, DataStoreCallback(callback));
};

Zone.create = function(data, callback) {
  datastore.insert(data, DataStoreCallback(callback));
};

Zone.remove = function(query, callback) {
  datastore.remove(query, {}, function(err, num) {
    callback(err, num);
  });
};

Zone.prototype.asJson = function(options) {
  var out = {};

  out.id = this._id;
  out.name = this.name;
  out.sensor = this.sensor.asJson();
  out.heater = this.heater.asJson();

  return out;
};

Zone.prototype.remove = function(callback) {
  Zone.remove({ _id: this._id }, callback);
};

Zone.prototype.update = function(data, callback) {
  var id = this._id;
  datastore.update({ _id: id }, { $set: data }, function(err, count, zone) {
    if (err) {
      return callback(err);
    }

    Zone.find(id, callback);
  });
};

function DataStoreCallback(callback) {
  return function(err, data) {
    if (err) return callback(err);
    if (!data) return callback(null, data);
    callback(null, _.isArray(data) ? data.map(build) : build(data));
    function build(d) { return new Zone(d); }
  };
}

module.exports = Zone;
