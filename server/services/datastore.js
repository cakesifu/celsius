var Nedb = require("nedb"),
    path = require("path"),
    config = require("../../config");


function Datastore(options) {
  var datastore, filename;

  if (!options.model) {
    throw Error("The 'model' property is mandatory in options");
  }

  filename = path.join(config.get("db.dataDir"), options.model + ".db");

  datastore = new Nedb({
      filename: filename,
      autoload: true
  });

  return Object.freeze({
    find: function(id, callback) {
      datastore.findOne({ _id: id }, callback);
    },

    all: function(callback) {
      datastore.find({}, callback);
    },

    create: function(doc, callback) {
      datastore.insert(doc, callback);
    },

    remove: function(doc, callback) {
      datastore.remove({ _id: doc._id }, callback);
    },

    update: function(doc, callback) {
      datastore.update({ _id: doc._id }, { $set: doc }, function(err, count) {
        callback(err, count === 1);
      });
    }
  });
}

Datastore.makeCallback = function(cls, cb) {
  return function(err, doc) {
    if (err) {
      return cb(err);
    }

    return cb(undefined, new cls(doc));
  };
};

module.exports = Datastore;
