var Nedb = require("nedb"),
    _ = require("lodash"),
    path = require("path"),
    config = require("../../config"),
    Sensor = require("./sensor"),

    datastore = new Nedb({
      filename: path.join(config.get("db.dataDir"), "zone.db"),
      autoload: true
    });

function Zone(data) {
  this.data = data;
  this.sensor = new Sensor(data.sensor);
}

Zone.find = function(id, callback) {
  datastore.findOne({ _id: id }, DataStoreCallback(callback));
}

Zone.all = function(callback) {
  datastore.find({}, DataStoreCallback(callback));
}

Zone.create = function(data, callback) {
  datastore.insert(data, DataStoreCallback(callback));
}

Zone.prototype.asJson = function(options) {
  var out = {};

  out.id = this.data._id;
  out.name = this.data.name;
  out.sensor = this.sensor.asJson();

  return out;
}

function DataStoreCallback(callback) {
  return function(err, data) {
    if (err) {
      callback(err);
    }

    if (!data) {
      callback(null, data);
    }

    if (_.isArray(data)) {
      callback(null,  data.map(function(zone) {
        return new Zone(zone);
      }));
    } else {
      callback(null, new Zone(data));
    }
  }
}

module.exports = Zone;
