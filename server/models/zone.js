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
    _intervalId: {value: undefined, writable: true},
    _broker: {value: broker},
    _sensorUnit: {value: undefined, writable: true},
    _heaterUnit: {value: undefined, writable: true},
    sensor: {
      enumerable: true,
      get: unitGetter('_sensorUnit')
    },
    heater: {
      enumerable: true,
      get: unitGetter('_heaterUnit')
    }
  });

  broker.on("unitInfo", this._setupUnits.bind(this));
  broker.on("unitDisconnected", this._setupUnits.bind(this));

  this._setupUnits();
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
    datastore.update(doc, function(err, updated) {
      if (err) {
        return cb(err);
      }

      if (updated) {
        _.extend(zone, data);
      }
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

    this._sensorUnit = _.find(this._broker.activeUnits, function(unit) {
      var unitKey = unit.info && unit.info.key;
      return unitKey && unitKey === sensorKey;
    });
  }
});


function unitGetter(prop) {
  return function() {
    var unit = this[prop];
    if (!unit) {
      return null;
    }

    return {
      key: unit.info && unit.info.key,
      status: unit.status
    };
  };
}
module.exports = Zone;
