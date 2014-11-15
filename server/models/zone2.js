var Datastore = require("../services/datastore"),
    _ = require("lodash"),

    makeCallback = Datastore.makeCallback.bind(Datastore, Zone),
    datastore = Datastore({model: "zone"}),

    MANAGE_INTERVAL =  30 * 1000; // 3 minutes

function Zone(data, broker) {
  if (!(this instanceof Zone)) {
    return new Zone(broker);
  }

  _.extend(this, data);

  Object.defineProperties(this, {
    _intervalId: {value: undefined},
    _broker: {value: broker},
    _sensor: {value: undefined}
  });
}

// class methods
_.extend(Zone, {
  all: function(cb, broker) {
    datastore.all(function(err, docs) {
      if (err) {
        return cb(err);
      }

      cb(undefined, docs.map(function(doc) {
        return new Zone(doc, broker);
      }));
    });
  },

  find: function(id, cb) {
    datastore.find(id, makeCallback(cb));
  },

  create: function(data, cb) {
    datastore.create(data, makeCallback(cb));
  }
});


// instance methods
_.extend(Zone.prototype, {
  update: function(data, cb) {
    var doc = _.extend({}, this, data),
        zone = this;
    datastore.update(doc, function(err, doc) {
      if (err) {
        return cb(err);
      }

      _.extend(zone, doc);
      cb(undefined, zone);
    });
  },

  remove: function(cb) {
    datastore.remove(this, cb);
  },

  startManaging: function() {
    this._intervalId = setInterval(this._manage.bind(this), MANAGE_INTERVAL);
  },

  stopManaging: function() {
    clearInterval(this._intervalId);
  },

  _manage: function() {
    console.log("managing zone: ", this._id);
  },

  _setupUnits: function() {
    var sensorKey = this.sensorKey;

    this._sensor = _.find(broker.activeUnits, function(unit) {
      return unit.info.key === sensorKey;
    });
  }

});

module.exports = Zone;
