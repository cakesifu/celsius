var events = require("events"),
    util = require("util"),
    api = require("../lib/api");

function ServerUpdates() {

}

util.inherits(ServerUpdates, events.EventEmitter);

ServerUpdates.prototype.setCurrentZone = function(zone) {
  this.currentZone = zone;
};

ServerUpdates.prototype.start = function() {
  this._intervalId = setInterval(this._reload.bind(this), 2000);
};

ServerUpdates.prototype.stop = function() {
  clearInterval(this._intervalId);
};

ServerUpdates.prototype._reload = function() {
  var emit = this.emit.bind(this);
  if (this.currentZone) {
    api.getZone(this.currentZone._id, function(err, zone) {
      emit("update:currentZone", zone);
    });
  }
};

module.exports = new ServerUpdates();
