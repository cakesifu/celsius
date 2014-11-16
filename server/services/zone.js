var _ = require("lodash"),
    Zone = require("../models/zone");

function ZoneService(broker) {
  if (!(this instanceof ZoneService)) {
    return new ZoneService(broker);
  }

  Object.defineProperties(this, {
    _broker: {value: broker},
    _loaded: {value: false},
    ready: {
      get: function() {
        return this._loaded;
      }
    }
  });
}

_.extend(ZoneService.prototype, {
  loadZones: function(callback) {
    var addZone = this.addZone.bind(this),
        self = this;

    Zone.all(function(err, zones) {
      zones.forEach(addZone);
      self._loaded = true;
    }, this._broker);

    return this;
  },

  // crud
  getZone: function(id) {
    return this[id];
  },

  addZone: function(zone) {
    this[zone._id] = zone;
    zone.startManaging();
  },

  updateZone: function(id, data, callback) {
    // TODO implement updating a zone via the service
    console.log("updating zone %s with data:", id, data);
    callback("not implemented");
  },

  createZone: function(data, callback) {
    // TODO implement creating a zone via the service
    console.log("creating a new zone with data:", data);
    callback("not implemented");
  },

  removeZone: function(id, callback) {
    // TODO implement removing a zone via the service
    console.log("remove zone:", id);
    callback("not implemented");
  }
});

module.exports = ZoneService;
