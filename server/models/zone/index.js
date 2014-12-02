var Datastore = require("../../services/datastore"),
    _ = require("lodash"),
    ZoneHistory = require("./history"),

    makeCallback = Datastore.makeCallback.bind(Datastore, Zone),
    datastore = Datastore({model: "zone"}),

    HISTORY_INTERVAL = 30 * 1000,  // 5 minutes
    MANAGE_INTERVAL =  3 * 1000; // 5 seconds

function Zone(data, broker) {
  var history;

  if (!(this instanceof Zone)) {
    return new Zone(broker);
  }

  _.extend(this, data);

  history = new ZoneHistory(this);

  Object.defineProperties(this, {
    _intervals: {value: {}, writable: true},
    _broker: {value: broker},
    _history: {value: history},
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
    datastore.insert(data, makeCallback(cb));
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
    this._intervals.manage = setInterval(this._manage.bind(this), MANAGE_INTERVAL);
    this._intervals.histoty = setInterval(this._updateHistory.bind(this), HISTORY_INTERVAL);
  },

  stopManaging: function() {
    clearInterval(this._intervals.manage);
    clearInterval(this._intervals.history);
  },

  getHistory: function(options, cb) {
    this._history.getSensorRecords(options, cb);
  },

  _manage: function() {
    var sensor = this.sensor,
        heater = this.heater,
        crtTemp = sensor && sensor.status && sensor.status.value;

    if (sensor && heater && sensor.status && heater.status) {
      console.log("Sensor: %s, Target: %s, Heater: %s", sensor.status.value, this.targetTemperature, heater.status.value);
      if (crtTemp < this.targetTemperature) {
        console.log("Turning heater on");
        this._heaterUnit.sendCommand("start");
      } else {
        console.log("Turning heater off");
        this._heaterUnit.sendCommand("stop");
      }
    }
  },

  _updateHistory: function() {
    var sensor = this._sensorUnit;

    if (sensor && sensor.status) {
      this._history.addSensorRecord(sensor.status.value);
    }
  },

  _setupUnits: function() {
    this._sensorUnit = this._findUnit(this.sensorKey);
    this._heaterUnit = this._findUnit(this.heaterKey);
  },

  _findUnit: function(key) {
    return _.find(this._broker.activeUnits, function(unit) {
      var unitKey = unit.info && unit.info.key;
      return unitKey && unitKey === key;
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
